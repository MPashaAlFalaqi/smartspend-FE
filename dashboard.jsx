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
  
  const [notifAktif, setNotifAktif] = useState(
    localStorage.getItem('notifikasi_aktif') === 'true'
  )
  const [showNotif, setShowNotif] = useState(false)

  // ===== STATE DATA DINAMIS =====
  const [loading, setLoading] = useState(true)
  const [namaUser, setNamaUser] = useState(
    localStorage.getItem('user_name') || localStorage.getItem('namaUser') || 'User'
  )
  const [emailUser, setEmailUser] = useState(localStorage.getItem('user_email') || 'user@email.com')
  const [avatarUser, setAvatarUser] = useState(localStorage.getItem('user_avatar') || null)
  
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  
  // Mengambil data terupdate yang disimpan oleh Final Analyze sebagai state utama
  const [profilRisiko, setProfilRisiko] = useState(() => {
    const localRisk = localStorage.getItem('profilRisiko') || localStorage.getItem('risk_profile') || 'Konservatif'
    return localRisk.charAt(0).toUpperCase() + localRisk.slice(1).toLowerCase()
  })
  
  const [ringkasanPengeluaran, setRingkasanPengeluaran] = useState([
    { kategori: 'Pokok', total: 0 },
    { kategori: 'Keinginan', total: 0 },
    { kategori: 'Tabungan', total: 0 }
  ])

  // ===== LOGIKA OPERASI FINANSIAL =====
  const totalPengeluaran = ringkasanPengeluaran.reduce((acc, curr) => acc + (Number(curr?.total) || 0), 0)
  const totalTabungan = ringkasanPengeluaran.find(item => item.kategori === 'Tabungan')?.total || 0
  const sisaAnggaran = totalPemasukan - totalPengeluaran

  const getInisial = (nama) => {
    if (!nama) return 'U'
    const kata = nama.trim().split(' ')
    if (kata.length > 1) {
      return (kata[0][0] + kata[1][0]).toUpperCase()
    }
    return kata[0].substring(0, 2).toUpperCase()
  }

  // ===== EFFECT 1: MEMANTAU PERUBAHAN LOCAL STORAGE SECARA REALTIME =====
  useEffect(() => {
    const handleStorageChange = () => {
      // Ambil nama terupdate yang disimpan oleh UserProfile.jsx
      const namaTerbaru = localStorage.getItem('user_name') || localStorage.getItem('namaUser')
      if (namaTerbaru) {
        setNamaUser(namaTerbaru)
      }

      const updateRisk = localStorage.getItem('profilRisiko') || localStorage.getItem('risk_profile')
      if (updateRisk) {
        setProfilRisiko(updateRisk.charAt(0).toUpperCase() + updateRisk.slice(1).toLowerCase())
      }

      const avatarTerbaru = localStorage.getItem('user_avatar')
      setAvatarUser(avatarTerbaru || null)
    }

    // Jalankan pengecekan instan saat komponen dimuat (pindah halaman)
    handleStorageChange()

    // Dengarkan event jika ada perubahan storage dari halaman/tab lain
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // ===== EFFECT 2: SYNC DATA BACKEND =====
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')

        // 1. Ambil data User profil dari endpoint /api/me
        try {
          const userRes = await axios.get('http://127.0.0.1:8000/api/me', {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (userRes && userRes.data) {
            // Prioritaskan nama lokal jika user baru saja mengubahnya di frontend
            const fetchedName = localStorage.getItem('user_name') || localStorage.getItem('namaUser') || userRes.data.name || 'User'
            const fetchedEmail = userRes.data.email || 'user@email.com'
            const fetchedAvatar = localStorage.getItem('user_avatar') || userRes.data.avatar || null
            
            setNamaUser(fetchedName)
            setEmailUser(fetchedEmail)
            setAvatarUser(fetchedAvatar)
            
            // Sync kembali ke storage agar tetap selaras
            localStorage.setItem('user_name', fetchedName)
            localStorage.setItem('user_email', fetchedEmail)
            
            if (fetchedAvatar) {
              localStorage.setItem('user_avatar', fetchedAvatar)
            } else {
              localStorage.removeItem('user_avatar')
            }

            if (!localStorage.getItem('profilRisiko') && userRes.data.risk_profile) {
              const formattedDbRisk = userRes.data.risk_profile.charAt(0).toUpperCase() + userRes.data.risk_profile.slice(1).toLowerCase()
              setProfilRisiko(formattedDbRisk)
              localStorage.setItem('profilRisiko', formattedDbRisk)
            }
          }
        } catch (userError) {
          console.error('Gagal memuat data /api/me, menggunakan data lokal:', userError)
        }

        // 2. Ambil data Akumulasi Keuangan dari endpoint /api/dashboard-summary
        try {
          const summaryRes = await axios.get('http://127.0.0.1:8000/api/dashboard-summary', {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          if (summaryRes?.data && summaryRes?.data?.success) {
            const resData = summaryRes.data || {}
            
            const pemasukanBersih = resData?.total_pemasukan ?? resData?.pemasukan ?? 0
            setTotalPemasukan(Number(pemasukanBersih))
            
            setRingkasanPengeluaran([
              { kategori: 'Pokok', total: Number(resData?.pengeluaran_pokok || 0) },
              { kategori: 'Keinginan', total: Number(resData?.pengeluaran_keinginan || 0) },
              { kategori: 'Tabungan', total: Number(resData?.tabungan_investasi || 0) }
            ])

            const savedLocalRisk = localStorage.getItem('profilRisiko') || localStorage.getItem('risk_profile')
            if (savedLocalRisk) {
              setProfilRisiko(savedLocalRisk.charAt(0).toUpperCase() + savedLocalRisk.slice(1).toLowerCase())
            } else if (resData?.kategori_risiko && resData?.kategori_risiko !== 'Belum Analisis') {
              const profilDariSummary = resData.kategori_risiko.charAt(0).toUpperCase() + resData.kategori_risiko.slice(1).toLowerCase()
              setProfilRisiko(profilDariSummary)
              localStorage.setItem('profilRisiko', profilDariSummary)
            }

          } else {
            setTotalPemasukan(0)
            setRingkasanPengeluaran([
              { kategori: 'Pokok', total: 0 }, { kategori: 'Keinginan', total: 0 }, { kategori: 'Tabungan', total: 0 }
            ])
          }
        } catch (summaryError) {
          console.error('Gagal memuat /api/dashboard-summary:', summaryError)
          setTotalPemasukan(0)
        }
      } catch (error) {
        console.error('Gagal mengambil sinkronisasi data dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleAktifkan = () => {
    localStorage.setItem('notifikasi_aktif', 'true')
    setNotifAktif(true)
  }

  const handleNonaktifkan = () => {
    localStorage.setItem('notifikasi_aktif', 'false')
    setNotifAktif(false)
  }

  const handleTidak = () => {
    localStorage.setItem('notifikasi_aktif', 'false')
    setNotifAktif(false)
  }

  const handleLogoutReal = () => {
    localStorage.clear()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div style={{ width: '100%', height: '100%', border: '4px solid rgba(107, 15, 26, 0.1)', borderTop: `4px solid ${MAROON}`, borderRadius: '50%', animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px' }}>🛡️</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: MAROON, fontWeight: '700', fontSize: '16px', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Sinkronisasi Data Final Analyze</p>
          <p style={{ color: GOLD, fontSize: '13px', fontWeight: '500', margin: 0, animation: 'pulse 1.5s ease-in-out infinite' }}>Memuat dashboard keuangan Anda...</p>
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
        @keyframes fadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
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
            {/* Notifikasi Bell */}
            <div style={{ position:'relative' }}>
              <div
                onClick={() => { setShowNotif(!showNotif); setShowDropdown(false) }}
                style={{ position:'relative', cursor:'pointer', padding:'8px', borderRadius:'50%', backgroundColor: showNotif ? 'rgba(255,255,255,0.15)' : 'transparent', transition:'all 0.2s' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {notifAktif && (
                  <span style={{ position:'absolute', top:'-2px', right:'-2px', backgroundColor:RED, borderRadius:'50%', width:'16px', height:'16px', fontSize:'10px', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>1</span>
                )}
              </div>

              {showNotif && (
                <div style={{ position:'absolute', right:'-120px', top:'48px', backgroundColor:'white', borderRadius:'16px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', width:'360px', zIndex:300, animation:'fadeIn 0.2s ease' }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <h3 style={{ fontSize:'15px', fontWeight:'700', color:'#1A1A1A' }}>Notifikasi</h3>
                      {notifAktif && <span style={{ backgroundColor:RED, color:'white', fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px' }}>1 baru</span>}
                    </div>
                    {notifAktif && (
                      <span onClick={() => { localStorage.setItem('notifikasi_aktif', 'false'); setNotifAktif(false); }} style={{ fontSize:'12px', color:GOLD, fontWeight:'600', cursor:'pointer' }}>Tandai dibaca</span>
                    )}
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifAktif ? (
                      <>
                        <div style={{ padding:'16px 20px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:'12px', alignItems:'flex-start', backgroundColor:'#FFF8F0', cursor:'pointer' }} onClick={() => { setShowNotif(false); navigate('/final-analyze') }}>
                          <div style={{ width:'42px', height:'42px', backgroundColor:'#FEF3C7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'18px' }}>⚠️</div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                              <p style={{ fontSize:'13px', fontWeight:'700', color:'#1A1A1A' }}>Spending Alert!</p>
                              <div style={{ width:'8px', height:'8px', backgroundColor:RED, borderRadius:'50%', marginTop:'4px' }}/>
                            </div>
                            <p style={{ fontSize:'12px', color:'#6B7280', lineHeight:'1.5', marginBottom:'4px' }}>Pengeluaranmu telah mencapai 95% dari total anggaran bulan ini.</p>
                            <span style={{ fontSize:'11px', color:GOLD, fontWeight:'500' }}>Barusan</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign:'center', padding:'32px 20px', color:'#9CA3AF', fontSize:'13px', lineHeight:'1.6' }}>🔕 Notifikasi belum aktif.<br />Silakan aktifkan melalui panel Spending Alert di bawah.</div>
                    )}
                  </div>
                  <div onClick={() => setShowNotif(false)} style={{ padding:'14px 20px', textAlign:'center', cursor:'pointer', borderRadius:'0 0 16px 16px', borderTop:'1px solid #F3F4F6' }}>
                    <span style={{ fontSize:'13px', color:MAROON, fontWeight:'600' }}>Tutup ✕</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ width:'1px', height:'24px', backgroundColor:'rgba(255,255,255,0.3)' }}/>

            {/* Profile Avatar */}
            <div style={{ position:'relative' }}>
              <div onClick={() => setShowDropdown(!showDropdown)} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  {avatarUser ? (
                    <img src={avatarUser} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={() => setAvatarUser(null)} />
                  ) : (
                    <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>
                      {getInisial(namaUser)}
                    </span>
                  )}
                </div>
                <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>{namaUser}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z"/></svg>
              </div>

              {showDropdown && (
                <div style={{ position:'absolute', right:0, top:'48px', backgroundColor:'white', borderRadius:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', width:'220px', padding:'8px', zIndex:200 }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #F3F4F6', marginBottom:'4px' }}>
                    <div style={{ fontWeight:'600', fontSize:'14px', color:'#1A1A1A' }}>{namaUser}</div>
                    <div style={{ fontSize:'12px', color:'#9CA3AF' }}>{emailUser}</div>
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/user-profile'); setShowDropdown(false) }}>👤 Profil Saya</div>
                  <div style={{ borderTop:'1px solid #F3F4F6', marginTop:'4px', paddingTop:'4px' }}>
                    <div className="dropdown-item" onClick={() => { setShowDropdown(false); setShowLogoutModal(true) }} style={{ color:RED }}>🚪 Keluar</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ===== UTAMA ===== */}
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'28px 32px' }}>
          
          {/* Hero Banner */}
          <div style={{ backgroundColor:MAROON, borderRadius:'16px', padding:'32px', marginBottom:'20px', position:'relative', overflow:'hidden', backgroundImage:'radial-gradient(circle at 80% 50%, rgba(201,168,76,0.2) 0%, transparent 60%)' }}>
            <div style={{ position:'absolute', top:'16px', right:'16px', backgroundColor: 'rgba(255,255,255,0.15)', padding:'6px 14px', borderRadius:'20px', transition: 'all 0.3s' }}>
              <span style={{ color:'white', fontSize:'13px', fontWeight:'600' }}>Profil Risiko: {profilRisiko}</span>
            </div>
            <div style={{ textAlign:'left' }}>
              <p style={{ color:GOLD, fontSize:'14px', marginBottom:'8px' }}>Selamat datang kembali 👋</p>
              <h1 style={{ color:'white', fontSize:'32px', fontWeight:'700', marginBottom:'8px' }}>{namaUser}</h1>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'14px', marginBottom:'4px' }}>Total Pemasukan Bulan Ini</p>
              <p style={{ color:GOLD, fontSize:'28px', fontWeight:'700' }}>Rp {totalPemasukan.toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div style={{ display:'flex', gap:'16px', marginBottom:'20px' }}>
            {[
              { icon:'👤', title:'Risk Profile', sub:'Kenali profil risiko finansial Anda', path:'/risk-profile' },
              { icon:'📊', title:'Final Analyze', sub:'Lihat hasil analisis keuangan', path:'/final-analyze' },
              { icon:'💰', title:'Budget Planner', sub:'Catat dan alokasikan anggaran', path:'/budget-planner' },
            ].map((item, i) => (
              <div key={i} className="shortcut-card" onClick={() => navigate(item.path)}>
                <div style={{ width:'44px', height:'44px', backgroundColor:MAROON, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{item.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:'600', fontSize:'15px', color:'#1A1A1A', marginBottom:'2px' }}>{item.title}</div>
                  <div style={{ fontSize:'13px', color:'#9CA3AF' }}>{item.sub}</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#D1D5DB"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              </div>
            ))}
          </div>

          {/* Alokasi Pengeluaran Aktual */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
                <h2 style={{ fontWeight:'700', fontSize:'18px', color:MAROON }}>Ringkasan Anggaran Bulan Ini</h2>
              </div>
              <span onClick={() => navigate('/history')} style={{ color:GOLD, fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>Lihat Riwayat Transaksi →</span>
            </div>

            {ringkasanPengeluaran.map((item, i) => {
              const persenDinamis = totalPemasukan > 0 ? Math.round((item.total / totalPemasukan) * 100) : 0
              let warnaBar = MAROON
              if (item.kategori === 'Keinginan') warnaBar = GOLD
              if (item.kategori === 'Tabungan') warnaBar = GREEN

              return (
                <div key={i} style={{ marginBottom: i < 2 ? '20px' : '0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontSize:'14px', fontWeight:'500', color:'#1A1A1A' }}>Alokasi {item.kategori}</span>
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
              <span style={{ fontSize:'13px', color:'#9CA3AF' }}>Total Terpakai (Menyeluruh): <strong style={{ color:'#1A1A1A' }}>Rp {totalPengeluaran.toLocaleString('id-ID')}</strong></span>
              <span style={{ fontSize:'13px', color: sisaAnggaran < 0 ? RED : GREEN, fontWeight:'600' }}>
                {sisaAnggaran < 0 ? `Overbudget: -Rp ${Math.abs(sisaAnggaran).toLocaleString('id-ID')}` : `Sisa Anggaran Bebas: Rp ${sisaAnggaran.toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>

          {/* Section Spending Alert */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontWeight:'700', fontSize:'18px', color:MAROON }}>Spending Alert</h2>
            </div>

            {(totalPemasukan > 0 && (totalPengeluaran / totalPemasukan) * 100 >= 95) && (
              <div style={{ backgroundColor:'#FEF2F2', borderLeft:`4px solid ${RED}`, borderRadius:'10px', padding:'14px 16px', marginBottom:'16px', display:'flex', alignItems:'flex-start', gap:'10px' }}>
                <span style={{ fontSize:'18px' }}>⚠️</span>
                <div>
                  <p style={{ color:RED, fontWeight:'600', fontSize:'14px', marginBottom:'2px' }}>Peringatan! Total pengeluaran Anda hampir mencapai batas maksimum (≥ 95%).</p>
                  <p style={{ color:RED, fontSize:'13px' }}>Kurangi pengeluaran tersier/keinginan agar sisa keuangan Anda aman sampai akhir bulan.</p>
                </div>
              </div>
            )}

            {!notifAktif ? (
              <div style={{ border:`1.5px solid ${GOLD}`, borderRadius:'12px', padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
                  <div style={{ width:'48px', height:'48px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent: 'center', flexShrink:0, fontSize:'22px' }}>🔔</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:'600', fontSize:'15px', color:MAROON, marginBottom:'6px' }}>Aktifkan Notifikasi Overspending</p>
                    <p style={{ fontSize:'13px', color:'#6B7280', lineHeight:'1.6', marginBottom:'16px' }}>Fitur otomatis untuk memantau pengeluaran Anda dari ancaman pembengkakan anggaran.</p>
                    <div style={{ display:'flex', gap:'12px' }}>
                      <button onClick={handleTidak} style={{ padding:'10px 24px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'8px', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>✕ Tidak</button>
                      <button onClick={handleAktifkan} style={{ flex:1, padding:'10px 24px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(107,15,26,0.3)' }}>✓ Aktifkan</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ border:`1.5px solid ${GREEN}`, backgroundColor:'#F0FDF4', borderRadius:'12px', padding:'20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ width:'48px', height:'48px', backgroundColor:GREEN, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'22px' }}>✅</div>
                  <div>
                    <p style={{ fontWeight:'600', fontSize:'15px', color:GREEN, marginBottom:'4px' }}>Notifikasi Overspending Active</p>
                    <p style={{ fontSize:'13px', color:'#6B7280' }}>Sistem pengawasan cerdas berjalan otomatis di latar belakang.</p>
                  </div>
                </div>
                <button onClick={handleNonaktifkan} style={{ padding:'8px 16px', backgroundColor:'white', border:`1px solid ${RED}`, color:RED, borderRadius:'8px', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>🛑 Nonaktifkan Fitur</button>
              </div>
            )}
          </div>

          {/* Grid Finansial Akumulatif */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px' }}>
            <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${GREEN}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight:'120px' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px', fontWeight:'600' }}>Total Pemasukan</p>
              <p style={{ fontSize:'20px', fontWeight:'700', color:GREEN }}>Rp {totalPemasukan.toLocaleString('id-ID')}</p>
            </div>

            <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${totalPengeluaran > totalPemasukan ? RED : MAROON}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight:'120px' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px', fontWeight:'600' }}>Total Pengeluaran</p>
              <p style={{ fontSize:'20px', fontWeight:'700', color: totalPengeluaran > totalPemasukan ? RED : MAROON }}>Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
              <span style={{ display:'inline-block', backgroundColor: totalPengeluaran > totalPemasukan ? RED : GOLD, color:'white', fontSize:'11px', fontWeight:'600', padding:'3px 12px', borderRadius:'20px', marginTop:'4px' }}>
                {totalPemasukan > 0 ? `${Math.round((totalPengeluaran / totalPemasukan) * 100)}% terpakai` : '0% terpakai'}
              </span>
            </div>

            <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${GOLD}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight:'120px' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px', fontWeight:'600' }}>Rencana Tabungan</p>
              <p style={{ fontSize:'20px', fontWeight:'700', color:GOLD }}>Rp {totalTabungan.toLocaleString('id-ID')}</p>
              <span style={{ display:'inline-block', backgroundColor: GOLD, color:'white', fontSize:'11px', fontWeight:'600', padding:'3px 12px', borderRadius:'20px', marginTop:'4px' }}>
                {totalTabungan > 0 ? 'Target Aktif' : 'Belum Terisi'}
              </span>
            </div>

            <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${profilRisiko === 'Agresif' ? RED : profilRisiko === 'Moderat' ? GOLD : GREEN}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight:'120px' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'10px', fontWeight:'600' }}>Profil Risiko</p>
              <p style={{ fontSize:'20px', fontWeight:'700', color: profilRisiko === 'Agresif' ? RED : profilRisiko === 'Moderat' ? GOLD : GREEN }}>
                {profilRisiko}
              </p>
              <p style={{ fontSize:'12px', color: '#9CA3AF', marginTop:'4px' }}>Berdasarkan Profil Kamu</p>
            </div>
          </div>

        </div>
      </div>

      {/* ===== LOGOUT MODAL BOX ===== */}
      {showLogoutModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width:'72px', height:'72px', backgroundColor:'#FEE8E8', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'32px' }}>🚪</div>
            <h2 style={{ color:MAROON, fontSize:'22px', fontWeight:'700', marginBottom:'10px' }}>Yakin ingin keluar?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', lineHeight:'1.6', marginBottom:'24px' }}>Sesi Anda akan segera diakhiri. Pastikan semua perubahan data anggaran telah disimpan.</p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex:1, padding:'12px', backgroundColor:'#F3F4F6', color:'#4B5563', border:'none', borderRadius:'10px', fontWeight:'600', cursor:'pointer' }}>Batal</button>
              <button onClick={handleLogoutReal} style={{ flex:1, padding:'12px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontWeight:'600', cursor:'pointer' }}>Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}