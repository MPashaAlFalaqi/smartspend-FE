import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function FinalAnalyze() {
  const navigate = useNavigate()

  // ===== AMBIL HASIL ANALISIS DARI BUDGET PLANNER =====
  const penghasilan      = parseInt(localStorage.getItem('analisis_pemasukan')   || localStorage.getItem('penghasilan') || '3000000')
  const totalPengeluaran = parseInt(localStorage.getItem('analisis_pengeluaran') || '0')
  const tabungan         = parseInt(localStorage.getItem('analisis_tabungan')    || '0')
  const persen           = parseInt(localStorage.getItem('analisis_persen')      || '0')
  const kategori         = localStorage.getItem('analisis_kategori')             || 'konservatif'
  const pesanAnalisis    = localStorage.getItem('analisis_pesan')                || ''
  const namaUser         = localStorage.getItem('namaUser')                      || 'Pengguna'

  const formatRp = (val) => parseInt(val||0).toLocaleString('id-ID')

  // Data Base Info Kategori Struktural
  const kategoriInfo = {
    konservatif: {
      label: 'Risiko Konservatif',
      color: '#3B82F6',
      bg: '#EBF4FF',
      icon: '🔵',
      desc: 'Kondisi keuangan kamu stabil. Sebagian besar pengeluaran masih dalam batas aman, dengan alokasi tabungan mencapai 25% dari pendapatan.'
    },
    moderat: {
      label: 'Risiko Moderat',
      color: GREEN,
      bg: '#E8F5F0',
      icon: '🟢',
      desc: 'Kamu cukup seimbang antara pengeluaran dan tabungan, tapi ada peningkatan pengeluaran di kategori hiburan sebesar 18%. Disarankan untuk meninjau ulang batas anggaran.'
    },
    agresif: {
      label: 'Risiko Agresif & Overspending',
      color: RED,
      bg: '#FEE8E8',
      icon: '🔴',
      desc: 'Kamu telah melewati batas anggaran sebesar 27% dari total budget bulan ini. Pertimbangkan untuk menekan pengeluaran non-prioritas agar keuangan tetap terkendali.'
    }
  }

  // ===== PERINTAH TAMBAHAN: UPDATE SUMMARY CARDS DENGAN DATA REAL =====
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
      color: RED,
      subColor: GOLD,
      badge: true
    },
    {
      label: 'TABUNGAN BULAN INI',
      value: `Rp ${formatRp(tabungan)}`,
      sub: tabungan < penghasilan * 0.2 ? 'Di bawah target' : 'Sesuai target',
      color: GREEN,
      subColor: GOLD,
      badge: true
    },
    {
      label: 'PROFIL RISIKO',
      value: kategori.charAt(0).toUpperCase() + kategori.slice(1),
      sub: 'Berdasarkan pengeluaran',
      color: MAROON,
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
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>

        {/* NAVBAR */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Final Analyze</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>LM</span>
            </div>
            <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>{namaUser}</span>
          </div>
        </nav>

        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px' }}>

          {/* RENDER SUMMARY CARDS DATA REAL */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            {summaryCards.map((item, i) => (
              <div key={i} style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px', fontWeight:'600' }}>{item.label}</p>
                <p style={{ fontSize:'22px', fontWeight:'700', color:item.color, marginBottom:'8px' }}>{item.value}</p>
                {item.badge ? (
                  <span style={{ display:'inline-block', backgroundColor:GOLD, color:'white', fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px' }}>{item.sub}</span>
                ) : (
                  <p style={{ fontSize:'13px', color:item.subColor }}>{item.sub}</p>
                )}
              </div>
            ))}
          </div>

          {/* HASIL ANALISIS RISIKO */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontSize:'20px', fontWeight:'700', color:MAROON }}>Hasil Analisis Risiko</h2>
            </div>

            {Object.entries(kategoriInfo).map(([key, info]) => (
              <div key={key} style={{
                backgroundColor: kategori===key ? info.bg : '#F9FAFB',
                border: kategori===key ? `1.5px solid ${info.color}` : '1.5px solid transparent',
                borderRadius:'12px', padding:'20px', marginBottom:'12px',
                transition:'all 0.3s'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                  <span style={{ fontSize:'18px' }}>{info.icon}</span>
                  <h3 style={{ fontSize:'15px', fontWeight:'700', color: kategori===key ? info.color : '#9CA3AF' }}>
                    {info.label}
                  </h3>
                  {kategori===key && (
                    <span style={{ marginLeft:'auto', backgroundColor:info.color, color:'white', fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px' }}>
                      Profil Kamu ✓
                    </span>
                  )}
                </div>
                {/* ===== PERINTAH TAMBAHAN: DESKRIPSI TERNARY DENGAN PESAN BUDGET PLANNER ===== */}
                <p style={{ fontSize:'13px', color: kategori===key ? '#374151' : '#9CA3AF', lineHeight:'1.6' }}>
                  {kategori===key ? pesanAnalisis : info.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}