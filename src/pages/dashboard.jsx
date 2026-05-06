import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function Dashboard() {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [notifAktif, setNotifAktif] = useState(false)
  const [showNotifBell, setShowNotifBell] = useState(true)

  const handleAktifkan = () => {
    setNotifAktif(true)
    setShowNotifBell(false)
  }

  const handleTidak = () => {
    setShowNotifBell(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .shortcut-card { background:white; border-radius:14px; padding:20px 24px; display:flex; align-items:center; gap:16px; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:all 0.2s; flex:1; text-decoration:none; }
        .shortcut-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(107,15,26,0.12); }
        .dropdown-item { padding:12px 16px; cursor:pointer; display:flex; align-items:center; gap:10px; font-size:14px; color:#1A1A1A; transition:background 0.2s; border-radius:8px; }
        .dropdown-item:hover { background:#F5F0E8; }
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>

        {/* ===== NAVBAR ===== */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
          </div>

          {/* Nav Links */}
          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <Link to="/login" className="nav-link">Login</Link>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Dashboard</span>
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>

          {/* Right — Bell + Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            
            {/* Bell */}
            <div style={{ position:'relative', cursor:'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              {showNotifBell && (
                <span style={{ position:'absolute', top:'-4px', right:'-4px', backgroundColor:RED, borderRadius:'50%', width:'16px', height:'16px', fontSize:'10px', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>1</span>
              )}
            </div>

            {/* Divider */}
            <div style={{ width:'1px', height:'24px', backgroundColor:'rgba(255,255,255,0.3)' }}/>

            {/* Avatar + Nama */}
            <div style={{ position:'relative' }}>
              <div onClick={() => setShowDropdown(!showDropdown)} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>LM</span>
                </div>
                <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>Lila Mahasiswa</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div style={{ position:'absolute', right:0, top:'48px', backgroundColor:'white', borderRadius:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', width:'220px', padding:'8px', zIndex:200 }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #F3F4F6', marginBottom:'4px' }}>
                    <div style={{ fontWeight:'600', fontSize:'14px', color:'#1A1A1A' }}>Lila Mahasiswa</div>
                    <div style={{ fontSize:'12px', color:'#9CA3AF' }}>lila@email.com</div>
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/user-profile'); setShowDropdown(false) }}>
                    <span>👤</span> Profil Saya
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/history'); setShowDropdown(false) }}>
                    <span>🕐</span> Riwayat Transaksi
                  </div>
                  <div style={{ borderTop:'1px solid #F3F4F6', marginTop:'4px', paddingTop:'4px' }}>
                    <div className="dropdown-item" onClick={() => { setShowDropdown(false); setShowLogoutModal(true) }} style={{ color:RED }}>
                      <span>🚪</span> Keluar
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ===== CONTENT ===== */}
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'28px 32px' }}>

          {/* Hero Banner */}
          {/* Hero Banner */}
<div style={{ 
  backgroundColor:MAROON, 
  borderRadius:'16px', 
  padding:'32px', 
  marginBottom:'20px', 
  position:'relative', 
  overflow:'hidden',
  backgroundImage:'radial-gradient(circle at 80% 50%, rgba(201,168,76,0.2) 0%, transparent 60%)'
}}>
  {/* Badge Profil Risiko */}
  <div style={{ 
    position:'absolute', 
    top:'16px', 
    right:'16px', 
    backgroundColor:'rgba(255,255,255,0.15)', 
    padding:'6px 14px', 
    borderRadius:'20px' 
  }}>
    <span style={{ color:'white', fontSize:'13px', fontWeight:'500' }}>
      Profil Risiko: Moderat
    </span>
  </div>

  {/* Teks rata kiri */}
  <div style={{ textAlign:'left' }}>
    <p style={{ 
      color:GOLD, 
      fontSize:'14px', 
      marginBottom:'8px',
      display:'block'
    }}>
      Selamat datang kembali 👋
    </p>
    <h1 style={{ 
      color:'white', 
      fontSize:'32px', 
      fontWeight:'700', 
      marginBottom:'8px',
      display:'block'
    }}>
      Lila Mahasiswa
    </h1>
    <p style={{ 
      color:'rgba(255,255,255,0.7)', 
      fontSize:'14px', 
      marginBottom:'4px',
      display:'block'
    }}>
      Total Pemasukan Bulan Ini
    </p>
    <p style={{ 
      color:GOLD, 
      fontSize:'28px', 
      fontWeight:'700',
      display:'block'
    }}>
      Rp 3.000.000
    </p>
  </div>

  {/* Decorative circles */}
  <div style={{ 
    position:'absolute', 
    right:'120px', 
    bottom:'-20px', 
    width:'120px', 
    height:'120px', 
    borderRadius:'50%', 
    backgroundColor:'rgba(255,255,255,0.05)' 
  }}/>
  <div style={{ 
    position:'absolute', 
    right:'60px', 
    bottom:'-40px', 
    width:'160px', 
    height:'160px', 
    borderRadius:'50%', 
    backgroundColor:'rgba(255,255,255,0.05)' 
  }}/>
</div>

          {/* Shortcut Cards */}
          <div style={{ display:'flex', gap:'16px', marginBottom:'20px' }}>
            {[
              { icon:'👤', title:'Risk Profile', sub:'Kenali profil risiko finansial Anda', path:'/risk-profile' },
              { icon:'📊', title:'Final Analyze', sub:'Lihat hasil analisis keuangan', path:'/final-analyze' },
              { icon:'💰', title:'Budget Planner', sub:'Catat dan analisis pengeluaran', path:'/budget-planner' },
            ].map((item, i) => (
              <div key={i} className="shortcut-card" onClick={() => navigate(item.path)}>
                <div style={{ width:'44px', height:'44px', backgroundColor:MAROON, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                  {item.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:'600', fontSize:'15px', color:'#1A1A1A', marginBottom:'2px' }}>{item.title}</div>
                  <div style={{ fontSize:'13px', color:'#9CA3AF' }}>{item.sub}</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#D1D5DB">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Ringkasan Bulan Ini */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
                <h2 style={{ fontWeight:'700', fontSize:'18px', color:MAROON }}>Ringkasan Bulan Ini</h2>
              </div>
              <span onClick={() => navigate('/history')} style={{ color:GOLD, fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>Lihat Riwayat →</span>
            </div>

            {[
              { label:'Pengeluaran Pokok', amount:'Rp 1.650.000', persen:55, color:MAROON },
              { label:'Pengeluaran Keinginan', amount:'Rp 750.000', persen:25, color:GOLD },
              { label:'Tabungan & Investasi', amount:'Rp 600.000', persen:20, color:GREEN },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? '20px' : '0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize:'14px', fontWeight:'500', color:'#1A1A1A' }}>{item.label}</span>
                  <div style={{ display:'flex', gap:'16px' }}>
                    <span style={{ fontSize:'13px', color:'#9CA3AF' }}>{item.amount}</span>
                    <span style={{ fontSize:'14px', fontWeight:'700', color:item.color }}>{item.persen}%</span>
                  </div>
                </div>
                <div style={{ backgroundColor:'#F3F4F6', borderRadius:'10px', height:'10px', overflow:'hidden' }}>
                  <div style={{ width:`${item.persen}%`, height:'100%', backgroundColor:item.color, borderRadius:'10px', transition:'width 0.8s ease' }}/>
                </div>
              </div>
            ))}

            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'20px', paddingTop:'16px', borderTop:'1px solid #F3F4F6' }}>
              <span style={{ fontSize:'13px', color:'#9CA3AF' }}>Total Pengeluaran: <strong style={{ color:'#1A1A1A' }}>Rp 2.800.000</strong></span>
              <span style={{ fontSize:'13px', color:GREEN, fontWeight:'600' }}>Sisa Anggaran: Rp 200.000</span>
            </div>
          </div>

          {/* Spending Alert */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontWeight:'700', fontSize:'18px', color:MAROON }}>Spending Alert</h2>
            </div>

            {/* Warning Banner */}
            <div style={{ backgroundColor:'#FEF2F2', borderLeft:`4px solid ${RED}`, borderRadius:'10px', padding:'14px 16px', marginBottom:'16px', display:'flex', alignItems:'flex-start', gap:'10px' }}>
              <span style={{ fontSize:'18px' }}>⚠️</span>
              <div>
                <p style={{ color:RED, fontWeight:'600', fontSize:'14px', marginBottom:'2px' }}>Peringatan! Pengeluaranmu telah mencapai 95% dari total anggaran bulan ini.</p>
                <p style={{ color:RED, fontSize:'13px' }}>Pertimbangkan untuk mengurangi pengeluaran non-prioritas.</p>
              </div>
            </div>

            {/* Notif Card */}
            {!notifAktif ? (
              <div style={{ border:`1.5px solid ${GOLD}`, borderRadius:'12px', padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
                  <div style={{ width:'48px', height:'48px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'22px' }}>🔔</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:'600', fontSize:'15px', color:MAROON, marginBottom:'6px' }}>Aktifkan Notifikasi Overspending</p>
                    <p style={{ fontSize:'13px', color:'#6B7280', lineHeight:'1.6', marginBottom:'16px' }}>Fitur ini akan memantau pengeluaran dan memberi peringatan saat pengeluaran mendekati batas anggaran yang telah ditetapkan.</p>
                    <div style={{ display:'flex', gap:'12px' }}>
                      <button onClick={handleTidak} style={{ padding:'10px 24px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'8px', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>
                        ✕ Tidak
                      </button>
                      <button onClick={handleAktifkan} style={{ flex:1, padding:'10px 24px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(107,15,26,0.3)' }}>
                        ✓ Aktifkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ border:`1.5px solid ${GREEN}`, backgroundColor:'#F0FDF4', borderRadius:'12px', padding:'20px', display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'48px', height:'48px', backgroundColor:GREEN, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'22px' }}>✅</div>
                <div>
                  <p style={{ fontWeight:'600', fontSize:'15px', color:GREEN, marginBottom:'4px' }}>Notifikasi Overspending Aktif</p>
                  <p style={{ fontSize:'13px', color:'#6B7280' }}>Sistem akan memantau pengeluaranmu secara otomatis.</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px' }}>
            {[
              { label:'Total Pemasukan', value:'Rp 3.000.000', color:GREEN, badge:null, icon:'↑' },
              { label:'Total Pengeluaran', value:'Rp 2.800.000', color:RED, badge:'95% terpakai', icon:null },
              { label:'Tabungan Bulan Ini', value:'Rp 200.000', color:GOLD, badge:'Di bawah target', icon:null },
              { label:'Profil Risiko', value:'Moderat', color:MAROON, badge:null, sub:'Tetap stabil bulan ini' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${item.color}` }}>
                <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' }}>{item.label}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <p style={{ fontSize:'22px', fontWeight:'700', color:item.color }}>{item.value}</p>
                  {item.icon && <span style={{ color:item.color, fontSize:'18px', fontWeight:'700' }}>{item.icon}</span>}
                </div>
                {item.badge && (
                  <span style={{ display:'inline-block', backgroundColor:GOLD, color:'white', fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px', marginTop:'6px' }}>{item.badge}</span>
                )}
                {item.sub && <p style={{ fontSize:'12px', color:'#9CA3AF', marginTop:'4px' }}>{item.sub}</p>}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ===== LOGOUT MODAL ===== */}
      {showLogoutModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width:'72px', height:'72px', backgroundColor:'#FEE8E8', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'32px' }}>🚪</div>
            <h2 style={{ color:MAROON, fontSize:'22px', fontWeight:'700', marginBottom:'10px' }}>Yakin ingin keluar?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', lineHeight:'1.6', marginBottom:'24px' }}>Kamu akan keluar dari sesi SmartSpend. Pastikan semua data sudah tersimpan.</p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                ← Batal
              </button>
              <button onClick={() => navigate('/')} style={{ flex:1, height:'48px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                Ya, Keluar 🚪
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}