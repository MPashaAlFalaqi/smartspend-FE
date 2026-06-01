import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function Dashboard() {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // Mengambil status awal notifikasi dari localStorage agar presisi
  const [notifAktif, setNotifAktif] = useState(
    localStorage.getItem('notifikasi_aktif') === 'true'
  )
  const [showNotif, setShowNotif] = useState(false)

  // ===== STATE UNTUK DATA DINAMIS DATABASE =====
  const [loading, setLoading] = useState(true)
  
  // MENGAMBIL NAMA DARI RISK PROFILE DULU, JIKA TIDAK ADA BARU MENGAMBIL USER_NAME LOGIN, JIKA KOSONG PROSE KE "User"
  const [namaUser, setNamaUser] = useState(
    localStorage.getItem('namaUser') || localStorage.getItem('user_name') || 'User'
  )
  const [emailUser, setEmailUser] = useState(localStorage.getItem('user_email') || 'user@email.com')
  
  // STATE BARU UNTUK MENAMPUNG PROFILE PICTURE / AVATAR
  const [avatarUser, setAvatarUser] = useState(localStorage.getItem('user_avatar') || null)
  
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [profilRisiko, setProfilRisiko] = useState('Konservatif')
  const [ringkasanPengeluaran, setRingkasanPengeluaran] = useState([
    { kategori: 'Pokok', total: 0 },
    { kategori: 'Keinginan', total: 0 },
    { kategori: 'Tabungan', total: 0 }
  ])

  // ===== HIT REQ BACKEND KETIKA HALAMAN DIBUKA =====
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        
        // Pengecekan prioritas nama lokal: Ambil dari input Risk Profile terlebih dahulu
        const namaDariRiskProfile = localStorage.getItem('namaUser')
        const localName = localStorage.getItem('user_name')
        
        if (namaDariRiskProfile) {
          setNamaUser(namaDariRiskProfile)
        } else if (localName) {
          setNamaUser(localName)
        }

        // 1. Ambil data profil user yang sedang login (Nama, Email, & Avatar)
        const userRes = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (userRes.data) {
          // JIKA user sudah isi nama di Risk Profile, gunakan nama itu. Jika belum, gunakan dari database login.
          const fetchedName = localStorage.getItem('namaUser') || userRes.data.name || 'User'
          const fetchedEmail = userRes.data.email || 'user@email.com'
          const fetchedAvatar = userRes.data.avatar || null // Mengambil kolom avatar baru database
          
          setNamaUser(fetchedName)
          setEmailUser(fetchedEmail)
          setAvatarUser(fetchedAvatar)
          
          // Perbarui penyimpanan lokal agar halaman lain tersinkronisasi sempurna
          localStorage.setItem('user_name', userRes.data.name || 'User')
          localStorage.setItem('user_email', fetchedEmail)
          if (fetchedAvatar) {
            localStorage.setItem('user_avatar', fetchedAvatar)
          } else {
            localStorage.removeItem('user_avatar')
          }
        }

        // 2. Ambil data profil risiko terbaru untuk label badge
        const riskRes = await axios.get('http://127.0.0.1:8000/api/risk-profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (riskRes.data && riskRes.data.kategori_risiko) {
          const kategori = riskRes.data.kategori_risiko
          setProfilRisiko(kategori.charAt(0).toUpperCase() + kategori.slice(1))
        }

        // 3. Ambil hitungan akumulasi budget dari Final Analyze
        const summaryRes = await axios.get('http://127.0.0.1:8000/api/dashboard-summary', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (summaryRes.data && summaryRes.data.success) {
          const resData = summaryRes.data.data
          setTotalPemasukan(resData.total_pemasukan || 0)
          setRingkasanPengeluaran(resData.ringkasan_pengeluaran || [])
        }
      } catch (error) {
        console.error('Gagal mengambil sinkronisasi data dashboard:', error)
      } finally {
        setLoading(false)
      }
    };

    fetchDashboardData()
  }, [])

  // ===== KALKULASI VARIABEL MATEMATIKA =====
  const totalPengeluaran = ringkasanPengeluaran.reduce((acc, curr) => {
    return curr.kategori !== 'Tabungan' ? acc + curr.total : acc
  }, 0)
  
  const totalTabungan = ringkasanPengeluaran.find(item => item.kategori === 'Tabungan')?.total || 0
  const sisaAnggaran = totalPemasukan - totalPengeluaran - totalTabungan

  // Fungsi untuk mengaktifkan notifikasi
  const handleAktifkan = async () => {
    try {
      const token = localStorage.getItem('token')
      localStorage.setItem('notifikasi_aktif', 'true')
      setNotifAktif(true)
    } catch (err) {
      console.error(err)
      localStorage.setItem('notifikasi_aktif', 'true')
      setNotifAktif(true)
    }
  }

  // Fungsi untuk menonaktifkan kembali notifikasi
  const handleNonaktifkan = async () => {
    try {
      const token = localStorage.getItem('token')
      localStorage.setItem('notifikasi_aktif', 'false')
      setNotifAktif(false)
    } catch (err) {
      console.error(err)
      localStorage.setItem('notifikasi_aktif', 'false')
      setNotifAktif(false)
    }
  }

  const handleTidak = () => {
    localStorage.setItem('notifikasi_aktif', 'false')
    setNotifAktif(false)
  }

  // ===== KODE LOADING SCREEN PREMIUM =====
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: CREAM, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '20px' 
      }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            border: '4px solid rgba(107, 15, 26, 0.1)', 
            borderTop: `4px solid ${MAROON}`, 
            borderRadius: '50%', 
            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite' 
          }} />
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '24px'
          }}>
            🛡️
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: MAROON, 
            fontWeight: '700', 
            fontSize: '16px', 
            margin: '0 0 4px 0',
            letterSpacing: '0.5px'
          }}>
            Sinkronisasi Data Final Analyze
          </p>
          <p style={{ 
            color: GOLD, 
            fontSize: '13px', 
            fontWeight: '500',
            margin: 0,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            Memuat dashboard keuangan Anda...
          </p>
        </div>

        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        `}</style>
      </div>
    )
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
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(-10px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>

        {/* ===== NAVBAR ===== */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color: GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Dashboard</span>
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            {/* Bell Notification */}
            <div style={{ position:'relative' }}>
              <div
                onClick={() => { setShowNotif(!showNotif); setShowDropdown(false) }}
                style={{
                  position:'relative', cursor:'pointer',
                  padding:'8px', borderRadius:'50%',
                  backgroundColor: showNotif ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition:'all 0.2s'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {notifAktif && (
                  <span style={{
                    position:'absolute', top:'-2px', right:'-2px',
                    backgroundColor:RED, borderRadius:'50%',
                    width:'16px', height:'16px', fontSize:'10px',
                    color:'white', display:'flex', alignItems:'center',
                    justifyContent:'center', fontWeight:'700'
                  }}>1</span>
                )}
              </div>

              {/* Dropdown Notifikasi */}
              {showNotif && (
                <div style={{
                  position:'absolute', right:'-120px', top:'48px',
                  backgroundColor:'white', borderRadius:'16px',
                  boxShadow:'0 8px 32px rgba(0,0,0,0.15)',
                  width:'360px', zIndex:300,
                  animation:'fadeIn 0.2s ease'
                }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <h3 style={{ fontSize:'15px', fontWeight:'700', color:'#1A1A1A' }}>Notifikasi</h3>
                      {notifAktif && (
                        <span style={{ backgroundColor:RED, color:'white', fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px' }}>1 baru</span>
                      )}
                    </div>
                    {notifAktif && (
                      <span onClick={() => { localStorage.setItem('notifikasi_aktif', 'false'); setNotifAktif(false); }} style={{ fontSize:'12px', color:GOLD, fontWeight:'600', cursor:'pointer' }}>
                        Tandai dibaca
                      </span>
                    )}
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifAktif ? (
                      <>
                        <div style={{ padding:'16px 20px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:'12px', alignItems:'flex-start', backgroundColor:'#FFF8F0', cursor:'pointer', transition:'background 0.2s' }} onClick={() => { setShowNotif(false); navigate('/final-analyze') }}>
                          <div style={{ width:'42px', height:'42px', backgroundColor:'#FEF3C7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'18px' }}>⚠️</div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                              <p style={{ fontSize:'13px', fontWeight:'700', color:'#1A1A1A' }}>Spending Alert!</p>
                              <div style={{ width:'8px', height:'8px', backgroundColor:RED, borderRadius:'50%', marginTop:'4px' }}/>
                            </div>
                            <p style={{ fontSize:'12px', color:'#6B7280', lineHeight:'1.5', marginBottom:'4px' }}>Pengeluaranmu telah mencapai 95% dari total anggaran bulan ini.</p>
                            <span style={{ fontSize:'11px', color:GOLD, fontWeight:'500' }}>2 menit lalu</span>
                          </div>
                        </div>

                        <div style={{ padding:'16px 20px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:'12px', alignItems:'flex-start', cursor:'pointer', transition:'background 0.2s' }} onClick={() => { setShowNotif(false); navigate('/budget-planner') }}>
                          <div style={{ width:'42px', height:'42px', backgroundColor:'#F0FDF4', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'18px' }}>💰</div>
                          <div style={{ flex:1 }}>
                            <p style={{ fontSize:'13px', fontWeight:'700', color:'#1A1A1A', marginBottom:'4px' }}>Budget Planner Tersimpan</p>
                            <p style={{ fontSize:'12px', color:'#6B7280', lineHeight:'1.5', marginBottom:'4px' }}>Budget planner bulan ini berhasil disimpan dan dianalisis.</p>
                            <span style={{ fontSize:'11px', color:'#9CA3AF', fontWeight:'500' }}>1 jam lalu</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign:'center', padding:'32px 20px', color:'#9CA3AF', fontSize:'13px', lineHeight:'1.6' }}>
                        🔕 Notifikasi belum aktif.<br />
                        Silakan klik tombol "✓ Aktifkan" di panel Spending Alert bawah.
                      </div>
                    )}
                  </div>

                  <div onClick={() => setShowNotif(false)} style={{ padding:'14px 20px', textAlign:'center', cursor:'pointer', borderRadius:'0 0 16px 16px', borderTop:'1px solid #F3F4F6' }}>
                    <span style={{ fontSize:'13px', color:MAROON, fontWeight:'600' }}>Tutup ✕</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ width:'1px', height:'24px', backgroundColor:'rgba(255,255,255,0.3)' }}/>

            {/* ===== FIXED AVATAR PROFILE DENGAN LOGIKA FOTO PROFILE ===== */}
            <div style={{ position:'relative' }}>
              <div onClick={() => setShowDropdown(!showDropdown)} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <div style={{ 
                  width:'36px', 
                  height:'36px', 
                  backgroundColor:GOLD, 
                  borderRadius:'50%', 
                  display:'flex', 
                  alignItems:'center', 
                  justifyContent:'center',
                  overflow:'hidden' // Menghindari gambar luber keluar lingkaran bulat
                }}>
                  {avatarUser ? (
                    <img 
                      src={avatarUser} 
                      alt="Profile" 
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      onError={() => setAvatarUser(null)} // Fallback ke inisial huruf jika gambar corrupt
                    />
                  ) : (
                    <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>
                      {namaUser.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>{namaUser}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>

              {/* Dropdown User */}
              {showDropdown && (
                <div style={{ position:'absolute', right:0, top:'48px', backgroundColor:'white', borderRadius:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', width:'220px', padding:'8px', zIndex:200 }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #F3F4F6', marginBottom:'4px' }}>
                    <div style={{ fontWeight:'600', fontSize:'14px', color:'#1A1A1A' }}>{namaUser}</div>
                    <div style={{ fontSize:'12px', color:'#9CA3AF' }}>{emailUser}</div>
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/user-profile'); setShowDropdown(false) }}>
                    <span>👤</span> Profil Saya
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
          <div style={{
            backgroundColor:MAROON, borderRadius:'16px', padding:'32px', marginBottom:'20px', position:'relative', overflow:'hidden',
            backgroundImage:'radial-gradient(circle at 80% 50%, rgba(201,168,76,0.2) 0%, transparent 60%)'
          }}>
            <div style={{ position:'absolute', top:'16px', right:'16px', backgroundColor:'rgba(255,255,255,0.15)', padding:'6px 14px', borderRadius:'20px' }}>
              <span style={{ color:'white', fontSize:'13px', fontWeight:'500' }}>
                Profil Risiko: {profilRisiko}
              </span>
            </div>

            <div style={{ textAlign:'left' }}>
              <p style={{ color:GOLD, fontSize:'14px', marginBottom:'8px', display:'block' }}>Selamat datang kembali 👋</p>
              <h1 style={{ color:'white', fontSize:'32px', fontWeight:'700', marginBottom:'8px', display:'block' }}>{namaUser}</h1>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'14px', marginBottom:'4px', display:'block' }}>Total Pemasukan Bulan Ini</p>
              <p style={{ color:GOLD, fontSize:'28px', fontWeight:'700', display:'block' }}>
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </p>
            </div>
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

            {ringkasanPengeluaran.map((item, i) => {
              const persenDinamis = totalPemasukan > 0 ? Math.round((item.total / totalPemasukan) * 100) : 0
              let warnaBar = MAROON
              if (item.kategori === 'Keinginan') warnaBar = GOLD
              if (item.kategori === 'Tabungan') warnaBar = GREEN

              return (
                <div key={i} style={{ marginBottom: i < 2 ? '20px' : '0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontSize:'14px', fontWeight:'500', color:'#1A1A1A' }}>Pengeluaran {item.kategori}</span>
                    <div style={{ display:'flex', gap:'16px' }}>
                      <span style={{ fontSize:'13px', color:'#9CA3AF' }}>Rp {item.total.toLocaleString('id-ID')}</span>
                      <span style={{ fontSize:'14px', fontWeight:'700', color:warnaBar }}>{persenDinamis}%</span>
                    </div>
                  </div>
                  <div style={{ backgroundColor:'#F3F4F6', borderRadius:'10px', height:'10px', overflow:'hidden' }}>
                    <div style={{ width:`${persenDinamis}%`, height:'100%', backgroundColor:warnaBar, borderRadius:'10px', transition:'width 0.8s ease' }}/>
                  </div>
                </div>
              )
            })}

            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'20px', paddingTop:'16px', borderTop:'1px solid #F3F4F6' }}>
              <span style={{ fontSize:'13px', color:'#9CA3AF' }}>Total Pengeluaran Pokok & Keinginan: <strong style={{ color:'#1A1A1A' }}>Rp {totalPengeluaran.toLocaleString('id-ID')}</strong></span>
              <span style={{ fontSize:'13px', color:GREEN, fontWeight:'600' }}>Sisa Anggaran Bebas: Rp {sisaAnggaran < 0 ? 0 : sisaAnggaran.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Spending Alert */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontWeight:'700', fontSize:'18px', color:MAROON }}>Spending Alert</h2>
            </div>

            {(totalPemasukan > 0 && (totalPengeluaran / totalPemasukan) * 100 >= 95) && (
              <div style={{ backgroundColor:'#FEF2F2', borderLeft:`4px solid ${RED}`, borderRadius:'10px', padding:'14px 16px', marginBottom:'16px', display:'flex', alignItems:'flex-start', gap:'10px' }}>
                <span style={{ fontSize:'18px' }}>⚠️</span>
                <div>
                  <p style={{ color:RED, fontWeight:'600', fontSize:'14px', marginBottom:'2px' }}>Peringatan! Pengeluaran pokok dan keinginanmu telah menyentuh batas aman (95%).</p>
                  <p style={{ color:RED, fontSize:'13px' }}>Pertimbangkan untuk mengurangi alokasi tersier agar tidak defisit.</p>
                </div>
              </div>
            )}

            {!notifAktif ? (
              <div style={{ border:`1.5px solid ${GOLD}`, borderRadius:'12px', padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
                  <div style={{ width:'48px', height:'48px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent: 'center', flexShrink:0, fontSize:'22px' }}>🔔</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:'600', fontSize:'15px', color:MAROON, marginBottom:'6px' }}>Aktifkan Notifikasi Overspending</p>
                    <p style={{ fontSize:'13px', color:'#6B7280', lineHeight:'1.6', marginBottom:'16px' }}>Fitur ini akan memantau pengeluaran dan memberi peringatan saat pengeluaran mendekati batas anggaran yang telah ditetapkan.</p>
                    <div style={{ display:'flex', gap:'12px' }}>
                      <button onClick={handleTidak} style={{ padding:'10px 24px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'8px', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>✕ Tidak</button>
                      <button onClick={handleAktifkan} style={{ flex:1, padding:'10px 24px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(107,15,26,0.3)' }}>✓ Aktifkan</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                border:`1.5px solid ${GREEN}`, 
                backgroundColor:'#F0FDF4', 
                borderRadius:'12px', 
                padding:'20px', 
                display:'flex', 
                alignItems:'center', 
                justifyContent:'space-between',
                gap:'14px' 
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ width:'48px', height:'48px', backgroundColor:GREEN, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'22px' }}>✅</div>
                  <div>
                    <p style={{ fontWeight:'600', fontSize:'15px', color:GREEN, marginBottom:'4px' }}>Notifikasi Overspending Aktif</p>
                    <p style={{ fontSize:'13px', color:'#6B7280' }}>Sistem akan memantau pengeluaranmu secara otomatis.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleNonaktifkan} 
                  style={{
                    padding:'8px 16px', 
                    backgroundColor:'white', 
                    border:`1px solid ${RED}`, 
                    color:RED, 
                    borderRadius:'8px', 
                    fontSize:'12px', 
                    fontWeight:'600', 
                    cursor:'pointer',
                    transition:'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  🛑 Nonaktifkan Fitur
                </button>
              </div>
            )}
          </div>

          {/* Summary Grid Bawah */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px' }}>
            {[
              { label:'Total Pemasukan', value:`Rp ${totalPemasukan.toLocaleString('id-ID')}`, color:GREEN, badge:null, icon:'↑', sub:null },
              { label:'Total Pengeluaran', value:`Rp ${totalPengeluaran.toLocaleString('id-ID')}`, color:RED, badge: totalPemasukan > 0 ? `${Math.round((totalPengeluaran / totalPemasukan) * 100)}% terpakai` : '0% terpakai', icon:null, sub:null },
              { label:'Rencana Tabungan', value:`Rp ${totalTabungan.toLocaleString('id-ID')}`, color:GOLD, badge: totalTabungan > 0 ? 'Target Aktif' : 'Belum Ada Alokasi', icon:null, sub:null },
              { label:'Profil Risiko', value: profilRisiko, color:MAROON, badge:null, icon:null, sub:'Tersinkronisasi otomatis' },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
                borderLeft:`4px solid ${item.color}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight:'120px'
              }}>
                <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px', fontWeight:'600' }}>{item.label}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                  <p style={{ fontSize:'20px', fontWeight:'700', color:item.color }}>{item.value}</p>
                  {item.icon && <span style={{ color:item.color, fontSize:'16px', fontWeight:'700' }}>{item.icon}</span>}
                </div>
                {item.badge && (
                  <span style={{ display:'inline-block', backgroundColor:GOLD, color:'white', fontSize:'11px', fontWeight:'600', padding:'3px 12px', borderRadius:'20px', marginTop:'4px' }}>
                    {item.badge}
                  </span>
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
              <button onClick={() => setShowLogoutModal(false)} style={{ flex:1, padding:'12px', backgroundColor:'#F3F4F6', color:'#4B5563', border:'none', borderRadius:'10px', fontWeight:'600', cursor:'pointer' }}>Batal</button>
              <button onClick={() => { localStorage.clear(); navigate('/login') }} style={{ flex:1, padding:'12px', backgroundColor:RED, color:'white', border:'none', borderRadius:'10px', fontWeight:'600', cursor:'pointer' }}>Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}