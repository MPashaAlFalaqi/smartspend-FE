import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function UserProfile() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('profil')
  const [showLogout, setShowLogout] = useState(false)
  const [saved, setSaved] = useState(false)

  const namaUser = localStorage.getItem('namaUser') || 'Andi Pratama'

  const [form, setForm] = useState({
    nama: namaUser,
    username: 'andipratama',
    noHp: '+62 812-3456-7890',
    tanggalLahir: '15 Maret 1998',
    jenisKelamin: 'Laki-laki',
    pekerjaan: localStorage.getItem('pekerjaan') || 'Karyawan Swasta',
    email: 'andi@email.com',
    kota: 'Malang, Jawa Timur',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('namaUser', form.nama)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const menus = [
    { key:'profil', icon:'👤', label:'Informasi Pribadi' },
    { key:'keamanan', icon:'🔒', label:'Keamanan' },
    { key:'notifikasi', icon:'🔔', label:'Notifikasi' },
    { key:'risiko', icon:'💳', label:'Profil Risiko' },
  ]

  const inputStyle = {
    width:'100%', height:'46px', padding:'0 14px',
    border:'1.5px solid #E5E7EB', borderRadius:'10px',
    fontSize:'14px', boxSizing:'border-box',
    backgroundColor:'#FAFAFA', color:'#1A1A1A',
    fontFamily:'Poppins,sans-serif',
  }

  const labelStyle = {
    fontSize:'12px', fontWeight:'600', display:'block',
    marginBottom:'6px', color:'#6B7280', letterSpacing:'0.3px',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .menu-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:10px; cursor:pointer; transition:all 0.2s; font-size:14px; }
        .menu-item:hover { background:#F5F0E8; }
        input:focus { border-color:${MAROON} !important; outline:none; background:#fff !important; }
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
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>
                {namaUser.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
              </span>
            </div>
            <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>{namaUser}</span>
          </div>
        </nav>

        <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'32px', display:'flex', gap:'24px' }}>

          {/* SIDEBAR KIRI */}
          <div style={{ width:'260px', flexShrink:0 }}>
            <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'28px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>

              {/* Avatar */}
              <div style={{ textAlign:'center', marginBottom:'20px' }}>
                <div style={{ position:'relative', display:'inline-block', marginBottom:'12px' }}>
                  <div style={{ width:'80px', height:'80px', background:`linear-gradient(135deg, ${MAROON}, ${GOLD})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
                    <span style={{ color:'white', fontSize:'28px', fontWeight:'700' }}>
                      {namaUser.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ position:'absolute', bottom:0, right:0, width:'24px', height:'24px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'12px' }}>
                    📷
                  </div>
                </div>
                <h3 style={{ fontSize:'16px', fontWeight:'700', color:MAROON, marginBottom:'4px' }}>{form.nama}</h3>
                <p style={{ fontSize:'12px', color:'#9CA3AF', marginBottom:'8px' }}>{form.email}</p>
                <span style={{ display:'inline-block', backgroundColor:'#FFF3E0', color:GOLD, fontSize:'11px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px', border:`1px solid ${GOLD}` }}>
                  Member Sejak Jan 2025
                </span>
              </div>

              {/* Divider */}
              <div style={{ height:'1px', backgroundColor:'#F3F4F6', margin:'16px 0' }}/>

              {/* Menu */}
              {menus.map(m => (
                <div key={m.key} className="menu-item"
                  onClick={() => setActiveMenu(m.key)}
                  style={{ backgroundColor: activeMenu===m.key ? MAROON : 'transparent', color: activeMenu===m.key ? 'white' : '#374151', fontWeight: activeMenu===m.key ? '600' : '400' }}>
                  <span style={{ fontSize:'16px' }}>{m.icon}</span>
                  {m.label}
                </div>
              ))}

              {/* Divider */}
              <div style={{ height:'1px', backgroundColor:'#F3F4F6', margin:'8px 0' }}/>

              {/* Keluar */}
              <div className="menu-item"
                onClick={() => setShowLogout(true)}
                style={{ color:RED, fontWeight:'500' }}>
                <span style={{ fontSize:'16px' }}>🚪</span>
                Keluar
              </div>
            </div>
          </div>

          {/* KONTEN KANAN */}
          <div style={{ flex:1 }}>
            <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'36px 40px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>

              {/* Title */}
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
                <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
                <h2 style={{ fontSize:'20px', fontWeight:'700', color:MAROON }}>Informasi Pribadi</h2>
              </div>

              {/* Saved notif */}
              {saved && (
                <div style={{ backgroundColor:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', color:GREEN, fontSize:'13px', fontWeight:'500' }}>
                  ✅ Perubahan berhasil disimpan!
                </div>
              )}

              <form onSubmit={handleSave}>
                {/* Grid 2 kolom */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>

                  <div>
                    <label style={labelStyle}>NAMA LENGKAP</label>
                    <input name="nama" value={form.nama} onChange={handleChange} style={inputStyle}/>
                  </div>

                  <div>
                    <label style={labelStyle}>USERNAME</label>
                    <input name="username" value={form.username} onChange={handleChange} style={inputStyle}/>
                  </div>

                  <div>
                    <label style={labelStyle}>NOMOR HP</label>
                    <input name="noHp" value={form.noHp} onChange={handleChange} style={inputStyle}/>
                  </div>

                  <div>
                    <label style={labelStyle}>TANGGAL LAHIR</label>
                    <input name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} style={inputStyle}/>
                  </div>

                </div>

                {/* Jenis Kelamin */}
                <div style={{ marginBottom:'16px' }}>
                  <label style={labelStyle}>JENIS KELAMIN</label>
                  <div style={{ display:'flex', gap:'12px' }}>
                    {['Laki-laki','Perempuan'].map(g => (
                      <button key={g} type="button"
                        onClick={() => setForm({...form, jenisKelamin:g})}
                        style={{
                          padding:'10px 24px', border:'none', borderRadius:'10px',
                          fontSize:'14px', cursor:'pointer', fontFamily:'Poppins,sans-serif',
                          fontWeight: form.jenisKelamin===g ? '600' : '400',
                          backgroundColor: form.jenisKelamin===g ? MAROON : '#F3F4F6',
                          color: form.jenisKelamin===g ? 'white' : '#6B7280',
                          transition:'all 0.2s',
                        }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid 2 kolom lagi */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                  <div>
                    <label style={labelStyle}>PEKERJAAN</label>
                    <input name="pekerjaan" value={form.pekerjaan} onChange={handleChange} style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>KOTA DOMISILI</label>
                    <input name="kota" value={form.kota} onChange={handleChange} style={inputStyle}/>
                  </div>
                </div>

                {/* Email full width */}
                <div style={{ marginBottom:'28px' }}>
                  <label style={labelStyle}>ALAMAT EMAIL</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle}/>
                </div>

                {/* Tombol */}
                <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end' }}>
                  <button type="button"
                    onClick={() => navigate('/dashboard')}
                    style={{ padding:'12px 28px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', fontFamily:'Poppins,sans-serif' }}>
                    Batal
                  </button>
                  <button type="submit"
                    style={{ padding:'12px 28px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', fontFamily:'Poppins,sans-serif', boxShadow:'0 4px 12px rgba(107,15,26,0.3)' }}>
                    ✓ Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>

            {/* Profil Risiko Card */}
            <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'20px 24px', marginTop:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ width:'44px', height:'44px', backgroundColor:'#FFF3E0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                🛡️
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:'700', fontSize:'14px', color:MAROON, marginBottom:'2px' }}>
                  Profil Risiko Kamu: <span style={{ color:GOLD }}>Moderat</span>
                </p>
                <p style={{ fontSize:'12px', color:'#9CA3AF' }}>Terakhir diperbarui: 1 April 2025</p>
              </div>
              <span
                onClick={() => navigate('/risk-profile')}
                style={{ color:GOLD, fontSize:'13px', fontWeight:'600', cursor:'pointer', textDecoration:'underline' }}>
                Perbarui Profil
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width:'72px', height:'72px', backgroundColor:'#FEE8E8', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'32px' }}>🚪</div>
            <h2 style={{ color:MAROON, fontSize:'22px', fontWeight:'700', marginBottom:'10px' }}>Yakin ingin keluar?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', lineHeight:'1.6', marginBottom:'28px' }}>Kamu akan keluar dari sesi SmartSpend.</p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowLogout(false)}
                style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                ← Batal
              </button>
              <button onClick={() => navigate('/')}
                style={{ flex:1, height:'48px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                Ya, Keluar 🚪
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}