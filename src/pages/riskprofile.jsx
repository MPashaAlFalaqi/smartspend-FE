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

  const formatRibuan = (nilai) => {
    if (!nilai) return ''
    const angkaSaja = nilai.toString().replace(/[^0-9]/g, '')
    return angkaSaja.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const bersihkanAngka = (nilai) => {
    return nilai.replace(/[^0-9]/g, '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'penghasilan') {
      const angkaMurni = bersihkanAngka(value)
      setForm({ ...form, penghasilan: angkaMurni })
    } else if (name === 'usia') {
      if (value !== '' && parseInt(value) < 0) {
        setError('Usia tidak boleh bernilai minus!')
        return
      }
      setForm({ ...form, usia: value })
    } else {
      setForm({ ...form, [name]: value })
    }
    setError('')
  }

  const handleStatus = (val) => {
    setForm({ ...form, status: val })
    setError('')
  }

  // ==========================================
  // FIXED: PROSES SUBMIT SINKRON DENGAN BACKEND
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama || !form.usia || !form.pekerjaan || !form.status || !form.penghasilan) {
      setError('Harap lengkapi semua data sebelum melanjutkan.')
      return
    }

    if (parseInt(form.usia) <= 0) {
      setError('Harap masukkan usia yang valid (lebih dari 0).')
      return
    }

    try {
      const token = localStorage.getItem('token')

      // Antisipasi penulisan ENUM status untuk MySQL (diubah jadi huruf kecil & Pensiunan -> pensiun)
      let statusFormatDatabase = form.status.toLowerCase();
      if (statusFormatDatabase === 'pensiunan') {
        statusFormatDatabase = 'pensiun';
      }

      const response = await fetch('http://127.0.0.1:8000/api/risk-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          usia:        parseInt(form.usia),          // Diubah ke Integer murni
          pekerjaan:   form.pekerjaan,
          status:      statusFormatDatabase,         // Huruf kecil sesuai ENUM database
          penghasilan: parseFloat(form.penghasilan), // Diubah ke Float/Numeric murni
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('penghasilan', form.penghasilan)
        localStorage.setItem('namaUser',    form.nama)
        localStorage.setItem('pekerjaan',   form.pekerjaan)

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
        body { background:${CREAM}; min-height: 100vh; }
        
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        
        .custom-input {
          width: 100%;
          height: 50px;
          padding: 0 18px;
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          font-size: 14px;
          box-sizing: border-box;
          background: #FCFBFA;
          color: #1F2937;
          transition: all 0.3s ease;
        }
        .custom-input:focus {
          border-color: ${MAROON} !important;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(107, 15, 26, 0.08);
          outline: none;
        }

        .status-pill {
          padding: 12px 24px;
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          background: #FFFFFF;
          color: #4B5563;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .status-pill:hover {
          border-color: ${MAROON};
          color: ${MAROON};
          background: rgba(107, 15, 26, 0.02);
          transform: translateY(-1px);
        }
        .status-pill.active {
          border-color: ${MAROON};
          background: ${MAROON};
          color: #FFFFFF;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(107, 15, 26, 0.2);
        }

        .btn-submit {
          width: 100%;
          height: 54px;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
        }
        .btn-submit:not(:disabled) {
          background: linear-gradient(135deg, ${MAROON} 0%, #8B1E2B 100%);
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(107, 15, 26, 0.25);
        }
        .btn-submit:not(:disabled):hover {
          transform: translateY(-1.5px);
          box-shadow: 0 8px 24px rgba(107, 15, 26, 0.35);
          filter: brightness(1.1);
        }
        .btn-submit:disabled {
          background: #9CA3AF;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>

        {/* ===== NAVBAR ===== */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px', letterSpacing: '0.5px' }}>SmartSpend</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px', boxShadow: '0 2px 6px rgba(201,168,76,0.2)' }}>Risk Profile</span>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>LM</span>
            </div>
            <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>Lila Mahasiswa</span>
          </div>
        </nav>

        {/* ===== MAIN CONTAINER ===== */}
        <div style={{ maxWidth:'740px', margin:'0 auto', padding:'48px 24px' }}>

          <div style={{ 
            backgroundColor:'#FFFFFF', 
            borderRadius:'24px', 
            padding:'48px', 
            boxShadow:'0 10px 35px rgba(107,15,26,0.04), 0 2px 8px rgba(0,0,0,0.02)',
            border: '1px solid rgba(107, 15, 26, 0.05)'
          }}>

            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span style={{ 
                backgroundColor: 'rgba(201,168,76,0.12)', 
                color: '#A18232', 
                fontSize: '12px', 
                fontWeight: '700', 
                padding: '6px 16px', 
                borderRadius: '30px', 
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                LANGKAH AWAL
              </span>
              <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON, letterSpacing: '-0.3px' }}>
                Profil Risiko Finansial
              </h1>
              <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>
                Lengkapi data di bawah untuk memetakan strategi budget terbaik Anda.
              </p>
            </div>

            {error && (
              <div style={{ backgroundColor:'#FEF2F2', borderLeft:`4px solid ${RED}`, borderRadius:'12px', padding:'14px 20px', marginBottom:'28px', color:RED, fontSize:'14px', display:'flex', alignItems:'center', gap:'10px', boxShadow: '0 2px 6px rgba(192,57,43,0.05)' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span> {error}
              </div>
            )}

            {sukses && (
              <div style={{ backgroundColor:'#F0FDF4', borderLeft:'4px solid #2D6A4F', borderRadius:'12px', padding:'14px 20px', marginBottom:'28px', color:'#2D6A4F', fontSize:'14px', fontWeight:'500', display:'flex', alignItems:'center', gap:'10px', boxShadow: '0 2px 6px rgba(45,106,79,0.05)' }}>
                <span style={{ fontSize: '16px' }}>✅</span> Data berhasil disimpan! Mengarahkan ke Budget Planner...
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ textAlign:'left' }}>

              <div style={{ marginBottom:'24px' }}>
                <label style={{ fontSize:'12px', fontWeight:'700', display:'block', marginBottom:'8px', color:'#4B5563', letterSpacing:'0.5px' }}>NAMA LENGKAP</label>
                <input
                  type="text" name="nama"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.nama} onChange={handleChange}
                  className="custom-input"
                />
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px' }}>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:'700', display:'block', marginBottom:'8px', color:'#4B5563', letterSpacing:'0.5px' }}>USIA (TAHUN)</label>
                  <input
                    type="number" 
                    name="usia"
                    min="1"
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === '+' || e.key === 'e') {
                        e.preventDefault()
                      }
                    }}
                    placeholder="Contoh: 21"
                    value={form.usia} 
                    onChange={handleChange}
                    className="custom-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:'700', display:'block', marginBottom:'8px', color:'#4B5563', letterSpacing:'0.5px' }}>PEKERJAAN</label>
                  <input
                    type="text" name="pekerjaan"
                    placeholder="Contoh: Mahasiswa, UI Designer"
                    value={form.pekerjaan} onChange={handleChange}
                    className="custom-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom:'24px' }}>
                <label style={{ fontSize:'12px', fontWeight:'700', display:'block', marginBottom:'10px', color:'#4B5563', letterSpacing:'0.5px' }}>STATUS SAAT INI</label>
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                  {['Mahasiswa', 'Pekerja', 'Wiraswasta', 'Pensiunan'].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => handleStatus(s)}
                      className={`status-pill ${form.status === s ? 'active' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'36px' }}>
                <label style={{ fontSize:'12px', fontWeight:'700', display:'block', marginBottom:'8px', color:'#4B5563', letterSpacing:'0.5px' }}>PENGHASILAN BULANAN</label>
                <div style={{ position:'relative' }}>
                  <span style={{ 
                    position:'absolute', 
                    left:'18px', 
                    top:'50%', 
                    transform:'translateY(-50%)', 
                    color: MAROON, 
                    fontWeight:'700', 
                    fontSize:'15px',
                    pointerEvents: 'none'
                  }}>
                    Rp
                  </span>
                  <input
                    type="text" 
                    name="penghasilan"
                    placeholder="0"
                    value={formatRibuan(form.penghasilan)} 
                    onChange={handleChange}
                    className="custom-input"
                    style={{ paddingLeft: '46px', fontSize: '15px', fontWeight: '500' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={sukses}
                className="btn-submit"
              >
                {sukses ? 'Memproses Analisis...' : 'Analisis Profil Risiko & Lanjutkan →'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  )
}