import { useNavigate } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'
const BLUE = '#3B82F6'

export default function AdminReports() {
  const navigate = useNavigate()

  const activities = [
    { avatar:'AP', nama:'Andi Pratama', aksi:'Login', waktu:'2 menit lalu', status:'sukses' },
    { avatar:'SR', nama:'Siti Rahma', aksi:'Reset Password', waktu:'15 menit lalu', status:'sukses' },
    { avatar:'BS', nama:'Budi Santoso', aksi:'Gagal Login', waktu:'1 jam lalu', status:'gagal' },
    { avatar:'DL', nama:'Dewi Lestari', aksi:'Aktifkan Alert', waktu:'2 jam lalu', status:'sukses' },
    { avatar:'RA', nama:'Rafi Ahmad', aksi:'Update Profil', waktu:'3 jam lalu', status:'sukses' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; cursor:pointer; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
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
          <div style={{ display:'flex', gap:'4px' }}>
            <span onClick={() => navigate('/admin-dashboard')} className="nav-link">Dashboard</span>
            <span onClick={() => navigate('/admin-manage-users')} className="nav-link">Manage Users</span>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Reports</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>AD</span>
            </div>
            <span style={{ color:'white', fontSize:'14px' }}>Admin</span>
          </div>
        </nav>

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px' }}>

          {/* Title */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON }}>Laporan Penggunaan Aplikasi</h1>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', backgroundColor:'white', padding:'10px 16px', borderRadius:'10px', border:'1.5px solid #E5E7EB', cursor:'pointer' }}>
              <span style={{ fontSize:'16px' }}>📅</span>
              <span style={{ fontSize:'14px', fontWeight:'500' }}>1 Apr - 30 Apr 2025</span>
              <span style={{ color:'#9CA3AF' }}>▾</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            {[
              { label:'Total Pengguna Terdaftar', value:'1,240', trend:'↑ 12% dari bulan lalu', color:MAROON, icon:'👥' },
              { label:'Pengguna Aktif Bulan Ini', value:'876', trend:'↑ 8% dari bulan lalu', color:GREEN, icon:'✅' },
              { label:'Total Transaksi Dicatat', value:'15,430', trend:'↑ 23% dari bulan lalu', color:BLUE, icon:'📊' },
              { label:'Spending Alert Diaktifkan', value:'634', trend:'↑ 5% dari bulan lalu', color:GOLD, icon:'🔔' },
            ].map((s,i) => (
              <div key={i} style={{ backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                  <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'600', lineHeight:'1.4' }}>{s.label}</p>
                  <span style={{ fontSize:'20px' }}>{s.icon}</span>
                </div>
                <p style={{ fontSize:'28px', fontWeight:'700', color:s.color, marginBottom:'4px' }}>{s.value}</p>
                <p style={{ fontSize:'12px', color:GREEN, fontWeight:'500' }}>{s.trend}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display:'grid', gridTemplateColumns:'60% 38%', gap:'16px', marginBottom:'24px' }}>

            {/* Line Chart Placeholder */}
            <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize:'16px', fontWeight:'700', color:MAROON, marginBottom:'20px' }}>Pertumbuhan Pengguna</h3>
              <div style={{ position:'relative', height:'200px' }}>
                {/* Y axis labels */}
                {['1500','1000','500','0'].map((l,i) => (
                  <div key={i} style={{ position:'absolute', left:0, top:`${i*66}px`, fontSize:'11px', color:'#9CA3AF' }}>{l}</div>
                ))}
                {/* Chart area */}
                <svg width="100%" height="200" style={{ marginLeft:'32px' }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={MAROON} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={MAROON} stopOpacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,140 C60,130 120,110 180,90 C240,70 300,55 360,45 C420,35 480,30 540,25" stroke={MAROON} strokeWidth="2.5" fill="none"/>
                  <path d="M0,140 C60,130 120,110 180,90 C240,70 300,55 360,45 C420,35 480,30 540,25 L540,200 L0,200 Z" fill="url(#grad)"/>
                  {[[0,140],[90,115],[180,90],[270,68],[360,45],[450,32],[540,25]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="4" fill={GOLD} stroke="white" strokeWidth="2"/>
                  ))}
                </svg>
                {/* X labels */}
                <div style={{ display:'flex', justifyContent:'space-between', marginLeft:'32px', marginTop:'8px' }}>
                  {['Nov','Des','Jan','Feb','Mar','Apr'].map(m => (
                    <span key={m} style={{ fontSize:'11px', color:'#9CA3AF' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <h3 style={{ fontSize:'16px', fontWeight:'700', color:MAROON, marginBottom:'20px', alignSelf:'flex-start' }}>Distribusi Profil Risiko</h3>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="60" fill="none" stroke={BLUE} strokeWidth="28" strokeDasharray="150 226"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke={GOLD} strokeWidth="28" strokeDasharray="132 244" strokeDashoffset="-150"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke={MAROON} strokeWidth="28" strokeDasharray="94 282" strokeDashoffset="-282"/>
                <circle cx="80" cy="80" r="46" fill="white"/>
                <text x="80" y="76" textAnchor="middle" style={{ fontSize:'14px', fontWeight:'700', fill:MAROON }}>Total</text>
                <text x="80" y="92" textAnchor="middle" style={{ fontSize:'12px', fill:'#9CA3AF' }}>1,240</text>
              </svg>
              <div style={{ marginTop:'16px', width:'100%' }}>
                {[
                  { label:'Konservatif', persen:'40%', color:BLUE },
                  { label:'Moderat', persen:'35%', color:GOLD },
                  { label:'Agresif', persen:'25%', color:MAROON },
                ].map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                    <div style={{ width:'12px', height:'12px', backgroundColor:item.color, borderRadius:'3px', flexShrink:0 }}/>
                    <span style={{ fontSize:'13px', color:'#374151', flex:1 }}>{item.label}</span>
                    <span style={{ fontSize:'13px', fontWeight:'700', color:item.color }}>{item.persen}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Table */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
                <h2 style={{ fontSize:'18px', fontWeight:'700', color:MAROON }}>Aktivitas Terbaru</h2>
              </div>
              <span onClick={() => navigate('/admin-manage-users')} style={{ color:GOLD, fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>Lihat Semua →</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'16px', marginBottom:'8px' }}>
              {['Pengguna','Aktivitas','Waktu','Status'].map(h => (
                <p key={h} style={{ fontSize:'12px', fontWeight:'600', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</p>
              ))}
            </div>
            {activities.map((a,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'16px', padding:'14px 0', borderBottom: i<activities.length-1?'1px solid #F9F9F9':'none', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'36px', height:'36px', backgroundColor: a.status==='sukses'?'#F0FDF4':'#FEF2F2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color: a.status==='sukses'?GREEN:RED, flexShrink:0 }}>
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
    </>
  )
}