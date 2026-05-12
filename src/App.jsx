import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RiskProfile from './pages/RiskProfile'
import ForgotPassword from "./pages/forgotPassword";
import BudgetPlanner from './pages/BudgetPlanner'
import FinalAnalyze from './pages/FinalAnalyze'
import History from './pages/History'
import ResetPassword from './pages/ResetPassword'
import ResetSuccess from './pages/ResetSuccess'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard'
import AdminManageUsers from './pages/AdminManageUsers'
import AdminReports from './pages/AdminReports'
import PageTransition from './components/PageTransition'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'

const font =`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
  body { background: ${MAROON}; }
`

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
  e.preventDefault()
  if (!email || !pass) {
    setError('Email dan password wajib diisi!')
    return
  }

  // Cek admin
  if (email === 'admin@smartspend.com' && pass === 'admin123') {
    localStorage.setItem('role', 'admin')
    localStorage.setItem('namaUser', 'Admin')
    navigate('/admin-dashboard')
    return
  }

  // User biasa
  localStorage.setItem('role', 'user')
  navigate('/dashboard')
}
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        .login-input:focus { border-color:${MAROON} !important; outline:none; background:#fff !important; }
        .login-btn:hover { opacity:0.92; transform:translateY(-1px); }
        .login-btn { transition: all 0.2s ease; }
      `}</style>

      <div style={{
        minHeight:'100vh', width:'100vw',
        display:'flex', margin:0, padding:0,
      }}>

        {/* KIRI — Branding */}
        <div style={{
          width:'45%',
          backgroundColor:MAROON,
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          padding:'48px',
          backgroundImage:`radial-gradient(circle at 30% 70%, rgba(201,168,76,0.2) 0%, transparent 60%)`,
          position:'relative',
        }}>
          {/* Logo */}
          <div style={{ position:'absolute', top:'32px', left:'32px', display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
          </div>

          {/* Konten Tengah */}
          <div style={{ textAlign:'center' }}>
            <div style={{
              width:'120px', height:'120px',
              backgroundColor:'rgba(201,168,76,0.15)',
              borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 28px',
              border:'2px solid rgba(201,168,76,0.3)',
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill={GOLD}>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>

            <h2 style={{ color:'#FFFFFF', fontSize:'26px', fontWeight:'700', margin:'0 0 14px', lineHeight:'1.3' }}>
              Selamat Datang<br/>Kembali!
            </h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'14px', lineHeight:'1.7', margin:'0 0 40px' }}>
              Masuk ke akun SmartSpend kamu dan kelola keuangan dengan lebih cerdas.
            </p>

            {/* Feature list */}
            {[
              '📊 Analisis profil risiko finansial',
              '💰 Budget planner bulanan',
              '🔔 Spending alert otomatis',
            ].map((item,i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'12px',
                marginBottom:'10px', width:'100%',
                backgroundColor:'rgba(255,255,255,0.08)',
                padding:'10px 16px', borderRadius:'10px',
              }}>
                <span style={{ fontSize:'16px' }}>{item.split(' ')[0]}</span>
                <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'13px' }}>
                  {item.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom text */}
          <div style={{ position:'absolute', bottom:'32px', textAlign:'center' }}>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'13px' }}>
              Belum punya akun?{' '}
            </span>
            <span
              onClick={() => navigate('/register')}
              style={{ color:GOLD, fontWeight:'600', fontSize:'13px', cursor:'pointer' }}>
              Daftar sekarang
            </span>
          </div>
        </div>

        {/* KANAN — Form Login */}
        <div style={{
          width:'55%',
          backgroundColor:'#F5F0E8',
          display:'flex', alignItems:'center',
          justifyContent:'center', padding:'32px',
        }}>
          <div style={{
            backgroundColor:'#FFFFFF',
            borderRadius:'20px',
            padding:'48px 44px',
            width:'100%', maxWidth:'460px',
            boxShadow:'0 4px 32px rgba(107,15,26,0.08)',
          }}>

            {/* Header */}
            <div style={{ marginBottom:'32px' }}>
              <h1 style={{ color:MAROON, fontSize:'26px', fontWeight:'700', margin:'0 0 6px', letterSpacing:'-0.3px' }}>
                Masuk ke Akun SmartSpend
              </h1>
              <p style={{ color:'#9CA3AF', fontSize:'14px', margin:0 }}>
                Masukkan email dan password kamu untuk melanjutkan
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                backgroundColor:'#FEF2F2',
                border:'1px solid #FECACA',
                borderLeft:'4px solid #C0392B',
                borderRadius:'10px',
                padding:'12px 16px', marginBottom:'20px',
                color:'#C0392B', fontSize:'13px',
                display:'flex', alignItems:'center', gap:'8px',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>

              {/* Email */}
              <div style={{ marginBottom:'18px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>
                  ALAMAT EMAIL
                </label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  style={{
                    width:'100%', height:'50px', padding:'0 16px',
                    border:'1.5px solid #E5E7EB', borderRadius:'10px',
                    fontSize:'14px', boxSizing:'border-box',
                    backgroundColor:'#FAFAFA', color:'#1A1A1A',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom:'12px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>
                  PASSWORD
                </label>
                <div style={{ position:'relative' }}>
                  <input
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password kamu"
                    value={pass}
                    onChange={e => { setPass(e.target.value); setError('') }}
                    style={{
                      width:'100%', height:'50px', padding:'0 48px 0 16px',
                      border:'1.5px solid #E5E7EB', borderRadius:'10px',
                      fontSize:'14px', boxSizing:'border-box',
                      backgroundColor:'#FAFAFA', color:'#1A1A1A',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'#9CA3AF' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Ingat saya + Lupa password */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer' }}>
                  <input type="checkbox" style={{ accentColor:MAROON, width:'15px', height:'15px' }}/>
                  <span style={{ fontSize:'13px', color:'#6B7280' }}>Ingat saya</span>
                </label>
                <span
                  onClick={() => navigate('/forgot-password')}
                  style={{ fontSize:'13px', color:MAROON, fontWeight:'600', cursor:'pointer' }}>
                  Lupa Password?
                </span>
              </div>

              {/* Tombol Login */}
              <button
                type="submit"
                className="login-btn"
                style={{
                  width:'100%', height:'52px',
                  backgroundColor:MAROON, color:'#FFFFFF',
                  border:'none', borderRadius:'12px',
                  fontSize:'15px', fontWeight:'700',
                  cursor:'pointer', marginBottom:'20px',
                  boxShadow:'0 4px 16px rgba(107,15,26,0.35)',
                  letterSpacing:'0.3px',
                }}>
                Masuk →
              </button>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ flex:1, height:'1px', backgroundColor:'#E5E7EB' }}/>
                <span style={{ fontSize:'12px', color:'#9CA3AF', fontWeight:'500' }}>atau masuk dengan</span>
                <div style={{ flex:1, height:'1px', backgroundColor:'#E5E7EB' }}/>
              </div>

              {/* Google */}
              <button type="button" style={{
                width:'100%', height:'48px',
                backgroundColor:'#FFFFFF', border:'1.5px solid #E5E7EB',
                borderRadius:'12px', fontSize:'14px', fontWeight:'500',
                cursor:'pointer', display:'flex', alignItems:'center',
                justifyContent:'center', gap:'10px',
                fontFamily:'Poppins,sans-serif',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Masuk dengan Google
              </button>

            </form>

            {/* Daftar */}
            <p style={{ textAlign:'center', fontSize:'14px', color:'#9CA3AF', marginTop:'24px', marginBottom:0 }}>
              Belum punya akun?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{ color:MAROON, fontWeight:'700', cursor:'pointer' }}>
                Daftar Sekarang
              </span>
            </p>

          </div>
        </div>
      </div>
    </>
  )
}
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><Login /></PageTransition>
        }/>
        <Route path="/login" element={
          <PageTransition><Login /></PageTransition>
        }/>
        <Route path="/register" element={
          <PageTransition><Register /></PageTransition>
        }/>
        <Route path="/forgot-password" element={
          <PageTransition><ForgotPassword /></PageTransition>
        }/>
        <Route path="/reset-password" element={
          <PageTransition><ResetPassword /></PageTransition>
        }/>
        <Route path="/reset-success" element={
          <PageTransition><ResetSuccess /></PageTransition>
        }/>
        <Route path="/dashboard" element={
          <PageTransition><Dashboard /></PageTransition>
        }/>
        <Route path="/risk-profile" element={
          <PageTransition><RiskProfile /></PageTransition>
        }/>
        <Route path="/budget-planner" element={
          <PageTransition><BudgetPlanner /></PageTransition>
        }/>
        <Route path="/final-analyze" element={
          <PageTransition><FinalAnalyze /></PageTransition>
        }/>
        <Route path="/history" element={
          <PageTransition><History /></PageTransition>
        }/>
        <Route path="/user-profile" element={
  <PageTransition><UserProfile /></PageTransition>
}/>
<Route path="/admin-dashboard" element={
  <PageTransition><AdminDashboard /></PageTransition>
}/>
<Route path="/admin-manage-users" element={
  <PageTransition><AdminManageUsers /></PageTransition>
}/>
<Route path="/admin-reports" element={
  <PageTransition><AdminReports /></PageTransition>
}/>
      </Routes>
    </AnimatePresence>
  )
}
export default function App() {
  return (    
    <>
      <style>{font}</style>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  )
} 