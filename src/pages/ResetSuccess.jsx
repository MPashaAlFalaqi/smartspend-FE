import { useNavigate } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const GREEN = '#2D6A4F'
const CREAM = '#F5F0E8'

export default function ResetSuccess() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:'100vh', backgroundColor:CREAM, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ backgroundColor:'#fff', borderRadius:'20px', padding:'56px 48px', width:'100%', maxWidth:'460px', boxShadow:'0 4px 32px rgba(107,15,26,0.08)', textAlign:'center' }}>

        {/* Icon */}
        <div style={{ width:'80px', height:'80px', backgroundColor:GREEN, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 8px 24px rgba(45,106,79,0.3)', fontSize:'36px' }}>
          ✅
        </div>

        <h1 style={{ color:MAROON, fontSize:'24px', fontWeight:'700', margin:'0 0 12px' }}>
          Password Berhasil Diubah!
        </h1>
        <p style={{ color:'#6B7280', fontSize:'14px', lineHeight:'1.6', margin:'0 0 24px' }}>
          Password akun SmartSpend kamu telah berhasil diperbarui. Silakan login menggunakan password barumu.
        </p>

        {/* Tips */}
        <div style={{ backgroundColor:'#F0FDF4', borderRadius:'10px', padding:'14px 16px', marginBottom:'28px', display:'flex', alignItems:'center', gap:'10px', textAlign:'left' }}>
          <span style={{ fontSize:'16px' }}>🛡️</span>
          <span style={{ fontSize:'13px', color:GREEN, fontWeight:'500' }}>
            Tips: Jangan bagikan password kamu kepada siapapun.
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{ width:'100%', height:'52px', backgroundColor:MAROON, color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 15px rgba(107,15,26,0.3)' }}>
          Kembali ke Login →
        </button>

      </div>
    </div>
  )
}