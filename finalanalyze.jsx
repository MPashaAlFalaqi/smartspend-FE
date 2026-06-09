import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2' 

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function FinalAnalyze() {
  const navigate = useNavigate()
  const [loadingSimpan, setLoadingSimpan] = useState(false)

  // ===== STATE UTAMA =====
  const [analisis, setAnalisis] = useState({
    penghasilan: 0,
    totalPengeluaran: 0,
    tabungan: 0,
    percent: 0,
    namaUser: 'User',
    pesanAnalisis: 'Belum ada data analisis. Silakan atur anggaran kamu di menu Budget Planner terlebih dahulu.',
    kategori: 'konservatif'
  })

  // ===== STATE UNTUK FOTO PROFILE =====
  const [fotoUser, setFotoUser] = useState(
    localStorage.getItem('fotoUser') || localStorage.getItem('user_avatar') || null
  )

  // Mengambil inisial nama untuk lingkaran avatar di Navbar
  const getInisial = (nama) => {
    if (!nama) return 'U'
    const kata = nama.trim().split(' ')
    if (kata.length > 1) {
      return (kata[0][0] + kata[1][0]).toUpperCase()
    }
    return kata[0].substring(0, 2).toUpperCase()
  }

  useEffect(() => {
    // 1. Ambil data kalkulasi finansial dari localStorage
    const income = parseInt(localStorage.getItem('analisis_pemasukan') || '0')
    const expense = parseInt(localStorage.getItem('analisis_pengeluaran') || '0')
    const saving = parseInt(localStorage.getItem('analisis_tabungan') || '0')
    const percentage = parseInt(localStorage.getItem('analisis_persen') || '0')
    const msg = localStorage.getItem('analisis_pesan') || 'Belum ada data analisis.'
    
    // Cek beberapa kemungkinan key localStorage yang tersimpan agar pencocokan lebih aman
    const kategoriRaw = localStorage.getItem('analisis_kategori') || localStorage.getItem('risk_profile') || 'konservatif'
    let finalKategori = 'konservatif'
    if (kategoriRaw.toLowerCase().includes('agresif')) finalKategori = 'agresif'
    if (kategoriRaw.toLowerCase().includes('moderat')) finalKategori = 'moderat'

    // 2. AMBIL NAMA USER (SINKRON & SEJALUR DENGAN BUDGET PLANNER)
    const user = localStorage.getItem('namaUser') || localStorage.getItem('user_name') || 'User'

    setAnalisis({
      penghasilan: income,
      totalPengeluaran: expense,
      tabungan: saving,
      persen: percentage,
      namaUser: user,
      pesanAnalisis: msg,
      kategori: finalKategori
    })

    // SINKRONKAN KEMBALI FOTO USER JIKA ADA PERUBAHAN
    setFotoUser(localStorage.getItem('fotoUser') || localStorage.getItem('user_avatar') || null)
  }, [])

  // ===== FUNGSI SIMPAN KE LARAVEL =====
  const handleSimpanAnalisis = async () => {
    setLoadingSimpan(true)
    try {
      const token = localStorage.getItem('token')
      const userEmail = localStorage.getItem('user_email') 

      // Mengonversi string kategori menjadi format text database/admin panel yang konsisten
      let namaKategoriAdmin = 'Konservatif'
      if (analisis.kategori === 'moderat') namaKategoriAdmin = 'Moderat'
      if (analisis.kategori === 'agresif') namaKategoriAdmin = 'Agresif' 

      const dataKirim = {
        total_pemasukan: analisis.penghasilan,
        budget_pokok: Math.round(analisis.totalPengeluaran * 0.7),
        budget_keinginan: Math.round(analisis.totalPengeluaran * 0.3),
        budget_tabungan: analisis.tabungan,
        risk_profile: namaKategoriAdmin,
        email: userEmail 
      }

      const response = await axios.post('http://127.0.0.1:8000/api/final-analyze/save', dataKirim, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      })

      if (response.data.success) {
        // ==========================================================
        // KUNCI UTAMA SINKRONISASI:
        // Set data profil risiko terbaru ke localStorage sebelum pindah halaman,
        // supaya Dashboard langsung membacanya tanpa delay data lama.
        // ==========================================================
        localStorage.setItem('profilRisiko', namaKategoriAdmin)
        localStorage.setItem('risk_profile', namaKategoriAdmin)

        Swal.fire({
          title: 'Analisis Tersimpan!',
          text: 'Data analisis keuanganmu berhasil disimpan ke sistem dengan aman.',
          icon: 'success',
          iconColor: GOLD,
          confirmButtonColor: MAROON,
          confirmButtonText: 'Ke Dashboard 👋',
          background: CREAM,
          customClass: {
            title: 'swal-title-custom',
            htmlContainer: 'swal-text-custom'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard')
          }
        })
      }
    } catch (error) {
      console.error("Gagal mengirim hasil analisis ke backend:", error)
      Swal.fire({
        title: 'Sinkronisasi Gagal',
        text: error.response?.data?.message || 'Gagal terhubung ke server. Sesi token mungkin tidak valid.',
        icon: 'warning',
        iconColor: GOLD,
        confirmButtonColor: MAROON,
        confirmButtonText: 'Lanjutkan',
        background: CREAM
      }).then(() => {
        navigate('/dashboard')
      })
    } finally {
      setLoadingSimpan(false)
    }
  }

  const formatRp = (val) => parseInt(val || 0).toLocaleString('id-ID')

  const kategoriInfo = {
    konservatif: {
      label: 'Risiko Konservatif',
      color: '#3B82F6',
      bg: '#EBF4FF',
      icon: '🔵',
      desc: 'Kondisi keuangan kamu stabil. Sebagian besar pengeluaran masih dalam batas aman, dengan alokasi tabungan mencukupi dari pendapatan.'
    },
    moderat: {
      label: 'Risiko Moderat',
      color: GREEN,
      bg: '#E8F5F0',
      icon: '🟢',
      desc: 'Kamu cukup seimbang antara pengeluaran dan tabungan. Disarankan untuk tetap memantau batas anggaran pengeluaran sekunder secara berkala.'
    },
    agresif: {
      label: 'Risiko Agresif & Overspending',
      color: RED,
      bg: '#FEE8E8',
      icon: '🔴',
      desc: 'Kamu mendekati atau telah melewati batas anggaran aman bulan ini. Pertimbangkan untuk menekan pengeluaran non-prioritas agar kas tetap aman.'
    }
  }

  const summaryCards = [
    {
      label: 'TOTAL PEMASUKAN',
      value: `Rp ${formatRp(analisis.penghasilan)}`,
      sub: 'Bulan ini',
      color: MAROON,
      subColor: '#9CA3AF',
      badge: false
    },
    {
      label: 'TOTAL PENGELUARAN',
      value: `Rp ${formatRp(analisis.totalPengeluaran)}`,
      sub: `${analisis.persen}% terpakai`,
      color: analisis.totalPengeluaran > analisis.penghasilan ? RED : MAROON,
      subColor: GOLD,
      badge: true
    },
    {
      label: 'TABUNGAN BULAN INI',
      value: `Rp ${formatRp(analisis.tabungan)}`,
      sub: analisis.tabungan < (analisis.penghasilan * 0.1) ? 'Di bawah target' : 'Sesuai target',
      color: GREEN,
      subColor: GOLD,
      badge: true
    },
    {
      label: 'PROFIL RISIKO',
      value: analisis.kategori === 'agresif' ? 'Overspending' : analisis.kategori === 'moderat' ? 'Moderat' : 'Konservatif',
      sub: 'Berdasarkan alokasi budget',
      color: analisis.kategori === 'agresif' ? RED : analisis.kategori === 'moderat' ? GREEN : '#3B82F6',
      subColor: '#9CA3AF',
      badge: false
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .card-item { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-item:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
        .swal-title-custom { font-family: 'Poppins', sans-serif !important; font-weight: 700 !important; color: ${MAROON} !important; }
        .swal-text-custom { font-family: 'Poppins', sans-serif !important; color: #4B5563 !important; font-size: 14px !important; }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: CREAM }}>

        {/* ===== NAVBAR ===== */}
        <nav style={{ backgroundColor: MAROON, height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span style={{ color: GOLD, fontWeight: '700', fontSize: '20px' }}>SmartSpend</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <span style={{ backgroundColor: GOLD, color: MAROON, fontWeight: '600', fontSize: '14px', padding: '6px 16px', borderRadius: '20px' }}>Final Analyze</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              backgroundColor: GOLD, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {fotoUser ? (
                <img 
                  src={fotoUser} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={() => setFotoUser(null)}
                />
              ) : (
                <span style={{ color: MAROON, fontWeight: '700', fontSize: '13px' }}>
                  {getInisial(analisis.namaUser)}
                </span>
              )}
            </div>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{analisis.namaUser}</span>
          </div>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>
          
          {/* TITLE SECTION */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: MAROON, marginBottom: '4px' }}>Analisis Akhir Keuangan</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Ringkasan dan rekomendasi kesehatan finansial berdasarkan perencanaan budget kamu</p>
          </div>

          {/* RENDER SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
            {summaryCards.map((item, i) => (
              <div key={i} className="card-item" style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: '600' }}>{item.label}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: item.color, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</p>
                {item.badge ? (
                  <span style={{ display: 'inline-block', backgroundColor: item.label.includes('PENGELUARAN') && analisis.persen > 80 ? RED : GOLD, color: 'white', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{item.sub}</span>
                ) : (
                  <p style={{ fontSize: '13px', color: item.subColor }}>{item.sub}</p>
                )}
              </div>
            ))}
          </div>

          {/* HASIL ANALISIS RISIKO */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: GOLD, borderRadius: '50%' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: MAROON }}>Hasil Analisis Risiko</h2>
            </div>

            {Object.entries(kategoriInfo).map(([key, info]) => {
              const isProfileAktif = analisis.kategori === key;
              return (
                <div key={key} style={{
                  backgroundColor: isProfileAktif ? info.bg : '#F9FAFB',
                  border: isProfileAktif ? `1.5px solid ${info.color}` : '1.5px solid transparent',
                  borderRadius: '12px', padding: '20px', marginBottom: '12px',
                  transition: 'all 0.25s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{info.icon}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: isProfileAktif ? info.color : '#6B7280' }}>
                      {info.label}
                    </h3>
                    {isProfileAktif && (
                      <span style={{ marginLeft: 'auto', backgroundColor: info.color, color: 'white', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                        Profil Kamu ✓
                      </span>
                    )}
                  </div>
                  
                  <p style={{ fontSize: '13px', color: isProfileAktif ? '#374151' : '#9CA3AF', lineHeight: '1.6', fontWeight: isProfileAktif ? '500' : '400' }}>
                    {isProfileAktif ? analisis.pesanAnalisis : info.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTON */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={handleSimpanAnalisis} 
              disabled={loadingSimpan}
              style={{ padding: '12px 32px', backgroundColor: MAROON, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(107,15,26,0.15)', transition: 'all 0.2s', opacity: loadingSimpan ? 0.7 : 1 }}
              onMouseOver={(e) => { if(!loadingSimpan) e.currentTarget.style.backgroundColor = '#540B14' }}
              onMouseOut={(e) => { if(!loadingSimpan) e.currentTarget.style.backgroundColor = MAROON }}
            >
              {loadingSimpan ? 'Menyimpan Hasil...' : '✓ Simpan & Selesai Analisis'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}