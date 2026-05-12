import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

const defaultKategori = {
  pokok: [
    { id:1, nama:'Sewa/Kos', icon:'🏠', jumlah:1200000 },
    { id:2, nama:'Listrik & Air', icon:'⚡', jumlah:200000 },
    { id:3, nama:'Makan & Minum', icon:'🍽️', jumlah:800000 },
    { id:4, nama:'Transportasi', icon:'🚌', jumlah:300000 },
    { id:5, nama:'Lainnya', icon:'➕', jumlah:150000 },
  ],
  keinginan: [
    { id:1, nama:'Hiburan', icon:'🎬', jumlah:200000 },
    { id:2, nama:'Belanja Online', icon:'🛍️', jumlah:150000 },
    { id:3, nama:'Cafe & Resto', icon:'☕', jumlah:100000 },
  ],
  tabungan: [
    { id:1, nama:'Tabungan', icon:'🏦', jumlah:300000 },
    { id:2, nama:'Investasi', icon:'📈', jumlah:200000 },
  ],
}

export default function BudgetPlanner() {
  const navigate = useNavigate()
  const [pemasukan, setPemasukan] = useState(() => {
  // Ambil otomatis dari Risk Profile
  const savedPenghasilan = localStorage.getItem('penghasilan')
  return savedPenghasilan || '0'
})
  const [activeTab, setActiveTab] = useState('pokok')
  const [kategori, setKategori] = useState(defaultKategori)
  const [saved, setSaved] = useState(false)

  const formatRp = (val) => val.toLocaleString('id-ID')

  const totalPokok = kategori.pokok.reduce((a,b) => a + b.jumlah, 0)
  const totalKeinginan = kategori.keinginan.reduce((a,b) => a + b.jumlah, 0)
  const totalTabungan = kategori.tabungan.reduce((a,b) => a + b.jumlah, 0)
  const totalPengeluaran = totalPokok + totalKeinginan + totalTabungan
  const sisaAnggaran = pemasukan - totalPengeluaran
  const persenPokok = Math.round((totalPokok / pemasukan) * 100)
  const persenKeinginan = Math.round((totalKeinginan / pemasukan) * 100)
  const persenTabungan = Math.round((totalTabungan / pemasukan) * 100)
  const persenTotal = Math.round((totalPengeluaran / pemasukan) * 100)

  const handleJumlah = (tab, id, val) => {
    setKategori(prev => ({
      ...prev,
      [tab]: prev[tab].map(k => k.id === id ? { ...k, jumlah: parseInt(val) || 0 } : k)
    }))
  }

  const handleTambah = (tab) => {
    const nama = prompt('Nama kategori baru:')
    if (!nama) return
    setKategori(prev => ({
      ...prev,
      [tab]: [...prev[tab], { id: Date.now(), nama, icon:'📌', jumlah:0 }]
    }))
  }

  const tabs = [
    { key:'pokok', label:'Pengeluaran Pokok' },
    { key:'keinginan', label:'Pengeluaran Keinginan' },
    { key:'tabungan', label:'Tabungan & Investasi' },
  ]

  const currentTotal = {
    pokok: totalPokok,
    keinginan: totalKeinginan,
    tabungan: totalTabungan,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
        input:focus { border-color:${MAROON} !important; outline:none; background:white !important; }
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
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Budget Planner</span>
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>LM</span>
            </div>
            <span style={{ color:'white', fontSize:'14px', fontWeight:'500' }}>Lila Mahasiswa</span>
          </div>
        </nav>

        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'32px' }}>

          {/* Page Title */}
          <div style={{ marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON }}>Budget Planner</h1>
            </div>
            <p style={{ color:'#9CA3AF', fontSize:'14px', marginLeft:'20px' }}>
              Kelola pemasukan dan pengeluaran bulanan kamu
            </p>
          </div>

          {/* Pemasukan */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontSize:'18px', fontWeight:'700', color:MAROON }}>Pemasukan Bulanan</h2>
            </div>

            <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'8px', color:'#374151', letterSpacing:'0.3px' }}>
              TOTAL PEMASUKAN
            </label>
            <div style={{ position:'relative', marginBottom:'16px' }}>
              <span style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:MAROON, fontWeight:'700', fontSize:'16px' }}>Rp</span>
              <input
                 type="number"
                 value={pemasukan}
                 readOnly
                 style={{ width:'100%', height:'52px', padding:'0 16px 0 48px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'16px', fontWeight:'600', color:'#1A1A1A', backgroundColor:'#F3F4F6', boxSizing:'border-box', cursor:'not-allowed' }}
                 />
              
            </div>

            <div style={{ backgroundColor:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'10px', padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>✅</span>
              <span style={{ color:GREEN, fontSize:'13px', fontWeight:'500' }}>Pemasukan bulan April 2025 telah dicatat.</span>
            </div>
          </div>

          {/* Catat Pengeluaran */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontSize:'18px', fontWeight:'700', color:MAROON }}>Catat Pengeluaran</h2>
            </div>

            {/* Tabs */}
            <div style={{ backgroundColor:'#F3F4F6', borderRadius:'12px', padding:'4px', display:'flex', gap:'4px', marginBottom:'24px' }}>
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex:1, height:'40px', border:'none', borderRadius:'10px', cursor:'pointer',
                    backgroundColor: activeTab === tab.key ? MAROON : 'transparent',
                    color: activeTab === tab.key ? 'white' : '#6B7280',
                    fontSize:'13px', fontWeight: activeTab === tab.key ? '600' : '400',
                    fontFamily:'Poppins,sans-serif', transition:'all 0.2s',
                    boxShadow: activeTab === tab.key ? '0 2px 8px rgba(107,15,26,0.2)' : 'none'
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Kategori List */}
            {kategori[activeTab].map((item, idx) => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 0', borderBottom: idx < kategori[activeTab].length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ width:'44px', height:'44px', backgroundColor: activeTab === 'pokok' ? '#FFF3E0' : activeTab === 'keinginan' ? '#F3E5F5' : '#E8F5E9', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                  {item.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:'600', fontSize:'14px', color:'#1A1A1A', marginBottom:'2px' }}>{item.nama}</p>
                  <p style={{ fontSize:'12px', color:'#9CA3AF' }}>Batas anggaran</p>
                </div>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', fontSize:'13px', fontWeight:'500' }}>Rp</span>
                  <input
                    type="number"
                    value={item.jumlah}
                    onChange={e => handleJumlah(activeTab, item.id, e.target.value)}
                    style={{ width:'180px', height:'44px', padding:'0 12px 0 36px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', fontWeight:'600', color:'#1A1A1A', backgroundColor:'#FAFAFA', boxSizing:'border-box', textAlign:'right' }}
                  />
                </div>
              </div>
            ))}

            {/* Tambah Kategori */}
            <button
              onClick={() => handleTambah(activeTab)}
              style={{ width:'100%', height:'48px', backgroundColor:'white', border:`1.5px dashed ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', marginTop:'16px', fontFamily:'Poppins,sans-serif' }}>
              + Tambah Kategori
            </button>

            {/* Total per tab */}
            <div style={{ marginTop:'16px', textAlign:'right' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'15px' }}>
                Total {tabs.find(t=>t.key===activeTab)?.label}: Rp {formatRp(currentTotal[activeTab])}
              </span>
            </div>
          </div>

          {/* Ringkasan Anggaran */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'28px 32px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h2 style={{ fontSize:'18px', fontWeight:'700', color:MAROON }}>Ringkasan Anggaran</h2>
            </div>

            {/* Progress Bars */}
            {[
              { label:'Pengeluaran Pokok', total:totalPokok, persen:persenPokok, color:MAROON },
              { label:'Pengeluaran Keinginan', total:totalKeinginan, persen:persenKeinginan, color:GOLD },
              { label:'Tabungan & Investasi', total:totalTabungan, persen:persenTabungan, color:GREEN },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize:'14px', fontWeight:'600', color:'#1A1A1A' }}>{item.label}</span>
                  <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
                    <span style={{ fontSize:'13px', color:'#9CA3AF' }}>Rp {formatRp(item.total)} / Rp {formatRp(pemasukan)}</span>
                    <span style={{ fontSize:'14px', fontWeight:'700', color: item.persen >= 80 ? RED : item.color }}>{item.persen}%</span>
                  </div>
                </div>
                <div style={{ backgroundColor:'#F3F4F6', borderRadius:'10px', height:'10px', overflow:'hidden' }}>
                  <div style={{ width:`${Math.min(item.persen, 100)}%`, height:'100%', backgroundColor: item.persen >= 80 ? RED : item.color, borderRadius:'10px', transition:'width 0.5s ease' }}/>
                </div>
                {item.persen >= 80 && (
                  <p style={{ color:RED, fontSize:'12px', marginTop:'4px', fontWeight:'500' }}>⚠️ Mendekati batas!</p>
                )}
              </div>
            ))}

            {/* Summary 3 kotak */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px', marginTop:'8px' }}>
              <div style={{ backgroundColor:'#F0FDF4', borderRadius:'12px', padding:'16px', borderLeft:`4px solid ${GREEN}` }}>
                <p style={{ fontSize:'12px', color:'#9CA3AF', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.3px' }}>Total Pemasukan</p>
                <p style={{ fontSize:'18px', fontWeight:'700', color:GREEN }}>Rp {formatRp(pemasukan)}</p>
              </div>
              <div style={{ backgroundColor:'#FEF2F2', borderRadius:'12px', padding:'16px', borderLeft:`4px solid ${RED}` }}>
                <p style={{ fontSize:'12px', color:'#9CA3AF', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.3px' }}>Total Pengeluaran</p>
                <p style={{ fontSize:'18px', fontWeight:'700', color:RED }}>Rp {formatRp(totalPengeluaran)}</p>
                {persenTotal >= 95 && (
                  <span style={{ display:'inline-block', backgroundColor:GOLD, color:'white', fontSize:'11px', padding:'2px 8px', borderRadius:'20px', marginTop:'4px', fontWeight:'600' }}>
                    {persenTotal}% terpakai
                  </span>
                )}
              </div>
              <div style={{ backgroundColor:'#FFFBEB', borderRadius:'12px', padding:'16px', borderLeft:`4px solid ${GOLD}` }}>
                <p style={{ fontSize:'12px', color:'#9CA3AF', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.3px' }}>Sisa Anggaran</p>
                <p style={{ fontSize:'18px', fontWeight:'700', color: sisaAnggaran < 0 ? RED : GOLD }}>Rp {formatRp(Math.abs(sisaAnggaran))}</p>
                {sisaAnggaran < 0 && (
                  <span style={{ display:'inline-block', backgroundColor:RED, color:'white', fontSize:'11px', padding:'2px 8px', borderRadius:'20px', marginTop:'4px', fontWeight:'600' }}>
                    Over budget!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Simpan Button */}
          {saved ? (
            <div style={{ backgroundColor:'#F0FDF4', border:`1.5px solid ${GREEN}`, borderRadius:'16px', padding:'20px', textAlign:'center' }}>
              <span style={{ fontSize:'24px' }}>✅</span>
              <p style={{ color:GREEN, fontWeight:'700', fontSize:'16px', marginTop:'8px' }}>Budget Planner Berhasil Disimpan!</p>
              <button onClick={() => navigate('/final-analyze')}
                style={{ marginTop:'12px', padding:'12px 32px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                Lihat Final Analyze →
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSaved(true)}
              style={{ width:'100%', height:'56px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'14px', fontSize:'16px', fontWeight:'700', cursor:'pointer', boxShadow:'0 4px 20px rgba(107,15,26,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontFamily:'Poppins,sans-serif' }}>
              ✓ Simpan Budget Planner
            </button>
          )}

        </div>
      </div>
    </>
  )
}