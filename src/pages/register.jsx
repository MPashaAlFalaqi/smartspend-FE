import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import Swal from 'sweetalert2' // <-- 1. Import SweetAlert2

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  // State untuk mengontrol tampilan pop-up modal S&K / Privasi bawaan
  const [showSK, setShowSK] = useState(false)
  const [showPrivasi, setShowPrivasi] = useState(false)

  // ===== UPDATE STATE: Tambah username dan no_hp =====
  const [formData, setFormData] = useState({
    nama: '', 
    username: '', 
    email: '', 
    no_hp: '', 
    password: '', 
    konfirmasi: '', 
    setuju: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  // ===== 2. LOGIKA REGISTER VIA GOOGLE + SWEETALERT2 =====
  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Tampilkan loading spinner halus saat menghubungi server
        Swal.fire({
          title: 'Menghubungkan Akun...',
          text: 'Mohon tunggu sebentar',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })

        const response = await fetch('https://smartspend-be-production.up.railway.app/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            token: tokenResponse.access_token 
          })
        })

        const data = await response.json()

        if (response.ok) {
          // DISINKRONKAN: Menyimpan info esensial ke localStorage agar dibaca oleh UserProfile
          localStorage.setItem('token', data.token)
          localStorage.setItem('user_name', data.user.nama || data.user.name)
          localStorage.setItem('user_email', data.user.email)
          localStorage.setItem('user_username', data.user.username || '')
          localStorage.setItem('role', 'user') 
          
          // Pop-up sukses estetik warna marun
          Swal.fire({
            icon: 'success',
            title: 'Registrasi Berhasil!',
            text: `Selamat bergabung di SmartSpend, ${data.user.nama || data.user.name}!`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            iconColor: '#6B0F1A',
          })

          setTimeout(() => navigate('/dashboard'), 2000)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text: data.message || 'Gagal sinkronisasi data Google dengan SmartSpend.',
            confirmButtonColor: '#6B0F1A',
          })
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Koneksi Terputus',
          text: 'Pastikan server backend Laravel Anda sudah aktif!',
          confirmButtonColor: '#6B0F1A',
        })
      }
    },
    onError: () => {
      Swal.fire({
        icon: 'warning',
        title: 'Dibatalkan',
        text: 'Gagal atau batal melakukan autentikasi lewat Google.',
        confirmButtonColor: '#6B0F1A',
      })
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    if (name === 'password') {
      if (value.length === 0) setPasswordStrength(0)
      else if (value.length < 4) setPasswordStrength(1)
      else if (value.length < 6) setPasswordStrength(2)
      else if (value.length < 8) setPasswordStrength(3)
      else setPasswordStrength(4)
    }
  }

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Sedang', 'Kuat']
  const strengthColor = ['', '#C0392B', '#E67E22', '#F1C40F', '#2D6A4F']

  // ===== 3. LOGIKA REGISTER MANUAL + SWEETALERT2 =====
  const handleSubmit = async (e) => {
    e.preventDefault()

    // ===== UPDATE VALIDASI: Pastikan username dan no_hp ikut dicek =====
    if (!formData.nama || !formData.username || !formData.email || !formData.no_hp || !formData.password || !formData.konfirmasi) {
      Swal.fire({ icon: 'warning', title: 'Opps..', text: 'Semua field wajib diisi!', confirmButtonColor: '#6B0F1A' })
      return
    }
    if (formData.password !== formData.konfirmasi) {
      Swal.fire({ icon: 'error', title: 'Password Tidak Cocok', text: 'Pastikan konfirmasi password sama dengan password Anda.', confirmButtonColor: '#6B0F1A' })
      return
    }
    if (!formData.setuju) {
      Swal.fire({ icon: 'warning', title: 'Persetujuan Diperlukan', text: 'Anda harus menyetujui Syarat & Ketentuan SmartSpend.', confirmButtonColor: '#6B0F1A' })
      return
    }

    try {
      // Loading spinner untuk register manual
      Swal.fire({
        title: 'Membuat Akun...',
        text: 'Sedang mendaftarkan data diri Anda',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
      })

      // ===== UPDATE BODY REQ: Kirim username dan no_hp ke Laravel Backend =====
      const response = await fetch('https://smartspend-be-production.up.railway.app/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nama: formData.nama,
          username: formData.username,
          email: formData.email,
          no_hp: formData.no_hp,
          password: formData.password,
        })
      })

      const data = await response.json()

      if (response.ok) {
        // DISINKRONKAN: Cadangkan data pendaftaran lokal agar langsung ter-render di UserProfile sebelum fetch backend selesai
        localStorage.setItem('user_name', formData.nama)
        localStorage.setItem('user_username', formData.username)
        localStorage.setItem('user_email', formData.email)

        Swal.fire({
          icon: 'success',
          title: 'Akun Berhasil Dibuat!',
          text: 'Mengalihkan Anda ke halaman masuk...',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          iconColor: '#6B0F1A'
        })
        setTimeout(() => navigate('/'), 2000) // Mengarah ke halaman login utama Anda
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal Registrasi', text: data.message || 'Terjadi kesalahan saat mendaftar.', confirmButtonColor: '#6B0F1A' })
      }

    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Koneksi Terputus', text: 'Gagal terhubung ke server backend!', confirmButtonColor: '#6B0F1A' })
    }
  }

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus { border-color: #6B0F1A !important; background-color: #fff !important; }
        button:hover { opacity: 0.9; }
        .modal-link { color: #C9A84C; text-decoration: none; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .modal-link:hover { color: #8B1E2B; text-decoration: underline; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        fontFamily: "'Poppins', sans-serif",
      }}>

        {/* ===== KIRI — Branding ===== */}
        <div style={{
          width: '42%',
          backgroundColor: '#6B0F1A',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)',
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color: '#C9A84C', fontWeight: '700', fontSize: '20px', letterSpacing: '0.5px' }}>
              SmartSpend
            </span>
          </div>

          {/* Konten Tengah */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
            
            {/* Icon Besar */}
            <div style={{
              width: '120px', height: '120px',
              backgroundColor: 'rgba(201,168,76,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '32px',
              border: '2px solid rgba(201,168,76,0.3)',
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#C9A84C">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>

            <h2 style={{
              color: '#FFFFFF', fontSize: '26px', fontWeight: '700',
              margin: '0 0 16px 0', lineHeight: '1.3', letterSpacing: '-0.3px'
            }}>
              Mulai Kelola<br/>Keuanganmu
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '14px',
              lineHeight: '1.7', margin: '0 0 40px 0', fontWeight: '300'
            }}>
              Daftar sekarang dan kendalikan keuangan dengan lebih cerdas bersama SmartSpend.
            </p>

            {/* Feature List */}
            {[
              '📊 Analisis profil risiko finansial',
              '💰 Budget planner bulanan',
              '🔔 Spending alert otomatis',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                marginBottom: '12px', width: '100%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: '10px 16px', borderRadius: '10px',
              }}>
                <span style={{ fontSize: '16px' }}>{item.split(' ')[0]}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '400' }}>
                  {item.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== KANAN — Form ===== */}
        <div style={{
          width: '58%',
          backgroundColor: '#F5F0E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          overflowY: 'auto',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '44px 40px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 32px rgba(107,15,26,0.08)',
          }}>

            {/* Header Form */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{
                color: '#6B0F1A', fontSize: '24px',
                fontWeight: '700', margin: '0 0 6px 0', letterSpacing: '-0.3px'
              }}>
                Buat Akun Baru 👋
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0, fontWeight: '400' }}>
                Isi data diri kamu untuk memulai perjalanan finansialmu
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Nama */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  NAMA LENGKAP
                </label>
                <input type="text" name="nama" placeholder="Masukkan nama lengkap"
                  value={formData.nama} onChange={handleChange} style={inputStyle} />
              </div>

              {/* Username */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  USERNAME
                </label>
                <input type="text" name="username" placeholder="Masukkan username unik"
                  value={formData.username} onChange={handleChange} style={inputStyle} />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  ALAMAT EMAIL
                </label>
                <input type="email" name="email" placeholder="contoh@email.com"
                  value={formData.email} onChange={handleChange} style={inputStyle} />
              </div>

              {/* Nomor HP */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  NOMOR HP
                </label>
                <input type="tel" name="no_hp" placeholder="Contoh: 08123456789"
                  value={formData.no_hp} onChange={handleChange} style={inputStyle} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange}
                    style={{ ...inputStyle, padding: '0 48px 0 16px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9CA3AF' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Strength Bar */}
                {formData.password.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      {[1,2,3,4].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: '5px', borderRadius: '10px',
                          backgroundColor: i <= passwordStrength ? strengthColor[passwordStrength] : '#E5E7EB',
                          transition: 'all 0.3s ease'
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: strengthColor[passwordStrength], fontWeight: '500' }}>
                      Kekuatan password: {strengthLabel[passwordStrength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  KONFIRMASI PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} name="konfirmasi"
                    placeholder="Ulangi password kamu" value={formData.konfirmasi} onChange={handleChange}
                    style={{ ...inputStyle, padding: '0 48px 0 16px' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9CA3AF' }}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Checkbox dengan Link Pemicu Pop-up Modal */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', padding: '14px', backgroundColor: '#FFF8F0', borderRadius: '10px', border: '1px solid #FDE8CC' }}>
                <input 
                  type="checkbox" 
                  name="setuju" 
                  checked={formData.setuju} 
                  onChange={handleChange}
                  style={{ marginTop: '2px', accentColor: '#6B0F1A', width: '16px', height: '16px', cursor: 'pointer', position: 'relative', zIndex: 2 }} 
                />
                <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', fontWeight: '400', position: 'relative', zIndex: 2 }}>
                  Saya menyetujui{' '}
                  <span 
                    onClick={(e) => { e.stopPropagation(); setShowSK(true); }} 
                    className="modal-link"
                    style={{ position: 'relative', zIndex: 3 }}
                  >
                    Syarat & Ketentuan
                  </span>
                  {' '}serta{' '}
                  <span 
                    onClick={(e) => { e.stopPropagation(); setShowPrivasi(true); }} 
                    className="modal-link"
                    style={{ position: 'relative', zIndex: 3 }}
                  >
                    Kebijakan Privasi
                  </span>
                  {' '}SmartSpend
                </span>
              </div>

              {/* Tombol Daftar */}
              <button type="submit" style={{
                width: '100%', height: '52px',
                backgroundColor: '#6B0F1A', color: '#FFFFFF',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', marginBottom: '20px',
                letterSpacing: '0.3px', fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 15px rgba(107,15,26,0.3)',
              }}>
                Daftar Sekarang →
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>atau daftar dengan</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Google Button */}
              <button 
                type="button" 
                onClick={() => handleGoogleRegister()} 
                style={{
                  width: '100%', height: '48px',
                  backgroundColor: '#FFFFFF', border: '1.5px solid #E5E7EB',
                  borderRadius: '12px', fontSize: '14px', fontWeight: '500',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '10px',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Daftar dengan Google
              </button>

            </form>

            {/* Link Login */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#9CA3AF', marginTop: '24px', marginBottom: 0 }}>
              Sudah punya akun?{' '}
              <Link to="/" style={{ color: '#6B0F1A', fontWeight: '600', textDecoration: 'none' }}>
                Masuk Sekarang
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* ==================== POP-UP MODAL SYARAT & KETENTUAN ==================== */}
      {showSK && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '16px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#6B0F1A', fontWeight: '700', fontSize: '20px', marginBottom: '16px', borderBottom: '2px solid #F3F4F6', paddingBottom: '10px' }}>Syarat & Ketentuan</h3>
            <div style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ marginBottom: '12px', fontWeight: '500' }}>Selamat datang di SmartSpend. Dengan mendaftar, Anda menyetujui seluruh ketentuan layanan kami:</p>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{ color: '#1F2937' }}>Keamanan Akun:</strong> Anda bertanggung jawab penuh untuk menjaga kerahasiaan password dan aktivitas yang terjadi pada akun Anda.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{ color: '#1F2937' }}>Akurasi Data Finansial:</strong> Layanan perencanaan anggaran ini sepenuhnya bergantung pada data finansial (penghasilan dan pengeluaran) yang Anda berikan secara mandiri.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{ color: '#1F2937' }}>Batasan Penggunaan:</strong> Fitur SmartSpend disediakan hanya untuk tujuan manajemen keuangan pribadi dan edukasi perencanaan anggaran non-komersial.</li>
              </ol>
            </div>
            <button type="button" onClick={() => setShowSK(false)} style={{ backgroundColor: '#6B0F1A', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(107,15,26,0.2)' }}>
              Saya Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {/* ==================== POP-UP MODAL KEBIJAKAN PRIVASI ==================== */}
      {showPrivasi && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '16px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#6B0F1A', fontWeight: '700', fontSize: '20px', marginBottom: '16px', borderBottom: '2px solid #F3F4F6', paddingBottom: '10px' }}>Kebijakan Privasi</h3>
            <div style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ marginBottom: '12px', fontWeight: '500' }}>Privasi Anda adalah prioritas utama SmartSpend. Berikut cara kami memperlakukan data Anda:</p>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{ color: '#1F2937' }}>Penyimpanan Aman:</strong> Seluruh data sensitif seperti password dienkripsi secara aman. Data profil risiko dan finansial disimpan eksklusif pada server aman kami.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{ color: '#1F2937' }}>Kerahasiaan Mutlak:</strong> Kami menjamin tidak akan pernah menjual, menyewakan, atau mendistribusikan riwayat keuangan dan data pribadi Anda kepada pihak ketiga mana pun.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{ color: '#1F2937' }}>Penggunaan Data:</strong> Data Anda murni diolah oleh algoritma SmartSpend untuk menyajikan kalkulasi budget planner dan spending alert yang akurat.</li>
              </ol>
            </div>
            <button type="button" onClick={() => setShowPrivasi(false)} style={{ backgroundColor: '#6B0F1A', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(107,15,26,0.2)' }}>
              Saya Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}