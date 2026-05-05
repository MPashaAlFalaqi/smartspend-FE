import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'
import Register from './pages/Register'
import ForgotPassword from "./pages/forgotPassword";

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Email dan password wajib diisi!'); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#6B0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', margin: 0, padding: 0 }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', margin: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="#6B0F1A" style={{ marginBottom: '12px' }}>
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <h1 style={{ color: '#6B0F1A', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>SmartSpend</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Kelola keuanganmu lebih cerdas</p>
        </div>
        {error && <div style={{ backgroundColor: '#FEE8E8', borderLeft: '4px solid #C0392B', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#C0392B', fontSize: '14px' }}>⚠️ {error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" placeholder="Masukkan email Anda" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', height: '48px', padding: '0 16px', border: '1.5px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Masukkan password Anda" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', height: '48px', padding: '0 48px 0 16px', border: '1.5px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="/forgot-password" style={{ color: '#6B0F1A', fontSize: '13px', textDecoration: 'none' }}>Lupa Password?</Link>
          </div>
          <button type="submit" style={{ width: '100%', height: '52px', backgroundColor: '#6B0F1A', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', marginTop: '24px' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: '#C9A84C', fontWeight: 'bold', textDecoration: 'none' }}>Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <h1 style={{ color: '#6B0F1A' }}>Dashboard SmartSpend 🎉</h1>
      <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#6B0F1A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}