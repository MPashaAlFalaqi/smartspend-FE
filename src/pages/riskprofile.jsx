import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function RiskProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nama: '', usia: '', pekerjaan: '', status: '', penghasilan: ''
  })
  const [error, setError] = useState('')
  const [sukses, setSukses] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleStatus = (val) => {
    setForm({ ...form, status: val })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama || !form.usia || !form.pekerjaan || !form.status || !form.penghasilan) {
      setError('Harap lengkapi semua data sebelum melanjutkan.')
      return
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://127.0.0.1:8000/api/risk-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          usia:        form.usia,
          pekerjaan:   form.pekerjaan,
          status:      form.status,
          penghasilan: form.penghasilan,
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('penghasilan', form.penghasilan)
        localStorage.setItem('namaUser',    form.nama)
        localStorage.setItem('pekerjaan',   form.pekerjaan)

        // Tampilkan pesan sukses lalu ke budget planner
        setSukses(true)
        setTimeout(() => navigate('/budget-planner'), 1500)

      } else {
        setError(data.message || 'Gagal menyimpan data!')
      }

    } catch (err) {
      setError('Gagal terhubung ke server!')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .status-btn { padding:10px 20px; border:1.5px solid #D1D5DB; border-radius:10px; background:white; cursor:pointer; font-size:14px; font-family:'Poppins',sans-serif; transition:all 0.2s; }
        .status-btn:hover { border-color:${MAROON}; color:${MAROON}; }
        input:focus { border-color:${MAROON} !important; outline:none; }
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>

        {/* NAVBAR */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Risk Profile</span>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>LM</span>
            </div>
            <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>Lila Mahasiswa</span>
          </div>
        </nav>

        <div style={{ maxWidth:'800px', margin:'0 auto', padding:'32px' }}>

          {/* Form Box */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'40px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Title */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h1 style={{ fontSize:'22px', fontWeight:'700', color:MAROON }}>Profil Risiko Finansial</h1>
            </div>

            {/* Alert Error */}
            {error && (
              <div style={{ backgroundColor:'#FEF2F2', borderLeft:`4px solid ${RED}`, borderRadius:'10px', padding:'12px 16px', marginBottom:'24px', color:RED, fontSize:'13px', display:'flex', gap:'8px' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Pesan Sukses */}
            {sukses && (
              <div style={{
                backgroundColor:'#F0FDF4',
                borderLeft:'4px solid #2D6A4F',
                borderRadius:'10px',
                padding:'12px 16px',
                marginBottom:'20px',
                color:'#2D6A4F',
                fontSize:'13px',
                fontWeight:'500'
              }}>
                ✅ Data berhasil disimpan! Mengarahkan ke Budget Planner...
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ textAlign:'left' }}>

              {/* Nama */}
              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>NAMA LENGKAP</label>
                <input
                  type="text" name="nama"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.nama} onChange={handleChange}
                  style={{ width:'100%', height:'48px', padding:'0 16px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA' }}
                />
              </div>

              {/* Usia & Pekerjaan */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
                <div>
                  <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>USIA</label>
                  <input
                    type="number" name="usia"
                    placeholder="Masukkan usia Anda"
                    value={form.usia} onChange={handleChange}
                    style={{ width:'100%', height:'48px', padding:'0 16px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>PEKERJAAN</label>
                  <input
                    type="text" name="pekerjaan"
                    placeholder="Masukkan pekerjaan Anda"
                    value={form.pekerjaan} onChange={handleChange}
                    style={{ width:'100%', height:'48px', padding:'0 16px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA' }}
                  />
                </div>
              </div>

              {/* Status */}
              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>STATUS</label>
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                  {['Mahasiswa', 'Pekerja', 'Wiraswasta', 'Pensiunan'].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => handleStatus(s)}
                      style={{
                        padding:'10px 20px',
                        border: form.status === s ? `2px solid ${MAROON}` : '1.5px solid #E5E7EB',
                        borderRadius:'10px',
                        backgroundColor: form.status === s ? MAROON : 'white',
                        color: form.status === s ? 'white' : '#6B7280',
                        cursor:'pointer',
                        fontSize:'14px',
                        fontFamily:'Poppins,sans-serif',
                        fontWeight: form.status === s ? '600' : '400',
                        transition:'all 0.2s'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Penghasilan */}
              <div style={{ marginBottom:'32px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>PENGHASILAN BULANAN</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:MAROON, fontWeight:'600', fontSize:'14px' }}>Rp</span>
                  <input
                    type="number" name="penghasilan"
                    placeholder="Masukkan penghasilan bulanan Anda"
                    value={form.penghasilan} onChange={handleChange}
                    style={{ width:'100%', height:'48px', padding:'0 16px 0 44px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={sukses}
                style={{
                  width:'100%', height:'52px',
                  backgroundColor: sukses ? '#9CA3AF' : MAROON, 
                  color:'white',
                  border:'none', borderRadius:'12px',
                  fontSize:'15px', fontWeight:'600',
                  cursor: sukses ? 'not-allowed' : 'pointer',
                  boxShadow: sukses ? 'none' : '0 4px 15px rgba(107,15,26,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {sukses ? 'Memproses...' : 'Analisis Profil Risiko & Lanjutkan →'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  )
}