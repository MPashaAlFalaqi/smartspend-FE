import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function FinalAnalyze() {
  const navigate = useNavigate()

  // ===== AMBIL HASIL ANALISIS REAL-TIME DARI LOCALSTORAGE =====
  const penghasilan      = parseInt(localStorage.getItem('analisis_pemasukan')   || localStorage.getItem('penghasilan') || '0')
  const totalPengeluaran = parseInt(localStorage.getItem('analisis_pengeluaran') || '0')
  const tabungan         = parseInt(localStorage.getItem('analisis_tabungan')    || '0')
  const persen           = parseInt(localStorage.getItem('analisis_persen')       || '0')
  const namaUser         = localStorage.getItem('namaUser')                      || 'Lila Mahasiswa'
  const pesanAnalisis    = localStorage.getItem('analisis_pesan')                 || 'Belum ada data analisis. Silakan atur anggaran kamu di menu Budget Planner terlebih dahulu.'

  // Normalisasi string kategori agar pencocokan objek key di bawah tidak meleset
  const kategoriRaw      = localStorage.getItem('analisis_kategori')             || 'konservatif'
  const kategori         = kategoriRaw.toLowerCase().includes('agresif') ? 'agresif' : 
                           kategoriRaw.toLowerCase().includes('moderat')  ? 'moderat'  : 'konservatif'

  const formatRp = (val) => parseInt(val || 0).toLocaleString('id-ID')

  // Data Base Info Kategori Struktural
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

  // ===== STRUKTUR SUMMARY CARDS DENGAN DATA REAL-TIME =====
  const summaryCards = [
    {
      label: 'TOTAL PEMASUKAN',
      value: `Rp ${formatRp(penghasilan)}`,
      sub: 'Bulan ini',
      color: MAROON,
      subColor: '#9CA3AF',
      badge: false
    },
    {
      label: 'TOTAL PENGELUARAN',
      value: `Rp ${formatRp(totalPengeluaran)}`,
      sub: `${persen}% terpakai`,
      color: totalPengeluaran > penghasilan ? RED : MAROON,
      subColor: GOLD,
      badge: true
    },
    {
      label: 'TABUNGAN BULAN INI',
      value: `Rp ${formatRp(tabungan)}`,
      sub: tabungan < (penghasilan * 0.1) ? 'Di bawah target' : 'Sesuai target',
      color: GREEN,
      subColor: GOLD,
      badge: true
    },
    {
      label: 'PROFIL RISIKO',
      value: kategoriInfo[kategori]?.label.split(' ')[1] || 'Konservatif',
      sub: 'Berdasarkan alokasi budget',
      color: kategori === 'agresif' ? RED : kategori === 'moderat' ? GREEN : '#3B82F6',
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
            <div style={{ width: '36px', height: '36px', backgroundColor: GOLD, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: MAROON, fontWeight: '700', fontSize: '13px' }}>LM</span>
            </div>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{namaUser}</span>
          </div>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>
          
          {/* TITLE SECTION */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: MAROON, marginBottom: '4px' }}>Analisis Akhir Keuangan</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Ringkasan dan rekomendasi kesehatan finansial berdasarkan perencanaan budget kamu</p>
          </div>

          {/* RENDER SUMMARY CARDS DATA REAL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
            {summaryCards.map((item, i) => (
              <div key={i} className="card-item" style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: '600' }}>{item.label}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: item.color, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</p>
                {item.badge ? (
                  <span style={{ display: 'inline-block', backgroundColor: item.label.includes('PENGELUARAN') && persen > 80 ? RED : GOLD, color: 'white', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{item.sub}</span>
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
              const isProfileAktif = kategori === key;
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
                    {isProfileAktif ? pesanAnalisis : info.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* BACK TO DASHBOARD SHORTCUT */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{ padding: '12px 28px', backgroundColor: MAROON, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(107,15,26,0.15)', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#540B14'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = MAROON}
            >
              ← Kembali ke Dashboard
            </button>
          </div>

        </div>
      </div>
    </>
  )
}