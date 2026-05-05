import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()

    // Validasi sederhana
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi!')
      return
    }

    // Nanti diganti dengan API call ke Laravel
    console.log('Login dengan:', formData)
    navigate('/dashboard')
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
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Lupa Password */}
          <div style={styles.forgotRow}>
            <a href="/forgot-password" style={styles.forgotLink}>
              Lupa Password?
            </a>
          </div>

          {/* Tombol Login */}
          <button type="submit" style={styles.loginBtn}>
            Login
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
    padding: '0 48px 0 16px',
    border: '1.5px solid #D1D5DB',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1A1A1A',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0',
  },
  forgotRow: {
    textAlign: 'right',
    marginTop: '-8px',
  },
  forgotLink: {
    fontSize: '13px',
    color: '#6B0F1A',
    textDecoration: 'none',
    fontWeight: '500',
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