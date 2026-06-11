import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' 

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'
const BLUE = '#3B82F6'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false) 

  // State Penampung Data Riil Database dari Backend
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    active_users: 0,
    non_active_users: 0,
    new_users_this_week: 0,
    total_transactions: 0,
    activities: []
  })

  // State Pengenal Info Akun Admin Aktif (dari Local Storage Login)
  const [adminData, setAdminData] = useState({
    name: 'Admin',
    email: 'admin@gmail.com'
  })

  // 🟢 FETCH DATA UTAMA DASHBOARD
  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`https://smartspend-be-production.up.railway.app/api/admin/dashboard?t=${new Date().getTime()}`, {
        headers: { 
          'Accept': 'application/json',
          'Authorization': '' 
        }
      })
      
      if (res.data) {
        setDashboardData({
          total_users: res.data.total_users ?? 0,
          active_users: res.data.active_users ?? 0,
          non_active_users: res.data.non_active_users ?? 0,
          new_users_this_week: res.data.new_users_this_week ?? 0,
          total_transactions: res.data.total_transactions ?? 0,
          activities: res.data.activities ?? []
        })
      }
    } catch (err) {
      console.error("Gagal memuat data dinamis dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  // 🔴 FUNGSI LOGOUT INTEGRASI BACKEND
  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      const token = localStorage.getItem('token')
      
      if (token) {
        await axios.post('https://smartspend-be-production.up.railway.app/api/logout', {}, {
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        })
      }
    } catch (err) {
      console.error("Gagal mencabut token di backend saat logout:", err)
    } finally {
      localStorage.clear()
      setLogoutLoading(false)
      setShowLogout(false)
      navigate('/')
    }
  }

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user') || localStorage.getItem('userData')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const name = parsedUser?.name || parsedUser?.user?.name || 'Admin SmartSpend'
        const email = parsedUser?.email || parsedUser?.user?.email || 'admin@gmail.com'
        setAdminData({ name, email })
      }
    } catch (error) {
      console.error("Gagal membaca session local storage admin:", error)
    }

    fetchDashboardStats()
  }, [])

  const getInitials = (fullName) => {
    if (!fullName) return 'AD'
    const names = fullName.trim().split(/\s+/)
    if (names.length > 1 && names[1]) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght=300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .dropdown-item { padding:12px 16px; cursor:pointer; display:flex; align-items:center; gap:10px; font-size:14px; color:#1A1A1A; transition:background 0.2s; border-radius:8px; }
        .dropdown-item:hover { background:#F5F0E8; }
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

          {/* Bagian Profil Kanan Atas */}
          <div style={{ position:'relative' }}>
            <div onClick={() => setShowDropdown(!showDropdown)} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', userSelect:'none' }}>
              <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>
                  {getInitials(adminData.name)}
                </span>
              </div>
              <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>{adminData.name}</span>
              <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', marginLeft:'2px' }}>▾</span>
            </div>

            {/* Dropdown Menu Admin */}
            {showDropdown && (
              <div style={{ position:'absolute', right:0, top:'44px', backgroundColor:'white', borderRadius:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', width:'220px', padding:'8px', zIndex:200 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid #F3F4F6', marginBottom:'4px' }}>
                  <div style={{ fontWeight:'600', fontSize:'14px', color: '#1A1A1A' }}>{adminData.name}</div>
                  <div style={{ fontSize:'12px', color:'#9CA3AF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{adminData.email}</div>
                </div>
                <div className="dropdown-item" onClick={() => { setShowDropdown(false); setShowLogout(true) }} style={{ color:RED }}>
                  <span>🚪</span> Keluar Panel
                </div>
              </div>
            )}
          </div>
        </nav>

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px' }}>

          {/* WELCOME BANNER - FIX RATA KIRI TOTAL */}
          <div style={{ 
            backgroundColor: MAROON, 
            borderRadius: '16px', 
            padding: '32px 40px', 
            marginBottom: '24px', 
            backgroundImage: 'radial-gradient(circle at 95% 30%, rgba(201,168,76,0.12) 0%, transparent 60%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* SISI KIRI: Blok Konten Teks Terkunci Rata Kiri */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '16px', maxWidth: '75%', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: GOLD, fontSize: '14px', marginBottom: '6px', fontWeight: '500', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Selamat datang kembali, {adminData.name} <span style={{ fontSize: '15px' }}>✨</span>
                </p>
                <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px', textAlign: 'left' }}>
                  Panel Admin SmartSpend
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13.5px', lineHeight: '1.6', textAlign: 'left' }}>
                  Kelola basis data pengguna, pantau performa transaksi finansial, dan amankan log aktivitas aplikasi dari satu tempat terpusat.
                </p>
              </div>
              
              {/* Badge Status Indikator */}
              <div style={{ 
                backgroundColor: 'rgba(45,106,79,0.3)', 
                border: '1px solid rgba(74,222,128,0.2)', 
                padding: '6px 14px', 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ color: '#4ADE80', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🟢</span> Sistem Utama Berjalan Normal
                </span>
              </div>
            </div>

            {/* SISI KANAN: Dekorasi Penghias Biar Tidak Lowong */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              userSelect: 'none',
              flexShrink: 0
            }}>
              <div style={{ fontSize: '32px' }}>🛡️</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: GOLD, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, textAlign: 'left' }}>Proteksi</p>
                <p style={{ color: 'white', fontSize: '13.5px', fontWeight: '600', margin: 0, textAlign: 'left' }}>Sesi Admin Aktif</p>
              </div>
            </div>
          </div>

          {/* AREA STATS CARDS */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: MAROON, fontWeight: '600', backgroundColor: 'white', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>Memuat statistik database...</div>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
                
                {/* 1. Total Pengguna */}
                <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${GOLD}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'700' }}>Total Pengguna</p>
                    <span style={{ fontSize:'20px' }}>👥</span>
                  </div>
                  <p style={{ fontSize:'28px', fontWeight:'700', color:GOLD, marginBottom:'6px' }}>{dashboardData.total_users.toLocaleString()}</p>
                  <p style={{ fontSize:'12px', color:GREEN, fontWeight:'600' }}>↑ {dashboardData.new_users_this_week} jiwa minggu ini</p>
                </div>

                {/* 2. Pengguna Aktif */}
                <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${GREEN}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'700' }}>Pengguna Aktif</p>
                    <span style={{ fontSize:'20px' }}>✅</span>
                  </div>
                  <p style={{ fontSize:'28px', fontWeight:'700', color:GREEN, marginBottom:'6px' }}>{dashboardData.active_users.toLocaleString()}</p>
                  <p style={{ fontSize:'12px', color:'#6B7280', fontWeight:'500' }}>Status akun aktif</p>
                </div>

                {/* 3. Total Transaksi */}
                <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${BLUE}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'700' }}>Total Transaksi</p>
                    <span style={{ fontSize:'20px' }}>📊</span>
                  </div>
                  <p style={{ fontSize:'28px', fontWeight:'700', color:BLUE, marginBottom:'6px' }}>{dashboardData.total_transactions.toLocaleString()}</p>
                  <p style={{ fontSize:'12px', color:BLUE, fontWeight:'500' }}>Seluruh transaksi aplikasi</p>
                </div>

                {/* 4. Akun Nonaktif */}
                <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${RED}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <p style={{ fontSize:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'700' }}>Akun Ditangguhkan</p>
                    <span style={{ fontSize:'20px' }}>⚠️</span>
                  </div>
                  <p style={{ fontSize:'28px', fontWeight:'700', color:RED, marginBottom:'6px' }}>{dashboardData.non_active_users.toLocaleString()}</p>
                  <p style={{ fontSize:'12px', color:RED, fontWeight:'500' }}>Banned / Nonaktif</p>
                </div>

              </div>

              {/* AREA AKTIVITAS TERBARU */}
              <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
                    <h2 style={{ fontSize:'18px', fontWeight:'700', color:MAROON }}>Aktivitas Terbaru</h2>
                  </div>
                  <span onClick={() => navigate('/admin-manage-users')} style={{ color:GOLD, fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>Lihat Semua →</span>
                </div>

                {/* Header Tabel */}
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1fr 1fr', gap:'16px', padding:'0 12px 12px', borderBottom:'1px solid #E5E7EB', marginBottom:'8px' }}>
                  {['Pengguna','Aktivitas','Waktu','Status'].map(h => (
                    <p key={h} style={{ fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</p>
                  ))}
                </div>

                {/* Isi Log Aktivitas */}
                {dashboardData.activities.length === 0 ? (
                  <div style={{ padding: '32px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>Belum ada log aktivitas dari database.</div>
                ) : (
                  dashboardData.activities.map((a, i) => (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1fr 1fr', gap:'16px', padding:'14px 12px', borderBottom: i < dashboardData.activities.length - 1 ? '1px solid #F3F4F6' : 'none', alignItems:'center', borderRadius:'8px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px', overflow:'hidden' }}>
                        <div style={{ width:'36px', height:'36px', backgroundColor: a.status === 'sukses' || a.status === 'Sukses' ? '#E8F5E9' : '#FFEBEE', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color: a.status === 'sukses' || a.status === 'Sukses' ? GREEN : RED, flexShrink:0 }}>
                          {a.avatar || getInitials(a.nama)}
                        </div>
                        <div style={{ overflow:'hidden' }}>
                          <p style={{ fontSize:'14px', fontWeight:'600', color:'#1A1A1A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.nama}</p>
                          <p style={{ fontSize:'11px', color:'#9CA3AF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.email}</p>
                        </div>
                      </div>
                      <p style={{ fontSize:'13px', color:'#6B7280', fontWeight:'500' }}>{a.aksi}</p>
                      <p style={{ fontSize:'13px', color:'#9CA3AF' }}>{a.waktu}</p>
                      <div>
                        <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', backgroundColor: a.status === 'sukses' || a.status === 'Sukses' ? '#E8F5E9' : '#FFEBEE', color: a.status === 'sukses' || a.status === 'Sukses' ? GREEN : RED, fontSize:'12px', fontWeight:'600', padding:'6px 14px', borderRadius:'20px', whiteSpace:'nowrap' }}>
                          {a.status === 'sukses' || a.status === 'Sukses' ? '✓ Sukses' : '✗ Gagal'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </div>
      </div>

      {/* MODAL LOGOUT */}
      {showLogout && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', textAlign:'center', margin:'auto' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🚪</div>
            <h2 style={{ color:MAROON, fontSize:'22px', fontWeight:'700', marginBottom:'10px' }}>Yakin ingin keluar?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', marginBottom:'28px' }}>Kamu akan keluar dari panel admin.</p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button disabled={logoutLoading} onClick={() => setShowLogout(false)} style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>← Batal</button>
              <button disabled={logoutLoading} onClick={handleLogout} style={{ flex:1, height:'48px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:logoutLoading ? 'not-allowed' : 'pointer', opacity: logoutLoading ? 0.7 : 1 }}>
                {logoutLoading ? 'Memproses...' : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}