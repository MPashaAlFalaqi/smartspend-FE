import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [pass, setPass] = useState('')
  const [conf, setConf] = useState('')

  return (
    <div style={{ minHeight:'100vh', backgroundColor:MAROON, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ backgroundColor:'#fff', borderRadius:'20px', padding:'48px 40px', width:'100%', maxWidth:'440px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', textAlign:'center' }}>
        <div style={{ width:'72px', height:'72px', backgroundColor:'#FFF8E0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'32px' }}>🔑</div>
        <h1 style={{ color:MAROON, fontSize:'24px', fontWeight:'700', margin:'0 0 10px' }}>Reset Password</h1>
        <p style={{ color:'#9CA3AF', fontSize:'14px', margin:'0 0 28px' }}>Buat password baru yang kuat untuk akunmu.</p>
        <form onSubmit={(e) => { e.preventDefault(); navigate('/reset-success') }}>
          <div style={{ textAlign:'left', marginBottom:'16px' }}>
            <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151' }}>PASSWORD BARU</label>
            <div style={{ position:'relative' }}>
              <input type={showPass?'text':'password'} placeholder="Minimal 8 karakter" value={pass} onChange={e=>setPass(e.target.value)}
                style={{ width:'100%', height:'48px', padding:'0 48px 0 16px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box' }}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'18px' }}>
                {showPass?'🙈':'👁️'}
              </button>
            </div>
          </div>
          <div style={{ textAlign:'left', marginBottom:'24px' }}>
            <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151' }}>KONFIRMASI PASSWORD</label>
            <div style={{ position:'relative' }}>
              <input type={showConf?'text':'password'} placeholder="Ulangi password baru" value={conf} onChange={e=>setConf(e.target.value)}
                style={{ width:'100%', height:'48px', padding:'0 48px 0 16px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box' }}/>
              <button type="button" onClick={()=>setShowConf(!showConf)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'18px' }}>
                {showConf?'🙈':'👁️'}
              </button>
            </div>
          </div>
          <button type="submit" style={{ width:'100%', height:'52px', backgroundColor:MAROON, color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'600', cursor:'pointer', marginBottom:'16px' }}>
            Simpan Password Baru
          </button>
        </form>
        <Link to="/" style={{ color:GOLD, fontSize:'14px', fontWeight:'500' }}>← Kembali ke Login</Link>
      </div>
    </div>
  )
}