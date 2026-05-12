import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

const transaksiData = [
  { id:1, nama:'Gaji Bulanan', tanggal:'01 Apr 2025', kategori:'Gaji', tipe:'pemasukan', jumlah:3000000, icon:'💼', color:'#2D6A4F' },
  { id:2, nama:'Tokopedia - Belanja', tanggal:'02 Apr 2025', kategori:'Belanja', tipe:'pengeluaran', jumlah:250000, icon:'🛍️', color:'#F97316' },
  { id:3, nama:'Grab - Transport', tanggal:'03 Apr 2025', kategori:'Transportasi', tipe:'pengeluaran', jumlah:35000, icon:'🚗', color:'#3B82F6' },
  { id:4, nama:'Netflix', tanggal:'04 Apr 2025', kategori:'Hiburan', tipe:'pengeluaran', jumlah:54000, icon:'🎬', color:'#8B5CF6' },
  { id:5, nama:'Makan Siang', tanggal:'05 Apr 2025', kategori:'Makanan', tipe:'pengeluaran', jumlah:45000, icon:'🍽️', color:'#F97316' },
  { id:6, nama:'Bayar Listrik', tanggal:'06 Apr 2025', kategori:'Tagihan', tipe:'pengeluaran', jumlah:300000, icon:'⚡', color:'#EAB308' },
  { id:7, nama:'Transfer Masuk', tanggal:'07 Apr 2025', kategori:'Transfer', tipe:'pemasukan', jumlah:500000, icon:'💸', color:'#2D6A4F' },
  { id:8, nama:'Indomaret', tanggal:'08 Apr 2025', kategori:'Belanja', tipe:'pengeluaran', jumlah:87000, icon:'🏪', color:'#F97316' },
]

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const kategoriList = ['Semua Kategori','Gaji','Belanja','Transportasi','Hiburan','Makanan','Tagihan','Transfer']

export default function History() {
  const navigate = useNavigate()
  const [filterBulan, setFilterBulan] = useState('April 2025')
  const [filterKategori, setFilterKategori] = useState('Semua Kategori')
  const [filterTipe, setFilterTipe] = useState('Semua')
  const [search, setSearch] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [showBulan, setShowBulan] = useState(false)
  const [showKategori, setShowKategori] = useState(false)

  const formatRp = (val) => parseInt(val).toLocaleString('id-ID')

  const filtered = transaksiData.filter(t => {
    const matchKategori = filterKategori === 'Semua Kategori' || t.kategori === filterKategori
    const matchTipe = filterTipe === 'Semua' || t.tipe === filterTipe
    const matchSearch = t.nama.toLowerCase().includes(search.toLowerCase()) || t.kategori.toLowerCase().includes(search.toLowerCase())
    return matchKategori && matchTipe && matchSearch
  })

  const displayed = showMore ? filtered : filtered.slice(0, 6)
  const totalPemasukan = filtered.filter(t => t.tipe==='pemasukan').reduce((a,b) => a+b.jumlah, 0)
  const totalPengeluaran = filtered.filter(t => t.tipe==='pengeluaran').reduce((a,b) => a+b.jumlah, 0)
  const selisih = totalPemasukan - totalPengeluaran

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        .transaksi-row:hover { background:#F9F9F9 !important; }
        .dropdown-opt:hover { background:#F5F0E8; }
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

        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px' }}>

          {/* PAGE TITLE */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
            <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
            <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON }}>Riwayat Transaksi</h1>
          </div>

          {/* FILTER BAR */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'16px 24px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>

            {/* Dropdown Bulan */}
            <div style={{ position:'relative' }}>
              <div
                onClick={() => { setShowBulan(!showBulan); setShowKategori(false) }}
                style={{ display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', cursor:'pointer', backgroundColor:'white', minWidth:'165px' }}
              >
                <span style={{ fontSize:'16px' }}>📅</span>
                <span style={{ fontSize:'14px', fontWeight:'500', color:'#1A1A1A', flex:1 }}>{filterBulan}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
              {showBulan && (
                <div style={{ position:'absolute', top:'50px', left:0, backgroundColor:'white', borderRadius:'12px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', width:'180px', zIndex:200, padding:'8px' }}>
                  {bulanList.map(b => (
                    <div key={b} className="dropdown-opt"
                      onClick={() => { setFilterBulan(`${b} 2025`); setShowBulan(false) }}
                      style={{ padding:'10px 14px', fontSize:'14px', cursor:'pointer', borderRadius:'8px', color: filterBulan.includes(b) ? MAROON : '#1A1A1A', fontWeight: filterBulan.includes(b) ? '600' : '400' }}
                    >
                      {b} 2025
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Kategori */}
            <div style={{ position:'relative' }}>
              <div
                onClick={() => { setShowKategori(!showKategori); setShowBulan(false) }}
                style={{ display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', cursor:'pointer', backgroundColor:'white', minWidth:'190px' }}
              >
                <span style={{ fontSize:'16px' }}>🏷️</span>
                <span style={{ fontSize:'14px', fontWeight:'500', color:'#1A1A1A', flex:1 }}>{filterKategori}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
              {showKategori && (
                <div style={{ position:'absolute', top:'50px', left:0, backgroundColor:'white', borderRadius:'12px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', width:'200px', zIndex:200, padding:'8px' }}>
                  {kategoriList.map(k => (
                    <div key={k} className="dropdown-opt"
                      onClick={() => { setFilterKategori(k); setShowKategori(false) }}
                      style={{ padding:'10px 14px', fontSize:'14px', cursor:'pointer', borderRadius:'8px', color: filterKategori===k ? MAROON : '#1A1A1A', fontWeight: filterKategori===k ? '600' : '400' }}
                    >
                      {k}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle Tipe */}
            <div style={{ backgroundColor:'#F3F4F6', borderRadius:'10px', padding:'4px', display:'flex', gap:'4px' }}>
              {['Semua','Pemasukan','Pengeluaran'].map(t => (
                <button key={t}
                  onClick={() => setFilterTipe(t)}
                  style={{ height:'36px', padding:'0 16px', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight: filterTipe===t ? '600' : '400', backgroundColor: filterTipe===t ? MAROON : 'transparent', color: filterTipe===t ? 'white' : '#6B7280', fontFamily:'Poppins,sans-serif', transition:'all 0.2s', boxShadow: filterTipe===t ? '0 2px 8px rgba(107,15,26,0.3)' : 'none' }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ flex:1, position:'relative', minWidth:'200px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                placeholder="Cari transaksi..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width:'100%', height:'44px', padding:'0 16px 0 40px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', backgroundColor:'#FAFAFA', boxSizing:'border-box' }}
              />
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'20px' }}>
            {[
              { label:'TOTAL PEMASUKAN BULAN INI', value:`Rp ${formatRp(totalPemasukan)}`, color:GREEN, border:GREEN },
              { label:'TOTAL PENGELUARAN BULAN INI', value:`Rp ${formatRp(totalPengeluaran)}`, color:RED, border:RED },
              { label:'SELISIH / TABUNGAN', value:`Rp ${formatRp(Math.abs(selisih))}`, color:GOLD, border:GOLD },
            ].map((item,i) => (
              <div key={i} style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${item.border}` }}>
                <p style={{ fontSize:'11px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px', fontWeight:'600' }}>{item.label}</p>
                <p style={{ fontSize:'22px', fontWeight:'700', color:item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* TRANSAKSI LIST */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>

            {/* Divider tanggal */}
            <div style={{ padding:'12px 24px', backgroundColor:'#F9F9F9', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ flex:1, height:'1px', backgroundColor:'#E5E7EB' }}/>
              <span style={{ fontSize:'13px', color:'#9CA3AF', fontWeight:'500' }}>April 2025</span>
              <div style={{ flex:1, height:'1px', backgroundColor:'#E5E7EB' }}/>
            </div>

            {/* Rows */}
            {displayed.length > 0 ? displayed.map((t, i) => (
              <div key={t.id} className="transaksi-row"
                style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px 24px', borderBottom: i < displayed.length-1 ? '1px solid #F3F4F6' : 'none', transition:'background 0.2s', cursor:'pointer' }}
              >
                {/* Icon */}
                <div style={{ width:'46px', height:'46px', backgroundColor:t.color+'20', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                  {t.icon}
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:'600', fontSize:'14px', color:'#1A1A1A', marginBottom:'3px' }}>{t.nama}</p>
                  <p style={{ fontSize:'12px', color:'#9CA3AF' }}>{t.tanggal} · {t.kategori}</p>
                </div>

                {/* Amount */}
                <p style={{ fontSize:'15px', fontWeight:'700', color: t.tipe==='pemasukan' ? GREEN : RED }}>
                  {t.tipe==='pemasukan' ? '+' : '-'} Rp {formatRp(t.jumlah)}
                </p>
              </div>
            )) : (
              <div style={{ padding:'48px', textAlign:'center' }}>
                <p style={{ fontSize:'32px', marginBottom:'12px' }}>📭</p>
                <p style={{ fontSize:'15px', fontWeight:'600', color:'#9CA3AF' }}>Tidak ada transaksi ditemukan</p>
              </div>
            )}

            {/* Load More */}
            {filtered.length > 6 && (
              <div style={{ padding:'20px', borderTop:'1px solid #F3F4F6', textAlign:'center' }}>
                <button
                  onClick={() => setShowMore(!showMore)}
                  style={{ padding:'12px 40px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', fontFamily:'Poppins,sans-serif' }}
                >
                  {showMore ? 'Tampilkan Lebih Sedikit ↑' : 'Lihat Lebih Banyak ↓'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}