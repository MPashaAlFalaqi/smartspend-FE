import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'
const BLUE = '#3B82F6'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const stats = [
    { label:'Total Pengguna', value:'1,240', trend:'↑ 12% bulan ini', color:GOLD, icon:'👥' },
    { label:'Pengguna Aktif', value:'876', trend:'↑ 8% bulan ini', color:GREEN, icon:'✅' },
    { label:'Total Transaksi', value:'15,430', trend:'↑ 23% bulan ini', color:BLUE, icon:'📊' },
    { label:'Akun Nonaktif', value:'24', trend:'↑ 2 akun baru', color:RED, icon:'⚠️' },
  ]

  const quickActions = [
    { icon:'👥', title:'Kelola Pengguna', sub:'Tambah, edit, hapus pengguna', path:'/admin-manage-users' },
    { icon:'📊', title:'Lihat Laporan', sub:'Pantau statistik penggunaan', path:'/admin-reports' },
    { icon:'⚙️', title:'Pengaturan', sub:'Konfigurasi sistem aplikasi', path:'#' },
  ]

  const activities = [
    { avatar:'AP', nama:'Andi Pratama', aksi:'Login berhasil', waktu:'2 menit lalu', status:'sukses' },
    { avatar:'SR', nama:'Siti Rahma', aksi:'Reset Password', waktu:'15 menit lalu', status:'sukses' },
    { avatar:'BS', nama:'Budi Santoso', aksi:'Gagal Login (3x)', waktu:'1 jam lalu', status:'gagal' },
    { avatar:'DL', nama:'Dewi Lestari', aksi:'Aktifkan Spending Alert', waktu:'2 jam lalu', status:'sukses' },
    { avatar:'RA', nama:'Rafi Ahmad', aksi:'Update Profil Risiko', waktu:'3 jam lalu', status:'sukses' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .action-card { background:white; border-radius:14px; padding:22px 24px; display:flex; align-items:center; gap:16px; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:all 0.2s; }
        .action-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(107,15,26,0.12); }
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>

        {/* NAVBAR */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
            </div>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px' }}>ADMIN</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Dashboard</span>
            <span onClick={() => navigate('/admin-manage-users')} className="nav-link" style={{ cursor:'pointer' }}>Manage Users</span>
            <span onClick={() => navigate('/admin-reports')} className="nav-link" style={{ cursor:'pointer' }}>Reports</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>AD</span>
            </div>
            <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>Admin</span>
            <span onClick={() => setShowLogout(true)} style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', cursor:'pointer', marginLeft:'4px' }}>▾</span>
          </div>
        </nav>

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px' }}>

          {/* Welcome Banner */}
          <div style={{ backgroundColor:MAROON, borderRadius:'16px', padding:'28px 32px', marginBottom:'24px', backgroundImage:'radial-gradient(circle at 80% 50%, rgba(201,168,76,0.2) 0%, transparent 60%)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ color:GOLD, fontSize:'14px', marginBottom:'6px' }}>Selamat datang, Admin 👋</p>
              <h1 style={{ color:'white', fontSize:'24px', fontWeight:'700', marginBottom:'6px' }}>Panel Admin SmartSpend</h1>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px' }}>Kelola pengguna dan pantau aktivitas aplikasi dengan mudah.</p>
            </div>
            <div style={{ backgroundColor:'rgba(45,106,79,0.3)', border:'1px solid rgba(45,106,79,0.5)', padding:'8px 16px', borderRadius:'20px' }}>
              <span style={{ color:'#4ADE80', fontSize:'13px', fontWeight:'600' }}>● Sistem berjalan normal</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            {stats.map((s,i) => (
              <div key={i} style={{ backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${s.color}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                  <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'600' }}>{s.label}</p>
                  <span style={{ fontSize:'20px' }}>{s.icon}</span>
                </div>
                <p style={{ fontSize:'28px', fontWeight:'700', color:s.color, marginBottom:'6px' }}>{s.value}</p>
                <p style={{ fontSize:'12px', color:GREEN, fontWeight:'500' }}>{s.trend}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
            {quickActions.map((a,i) => (
              <div key={i} className="action-card" onClick={() => navigate(a.path)}>
                <div style={{ width:'48px', height:'48px', backgroundColor:MAROON, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>
                  {a.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:'700', fontSize:'15px', color:'#1A1A1A', marginBottom:'4px' }}>{a.title}</p>
                  <p style={{ fontSize:'13px', color:'#9CA3AF' }}>{a.sub}</p>
                </div>
                <span style={{ color:GOLD, fontSize:'13px', fontWeight:'600' }}>Buka →</span>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
                <h2 style={{ fontSize:'18px', fontWeight:'700', color:MAROON }}>Aktivitas Terbaru</h2>
              </div>
              <span onClick={() => navigate('/admin-manage-users')} style={{ color:GOLD, fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>Lihat Semua →</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'16px', padding:'0 0 12px', borderBottom:'1px solid #F3F4F6', marginBottom:'8px' }}>
              {['Pengguna','Aktivitas','Waktu','Status'].map(h => (
                <p key={h} style={{ fontSize:'12px', fontWeight:'600', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</p>
              ))}
            </div>

            {activities.map((a,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'16px', padding:'14px 0', borderBottom: i<activities.length-1?'1px solid #F9F9F9':'none', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'36px', height:'36px', backgroundColor: a.status==='sukses' ? '#F0FDF4' : '#FEF2F2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color: a.status==='sukses' ? GREEN : RED, flexShrink:0 }}>
                    {a.avatar}
                  </div>
                  <p style={{ fontSize:'14px', fontWeight:'600', color:'#1A1A1A' }}>{a.nama}</p>
                </div>
                <p style={{ fontSize:'13px', color:'#6B7280' }}>{a.aksi}</p>
                <p style={{ fontSize:'13px', color:'#9CA3AF' }}>{a.waktu}</p>
                <span style={{ display:'inline-block', backgroundColor: a.status==='sukses'?'#F0FDF4':'#FEF2F2', color: a.status==='sukses'?GREEN:RED, fontSize:'12px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px', width:'fit-content' }}>
                  {a.status==='sukses'?'✓ Sukses':'✗ Gagal'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', textAlign:'center' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🚪</div>
            <h2 style={{ color:MAROON, fontSize:'22px', fontWeight:'700', marginBottom:'10px' }}>Yakin ingin keluar?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', marginBottom:'28px' }}>Kamu akan keluar dari panel admin.</p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowLogout(false)} style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>← Batal</button>
              <button onClick={() => { localStorage.clear(); navigate('/') }} style={{ flex:1, height:'48px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}