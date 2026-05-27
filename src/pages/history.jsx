import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function History() {
  const navigate = useNavigate()
  
  // ===== STATE UTAMA =====
  const [transaksiData, setTransaksiData] = useState([])
  const [filterDate, setFilterDate] = useState('2026-05-01') // Menyesuaikan default ke tahun berjalan (2026)
  const [filterMode, setFilterMode] = useState('month') // 'day' atau 'month'
  const [filterTipe, setFilterTipe] = useState('Semua')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  // ===== STATE PICKER CUSTOM =====
  const [showPicker, setShowPicker] = useState(false)
  const [viewMode, setViewMode] = useState('days') // 'days', 'months', 'years'
  const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 4, 1)) // Menyesuaikan ke Mei 2026
  const pickerRef = useRef(null)

  const formatRp = (val) => parseInt(val || 0).toLocaleString('id-ID')

  // Helper Kalender
  const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const hariSingkat = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  // Tutup picker jika klik luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
        setViewMode('days')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // AMBIL DATA DARI API
  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://127.0.0.1:8000/api/transactions', {
        params: {
          tanggal: filterDate,
          mode: filterMode,
          tipe: filterTipe,
          search: search
        },
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) setTransaksiData(response.data.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { fetchTransactions() }, [filterDate, filterTipe, search, filterMode])

  // Logika Kalender
  const year = currentViewDate.getFullYear()
  const month = currentViewDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleDateClick = (day) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setFilterDate(formattedDate)
    setFilterMode('day')
    setShowPicker(false)
  }

  const handleMonthSelect = (mIdx) => {
    setCurrentViewDate(new Date(year, mIdx, 1))
    setViewMode('days')
  }

  const handleYearSelect = (y) => {
    setCurrentViewDate(new Date(y, month, 1))
    setViewMode('months')
  }

  const selectFullMonth = () => {
    const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`
    setFilterDate(formattedMonth)
    setFilterMode('month')
    setShowPicker(false)
  }

  const displayed = showMore ? transaksiData : transaksiData.slice(0, 6)
  const totalPemasukan = transaksiData.filter(t => t.tipe === 'pemasukan').reduce((a, b) => a + b.jumlah, 0)
  const totalPengeluaran = transaksiData.filter(t => t.tipe === 'pengeluaran').reduce((a, b) => a + b.jumlah, 0)
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

        /* Picker Styles */
        .picker-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; }
        .picker-header span { cursor:pointer; font-weight:700; color:${MAROON}; font-size:15px; padding:5px 10px; border-radius:8px; }
        .picker-header span:hover { background:rgba(107,15,26,0.05); }
        .nav-btn { border:none; background:#F3F4F6; width:30px; height:30px; border-radius:50%; cursor:pointer; font-size:18px; }
        
        .calendar-grid { display:grid; grid-template-columns:repeat(7, 1fr); gap:5px; text-align:center; }
        .day-name { font-size:11px; font-weight:600; color:#9CA3AF; padding-bottom:5px; }
        .day-cell { padding:8px 0; font-size:13px; cursor:pointer; border-radius:8px; transition:0.2s; }
        .day-cell:hover { background:rgba(107,15,26,0.1); color:${MAROON}; }
        .day-cell.selected { background:${MAROON} !important; color:white !important; font-weight:600; }
        .day-cell.today { border: 1.5px solid ${GOLD}; }

        .list-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; max-height:250px; overflow-y:auto; padding:5px; }
        .item-cell { padding:12px; text-align:center; font-size:13px; background:#F9FAFB; border-radius:10px; cursor:pointer; }
        .item-cell:hover { background:${GOLD}; color:white; }
        .full-month-btn { width:100%; padding:10px; margin-top:15px; border:none; background:${MAROON}; color:white; border-radius:10px; cursor:pointer; font-weight:600; font-size:12px; }
      `}</style>

      <div style={{ minHeight:'100vh' }}>
        {/* Navbar */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
          </div>
          <div style={{ display:'flex', gap:'4px' }}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/risk-profile" className="nav-link">Risk Profile</Link>
            <Link to="/budget-planner" className="nav-link">Budget Planner</Link>
            <Link to="/final-analyze" className="nav-link">Final Analyze</Link>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>LM</span></div>
            <span style={{ color:'white', fontSize:'14px' }}>Lila Mahasiswa</span>
          </div>
        </nav>

        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px' }}>
          <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON, marginBottom:'24px' }}>Riwayat Transaksi</h1>

          {/* Filter Bar */}
          <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'20px', backgroundColor:'white', padding:'16px', borderRadius:'16px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', flexWrap:'wrap' }}>
            
            {/* Custom Date Picker */}
            <div style={{ position:'relative' }} ref={pickerRef}>
              <div 
                onClick={() => setShowPicker(!showPicker)}
                style={{ height:'44px', padding:'0 16px', border:'1.5px solid #E5E7EB', borderRadius:'12px', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', backgroundColor:'white', minWidth:'220px' }}
              >
                <span style={{ fontSize:'18px' }}>📅</span>
                <span style={{ fontSize:'14px', fontWeight:'600' }}>
                  {filterMode === 'month' ? namaBulan[new Date(filterDate).getMonth()] + ' ' + new Date(filterDate).getFullYear() : new Date(filterDate).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                </span>
              </div>

              {showPicker && (
                <div style={{ position:'absolute', top:'55px', left:0, backgroundColor:'white', borderRadius:'16px', boxShadow:'0 15px 35px rgba(0,0,0,0.15)', width:'320px', padding:'20px', zIndex:200 }}>
                  
                  {/* Header Navigasi */}
                  <div className="picker-header">
                    <button className="nav-btn" onClick={() => setCurrentViewDate(new Date(year, month - 1, 1))}>&lsaquo;</button>
                    <div>
                      <span onClick={() => setViewMode('months')}>{namaBulan[month]}</span>
                      <span onClick={() => setViewMode('years')}>{year}</span>
                    </div>
                    <button className="nav-btn" onClick={() => setCurrentViewDate(new Date(year, month + 1, 1))}>&rsaquo;</button>
                  </div>

                  {/* Mode Hari */}
                  {viewMode === 'days' && (
                    <>
                      <div className="calendar-grid">
                        {hariSingkat.map(h => <div key={h} className="day-name">{h}</div>)}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={'empty-' + i} />)}
                        {daysArray.map(d => {
                          const isSelected = filterMode === 'day' && new Date(filterDate).getDate() === d && new Date(filterDate).getMonth() === month && new Date(filterDate).getFullYear() === year;
                          return <div key={d} onClick={() => handleDateClick(d)} className={`day-cell ${isSelected ? 'selected' : ''}`}>{d}</div>
                        })}
                      </div>
                      <button className="full-month-btn" onClick={selectFullMonth}>Lihat Satu Bulan Penuh</button>
                    </>
                  )}

                  {/* Mode Bulan */}
                  {viewMode === 'months' && (
                    <div className="list-grid">
                      {namaBulan.map((m, i) => (
                        <div key={m} className="item-cell" onClick={() => handleMonthSelect(i)}>{m.substring(0,3)}</div>
                      ))}
                    </div>
                  )}

                  {/* Mode Tahun */}
                  {viewMode === 'years' && (
                    <div className="list-grid">
                      {Array.from({ length: 21 }, (_, i) => 2015 + i).map(y => (
                        <div key={y} className="item-cell" onClick={() => handleYearSelect(y)}>{y}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tipe Filter */}
            <div style={{ display:'flex', backgroundColor:'#F3F4F6', padding:'4px', borderRadius:'12px' }}>
              {['Semua','Pemasukan','Pengeluaran'].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilterTipe(t)}
                  style={{ border:'none', padding:'8px 16px', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', backgroundColor: filterTipe === t ? MAROON : 'transparent', color: filterTipe === t ? 'white' : '#6B7280', transition:'0.2s' }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Pencarian */}
            <div style={{ flex:1, position:'relative' }}>
              <input 
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width:'100%', height:'44px', padding:'0 15px 0 40px', border:'1.5px solid #E5E7EB', borderRadius:'12px', outline:'none' }}
              />
              <span style={{ position:'absolute', left:'15px', top:'12px' }}>🔍</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'20px' }}>
            <div style={{ backgroundColor:'white', padding:'20px', borderRadius:'16px', borderLeft:`5px solid ${GREEN}`, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', fontWeight:'700' }}>TOTAL PEMASUKAN</p>
              <h2 style={{ color:GREEN, fontSize:'22px' }}>Rp {formatRp(totalPemasukan)}</h2>
            </div>
            <div style={{ backgroundColor:'white', padding:'20px', borderRadius:'16px', borderLeft:`5px solid ${RED}`, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', fontWeight:'700' }}>TOTAL PENGELUARAN</p>
              <h2 style={{ color:RED, fontSize:'22px' }}>Rp {formatRp(totalPengeluaran)}</h2>
            </div>
            <div style={{ backgroundColor:'white', padding:'20px', borderRadius:'16px', borderLeft:`5px solid ${GOLD}`, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize:'11px', color:'#9CA3AF', fontWeight:'700' }}>SELISIH / TABUNGAN</p>
              <h2 style={{ color:GOLD, fontSize:'22px' }}>{selisih < 0 ? '-' : ''}Rp {formatRp(Math.abs(selisih))}</h2>
            </div>
          </div>

          {/* List Transaksi */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', overflow:'hidden' }}>
            <div style={{ padding:'12px 20px', backgroundColor:'#F9F9F9', borderBottom:'1px solid #EEE', textAlign:'center', fontSize:'12px', color:'#9CA3AF', fontWeight:'600' }}>
               --- {filterMode === 'month' ? 'Data Transaksi Bulanan' : 'Data Transaksi Harian'} ---
            </div>
            
            {loading ? (
              <div style={{ padding:'50px', textAlign:'center', color:MAROON }}>Memuat data...</div>
            ) : displayed.length > 0 ? displayed.map((t, i) => (
              <div key={t.id || i} className="transaksi-row" style={{ display:'flex', alignItems:'center', padding:'16px 20px', borderBottom: i < displayed.length-1 ? '1px solid #F8F8F8' : 'none' }}>
                <div style={{ width:'45px', height:'45px', backgroundColor: (t.color || '#EEE') + '20', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginRight:'15px' }}>{t.icon || '💰'}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'14px', fontWeight:'600', color:'#1A1A1A' }}>{t.nama}</p>
                  <p style={{ fontSize:'12px', color:'#9CA3AF' }}>{t.tanggal} • {t.kategori}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:'15px', fontWeight:'700', color: t.tipe === 'pemasukan' ? GREEN : RED }}>
                    {t.tipe === 'pemasukan' ? '+' : '-'} Rp {formatRp(t.jumlah)}
                  </p>
                </div>
              </div>
            )) : (
              <div style={{ padding:'50px', textAlign:'center' }}>
                <p style={{ fontSize:'40px' }}>📭</p>
                <p style={{ color:'#9CA3AF', fontWeight:'600' }}>Tidak ada transaksi ditemukan</p>
              </div>
            )}

            {transaksiData.length > 6 && (
              <div style={{ padding:'15px', textAlign:'center', borderTop:'1px solid #F8F8F8' }}>
                <button 
                  onClick={() => setShowMore(!showMore)}
                  style={{ border:'none', background:'none', color:MAROON, fontWeight:'700', cursor:'pointer' }}
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