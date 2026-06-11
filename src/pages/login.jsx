import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import Swal from 'sweetalert2' // <-- 1. Import SweetAlert2

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  // ===== 2. LOGIKA INTEGRASI GOOGLE AUTH + SWEETALERT2 =====
  const loginDenganGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError('')
        
        // Menampilkan Loading Spinner yang halus saat memproses
        Swal.fire({
          title: 'Memproses Otentikasi...',
          text: 'Mohon tunggu sebentar',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })

        // Mengirim Access Token dari Google menuju backend Laravel
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
          // Menyimpan data autentikasi dari Laravel ke LocalStorage
          localStorage.setItem('token', data.token)
          localStorage.setItem('user_name', data.user.nama || data.user.name)
          localStorage.setItem('user_email', data.user.email)
          localStorage.setItem('role', 'user') 
          
          // Pop-up Sukses dengan Animasi Keren & Warna Custom Marun
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: `Selamat datang kembali, ${data.user.nama || data.user.name}!`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            iconColor: '#6B0F1A', // Senada dengan tema SmartSpend
          })

          // Berikan jeda 2 detik agar user bisa melihat pop-up sebelum pindah halaman
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)

        } else {
          // Pop-up jika email diblokir atau ada masalah validasi dari Laravel
          Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: data.message || 'Gagal sinkronisasi akun dengan server.',
            confirmButtonColor: '#6B0F1A',
          })
        }
      } catch (err) {
        // Pop-up jika server backend mati / down
        Swal.fire({
          icon: 'error',
          title: 'Koneksi Terputus',
          text: 'Tidak dapat terhubung ke server backend Laravel!',
          confirmButtonColor: '#6B0F1A',
        })
      }
    },
    onError: () => {
      Swal.fire({
        icon: 'warning',
        title: 'Dibatalkan',
        text: 'Otentikasi Google dibatalkan atau gagal.',
        confirmButtonColor: '#6B0F1A',
      })
    },
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ===== PERBAIKAN: LOGIKA LOGIN MANUAL TERINTEGRASI BACKEND CLOUD =====
  const handleLogin = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi!')
      return
    }

    try {
      setError('')
      
      // Spinner Loading sewaktu verifikasi akun manual
      Swal.fire({
        title: 'Memverifikasi Akun...',
        text: 'Sedang mencocokkan kredensial Anda',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Menembak langsung ke endpoint Laravel asli di Railway
      const response = await fetch('https://smartspend-be-production.up.railway.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Simpan token token JWT dan informasi pengguna esensial
        localStorage.setItem('token', data.token)
        localStorage.setItem('user_name', data.user.nama || data.user.name)
        localStorage.setItem('user_email', data.user.email)
        localStorage.setItem('role', 'user')

        Swal.fire({
          icon: 'success',
          title: 'Masuk Berhasil!',
          text: `Selamat datang kembali di SmartSpend!`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          iconColor: '#6B0F1A'
        })

        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Masuk',
          text: data.message || 'Email atau password yang Anda masukkan salah.',
          confirmButtonColor: '#6B0F1A'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Masalah Koneksi',
        text: 'Gagal menghubungi server pusat SmartSpend.',
        confirmButtonColor: '#6B0F1A'
      })
    }
  }

  return (
    <div style={styles.container}>
      {/* Card Login */}
      <div style={styles.card}>

        {/* Logo & Title */}
        <div style={styles.logoArea}>
          <div style={styles.shieldIcon}>🛡️</div>
          <h1 style={styles.title}>SmartSpend</h1>
          <p style={styles.subtitle}>Kelola keuanganmu lebih cerdas</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email Anda"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Masukkan password Anda"
                value={formData.password}
                onChange={handleChange}
                style={styles.inputPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
          </div>

          {/* Lupa Password */}
          <div style={styles.forgotRow}>
            <span 
              onClick={() => navigate("/forgot-password")} 
              style={styles.forgotLink}
            >
              Lupa Password?
            </span>
          </div>

          {/* Tombol Login */}
          <button type="submit" style={styles.loginBtn}>
            Login
          </button>

          {/* ===== 3. DIVIDER OR / ATAU ===== */}
          <div style={styles.dividerContainer}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>atau</span>
            <div style={styles.dividerLine} />
          </div>

          {/* ===== 4. TOMBOL GOOGLE AUTH ===== */}
          <button 
            type="button" 
            onClick={() => loginDenganGoogle()} 
            style={styles.googleBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>

        </form>

        {/* Daftar */}
        <p style={styles.registerText}>
          Belum punya akun?{' '}
          <a href="/register" style={styles.registerLink}>
            Daftar Sekarang
          </a>
        </p>

      </div>
    </div>
  )
}

// ============ STYLES ============
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#6B0F1A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  shieldIcon: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#6B0F1A',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#FEE8E8',
    border: '1px solid #C0392B',
    borderLeft: '4px solid #C0392B',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#C0392B',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1A1A1A',
  },
  input: {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    border: '1.5px solid #D1D5DB',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1A1A1A',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPassword: {
    width: '100%',
    height: '48px',
    padding: '0 130px 0 16px',
    border: '1.5px solid #D1D5DB',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1A1A1A',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    padding: '4px 8px',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  forgotRow: {
    textAlign: 'right',
    marginTop: '4px',
  },
  forgotLink: {
    fontSize: '13px',
    color: '#6B0F1A',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loginBtn: {
    width: '100%',
    height: '52px',
    backgroundColor: '#6B0F1A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  googleBtn: {
    width: '100%',
    height: '48px',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    border: '1.5px solid #D1D5DB',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  registerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '24px',
  },
  registerLink: {
    color: '#C9A84C',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
}