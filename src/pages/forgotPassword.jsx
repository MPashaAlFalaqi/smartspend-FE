import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email wajib diisi!')
      return
    }
    navigate('/reset-password')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        input:focus { border-color:${MAROON} !important; outline:none; }
      `}</style>

      <div style={{
        minHeight:'100vh',
        width:'100vw',
        backgroundColor:MAROON,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'20px',
      }}>
        <div style={{
          backgroundColor:'#FFFFFF',
          borderRadius:'20px',
          padding:'48px 40px',
          width:'100%',
          maxWidth:'440px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
          textAlign:'center',
        }}>

          {/* Icon */}
          <div style={{
            width:'72px', height:'72px',
            backgroundColor:'#FFF3E0',
            borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 20px',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 style={{
            color:MAROON, fontSize:'26px',
            fontWeight:'700', margin:'0 0 10px',
          }}>
            Lupa Password?
          </h1>
          <p style={{
            color:'#6B7280', fontSize:'14px',
            lineHeight:'1.6', margin:'0 0 32px',
          }}>
            Masukkan email kamu dan kami akan mengirimkan link untuk mereset password.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor:'#FEF2F2',
              borderLeft:'4px solid #C0392B',
              borderRadius:'8px',
              padding:'12px 16px',
              marginBottom:'16px',
              color:'#C0392B',
              fontSize:'13px',
              textAlign:'left',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign:'left', marginBottom:'20px' }}>
              <label style={{
                fontSize:'13px', fontWeight:'600',
                display:'block', marginBottom:'8px',
                color:'#374151', letterSpacing:'0.3px',
              }}>
                ALAMAT EMAIL
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                style={{
                  width:'100%', height:'48px',
                  padding:'0 16px',
                  border:'1.5px solid #E5E7EB',
                  borderRadius:'10px', fontSize:'14px',
                  boxSizing:'border-box',
                  backgroundColor:'#FAFAFA',
                  color:'#1A1A1A',
                }}
              />
            </div>

            <button type="submit" style={{
              width:'100%', height:'52px',
              backgroundColor:MAROON, color:'#fff',
              border:'none', borderRadius:'12px',
              fontSize:'15px', fontWeight:'600',
              cursor:'pointer', marginBottom:'20px',
              boxShadow:'0 4px 15px rgba(107,15,26,0.3)',
              fontFamily:'Poppins,sans-serif',
            }}>
              Kirim Link Reset
            </button>
          </form>

          {/* Kembali */}
          <Link to="/" style={{
            color:GOLD, fontSize:'14px',
            fontWeight:'500', textDecoration:'none',
          }}>
            ← Kembali ke Login
          </Link>

        </div>
      </div>
    </>
  )
}