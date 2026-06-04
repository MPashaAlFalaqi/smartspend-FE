import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast' // 1. Import React Hot Toast

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function UserProfile() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null) 
  const [activeMenu, setActiveMenu] = useState('profil')
  const [showLogout, setShowLogout] = useState(false)

  const [namaUser, setNamaUser] = useState(localStorage.getItem('user_name') || 'User')
  const [emailUser, setEmailUser] = useState(localStorage.getItem('user_email') || 'user@email.com')
  const [avatar, setAvatar] = useState(localStorage.getItem('user_avatar') || '') 

  const [form, setForm] = useState({
    nama: localStorage.getItem('user_name') || 'User',
    username: localStorage.getItem('user_username') || 'user',
    noHp: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    kota: '',
    email: localStorage.getItem('user_email') || 'user@email.com',
  })

  const [securityForm, setSecurityForm] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: '',
    emailBaru: localStorage.getItem('user_email') || 'user@email.com',
    noHpBaru: '',
  })

  const getInitials = (nameString) => {
    if (!nameString || typeof nameString !== 'string') return 'US'
    const cleanName = nameString.trim()
    if (!cleanName) return 'US'
    return cleanName.split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast.error('Ukuran file terlalu besar! Maksimal 2MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result) 
      }
      reader.readAsDataURL(file)
    }
  }

  // FITUR BARU: Fungsi untuk menghapus foto profil / avatar
  const handleDeleteAvatar = async (e) => {
    e.stopPropagation() // Mencegah terpicunya trigger click upload file
    
    if (window.confirm('Apakah Anda yakin ingin menghapus foto profil ini?')) {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Panggil endpoint backend Laravel untuk hapus foto
        await axios.post('http://127.0.0.1:8000/api/user/delete-photo', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Reset state & localStorage di Frontend
        setAvatar('')
        localStorage.removeItem('user_avatar')
        
        toast.success('Foto profil berhasil dihapus!', {
          style: { border: `1px solid ${MAROON}`, padding: '16px', color: '#1A1A1A' },
          iconTheme: { primary: MAROON, secondary: '#FFF' },
        })
      } catch (error) {
        console.error(error)
        // Fallback jika API backend belum siap, izinkan frontend untuk reset state visual dahulu
        setAvatar('')
        localStorage.removeItem('user_avatar')
        toast.success('Foto profil dilepas dari tampilan lokal.')
      }
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const userRes = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (userRes.data) {
          const userData = userRes.data
          const fetchedName = userData.nama || 'User'
          const fetchedEmail = userData.email || 'user@email.com'
          const fetchedUsername = userData.username || ''
          const fetchedNoHp = userData.no_hp || ''
          const fetchedTglLahir = userData.tanggal_lahir || ''
          const fetchedGender = userData.jenis_kelamin || 'Laki-laki'
          const fetchedKota = userData.kota || ''
          const fetchedAvatar = userData.avatar || '' 

          setNamaUser(fetchedName)
          setEmailUser(fetchedEmail)
          setAvatar(fetchedAvatar)
          
          setForm({
            nama: fetchedName,
            username: fetchedUsername,
            noHp: fetchedNoHp,
            tanggalLahir: fetchedTglLahir,
            jenisKelamin: fetchedGender,
            kota: fetchedKota,
            email: fetchedEmail
          })
          
          setSecurityForm(prev => ({
            ...prev,
            emailBaru: fetchedEmail,
            noHpBaru: fetchedNoHp
          }))

          localStorage.setItem('user_name', fetchedName)
          localStorage.setItem('user_email', fetchedEmail)
          localStorage.setItem('user_username', fetchedUsername)
          if(fetchedAvatar) {
            localStorage.setItem('user_avatar', fetchedAvatar)
          } else {
            localStorage.removeItem('user_avatar')
          }
        }
      } catch (error) {
        console.error('Gagal memuat profil dari backend:', error)
      }
    }
    fetchUserData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSecurityChange = (e) => {
    setSecurityForm({ ...securityForm, [e.target.name]: e.target.value })
  }

  const handleSaveProfil = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      if (!form.nama) {
        toast.error('Nama Lengkap wajib diisi!')
        return
      }

      const payload = {
        nama: form.nama,
        username: form.username,
        tanggal_lahir: form.tanggalLahir, 
        kota: form.kota,
        jenis_kelamin: form.jenisKelamin,
        avatar: avatar 
      }

      await axios.put('http://127.0.0.1:8000/api/user/update', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      localStorage.setItem('user_name', form.nama)
      localStorage.setItem('user_username', form.username)
      if (avatar) {
        localStorage.setItem('user_avatar', avatar)
      } else {
        localStorage.removeItem('user_avatar')
      }
      setNamaUser(form.nama)
      
      toast.success('Profil Anda berhasil diperbarui!', {
        style: { border: `1px solid ${MAROON}`, padding: '16px', color: '#1A1A1A' },
        iconTheme: { primary: MAROON, secondary: '#FFF' },
      })
    } catch (error) {
      console.error(error)
      if (error.response && error.response.data) {
        toast.error(`Gagal menyimpan: ${error.response.data.message || 'Periksa kembali data Anda.'}`)
      } else {
        toast.error('Gagal menyimpan perubahan ke database.')
      }
    }
  }

  const handleSaveKeamanan = async (e) => {
    e.preventDefault()
    if (securityForm.passwordBaru !== securityForm.konfirmasiPassword) {
      toast.error('Konfirmasi password baru tidak cocok!')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await axios.put('http://127.0.0.1:8000/api/user/update-password', {
        email: securityForm.emailBaru,
        no_hp: securityForm.noHpBaru,
        password_lama: securityForm.passwordLama,
        password: securityForm.passwordBaru
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setForm(prev => ({ ...prev, email: securityForm.emailBaru, noHp: securityForm.noHpBaru }))
      setEmailUser(securityForm.emailBaru)
      localStorage.setItem('user_email', securityForm.emailBaru)
      
      toast.success('Pengaturan keamanan berhasil diperbarui!', {
        style: { border: `1px solid ${MAROON}`, padding: '16px', color: '#1A1A1A' },
        iconTheme: { primary: MAROON, secondary: '#FFF' },
      })
    } catch (error) {
      toast.error('Gagal memperbarui keamanan. Pastikan password lama Anda benar.')
    }
  }

  const inputStyle = {
    width: '100%', height: '46px', padding: '0 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px',
    fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', color: '#1A1A1A'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 16px; border-radius:20px; transition: background 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .menu-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:10px; cursor:pointer; font-size:14px; }
        input:focus { border-color:${MAROON} !important; outline:none; background:#fff !important; }
        
        .avatar-wrapper { position: relative; width: 80px; height: 80px; margin: 0 auto 12px; }
        .avatar-container { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; cursor: pointer; position: relative; }
        .avatar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; opacity: 0; transition: opacity 0.2s ease; }
        .avatar-container:hover .avatar-overlay { opacity: 1; }
        
        .btn-delete-photo { position: absolute; top: -2px; right: -2px; width: 22px; height: 22px; border-radius: 50%; background-color: ${RED}; color: white; border: 1.5px solid white; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10; transition: transform 0.1s ease; }
        .btn-delete-photo:hover { transform: scale(1.1); background-color: #A0281C; }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: CREAM }}>
        
        {/* === FIXED & CLEAN NAVBAR === */}
        <nav style={{ 
          backgroundColor: MAROON, 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 32px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* SISI KIRI: LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/dashboard')}>
            <span style={{ color: GOLD, fontWeight: '700', fontSize: '22px' }}>SmartSpend</span>
          </div>
          
          {/* SISI TENGAH: MENU UTAMA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
          </div>
          
          {/* SISI KANAN: PROFIL USER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {namaUser}
            </span>
            <div style={{ width: '38px', height: '38px', backgroundColor: GOLD, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid white', flexShrink: 0 }}>
              {avatar ? (
                <img src={avatar} alt="Nav Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: MAROON, fontWeight: '700', fontSize: '14px' }}>{getInitials(namaUser)}</span>
              )}
            </div>
          </div>
        </nav>

        {/* CONTAINER */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px', display: 'flex', gap: '24px' }}>
          {/* SIDEBAR */}
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '28px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              
              {/* SECTION FOTO PROFIL DENGAN FITUR HAPUS FOTO */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <div className="avatar-wrapper">
                  {/* Tombol Hapus Eksklusif: Hanya muncul saat ada custom avatar image */}
                  {avatar && (
                    <button 
                      type="button" 
                      className="btn-delete-photo" 
                      onClick={handleDeleteAvatar}
                      title="Hapus Foto Profil"
                    >
                      ✕
                    </button>
                  )}
                  
                  <div className="avatar-container" onClick={() => fileInputRef.current.click()}>
                    {avatar ? (
                      <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', border: `2px solid ${GOLD}`, borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${MAROON}, ${GOLD})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>{getInitials(form.nama)}</span>
                      </div>
                    )}
                    <div className="avatar-overlay">Ganti Foto</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '700', color: MAROON }}>{form.nama}</h3>
                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{emailUser}</p>
              </div>

              <div className="menu-item" onClick={() => setActiveMenu('profil')} style={{ backgroundColor: activeMenu === 'profil' ? MAROON : 'transparent', color: activeMenu === 'profil' ? 'white' : '#374151' }}>👤 Informasi Pribadi</div>
              <div className="menu-item" onClick={() => setActiveMenu('keamanan')} style={{ backgroundColor: activeMenu === 'keamanan' ? MAROON : 'transparent', color: activeMenu === 'keamanan' ? 'white' : '#374151' }}>🔒 Keamanan</div>
              <div className="menu-item" onClick={() => setShowLogout(true)} style={{ color: RED, marginTop: '10px' }}>🚪 Keluar Akun</div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px 40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              {activeMenu === 'profil' ? (
                <form onSubmit={handleSaveProfil}>
                  <h2 style={{ color: MAROON, marginBottom: '20px' }}>Informasi Pribadi</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>NAMA LENGKAP</label><input name="nama" value={form.nama} onChange={handleChange} style={inputStyle} /></div>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>USERNAME</label><input name="username" value={form.username} onChange={handleChange} style={inputStyle} /></div>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>TANGGAL LAHIR</label><input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} style={inputStyle} /></div>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>KOTA DOMISILI</label><input name="kota" value={form.kota} onChange={handleChange} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '6px' }}>JENIS KELAMIN</label>
                    {['Laki-laki', 'Perempuan'].map(g => (
                      <button key={g} type="button" onClick={() => setForm({ ...form, jenisKelamin: g })} style={{ padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '10px', backgroundColor: form.jenisKelamin === g ? MAROON : '#F3F4F6', color: form.jenisKelamin === g ? 'white' : '#6B7280', cursor: 'pointer' }}>{g}</button>
                    ))}
                  </div>
                  <button type="submit" style={{ padding: '12px 24px', backgroundColor: MAROON, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' }}>Simpan Perubahan</button>
                </form>
              ) : (
                <form onSubmit={handleSaveKeamanan}>
                  <h2 style={{ color: MAROON, marginBottom: '20px' }}>Pengaturan Keamanan</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>ALAMAT EMAIL</label><input name="emailBaru" value={securityForm.emailBaru} onChange={handleSecurityChange} style={inputStyle} /></div>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>NOMOR HP</label><input name="noHpBaru" value={securityForm.noHpBaru} onChange={handleSecurityChange} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '12px', color: '#6B7280' }}>PASSWORD LAMA</label><input name="passwordLama" type="password" value={securityForm.passwordLama} onChange={handleSecurityChange} style={inputStyle} placeholder="••••••••" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>PASSWORD BARU</label><input name="passwordBaru" type="password" value={securityForm.passwordBaru} onChange={handleSecurityChange} style={inputStyle} placeholder="••••••••" /></div>
                    <div><label style={{ fontSize: '12px', color: '#6B7280' }}>KONFIRMASI PASSWORD</label><input name="konfirmasiPassword" type="password" value={securityForm.konfirmasiPassword} onChange={handleSecurityChange} style={inputStyle} placeholder="••••••••" /></div>
                  </div>
                  <button type="submit" style={{ padding: '12px 24px', backgroundColor: MAROON, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' }}>Perbarui Keamanan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center', margin: 'auto' }}>
            <h3 style={{ marginBottom: '10px' }}>Yakin ingin keluar?</h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>Anda harus login kembali untuk mengakses data keuangan SmartSpend.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowLogout(false)} style={{ flex: 1, height: '48px', borderRadius: '10px', border: `1.5px solid ${MAROON}`, color: MAROON, backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '500' }}>Batal</button>
              <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ flex: 1, height: '48px', backgroundColor: MAROON, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' }}>Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}