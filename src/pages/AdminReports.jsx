import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Daftarkan komponen Chart.js agar bisa dipakai di React
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'

export default function AdminReports() {
  const navigate = useNavigate()

  // 🟢 STATE UNTUK MENAMPUNG DATA DARI LARAVEL
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    non_active_users: 0,
    new_users_this_week: 0,
    new_users_this_month: 0,
  })
  const [growthData, setGrowthData] = useState([])
  const [activities, setActivities] = useState([])
  const [riskData, setRiskData] = useState([])
  const [loading, setLoading] = useState(true)

  // Config Header Token Authorization
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }

  // 🟢 AMBIL DATA DARI 3 ENDPOINT BACKEND
  const fetchReportData = async () => {
    setLoading(true)
    try {
      // 1. Ambil Data Statistik Utama & Profil Risiko
      const resStats = await axios.get('http://localhost:8000/api/admin/reports', authHeader)
      setStats(resStats.data)
      setRiskData(resStats.data.risk_distribution || [])

      // 2. Ambil Data Pertumbuhan Bulanan (Grafik Batang)
      const resGrowth = await axios.get('http://localhost:8000/api/admin/user-growth', authHeader)
      setGrowthData(resGrowth.data)

      // 3. Ambil Log Aktivitas Terbaru (Tabel)
      const resActivity = await axios.get('http://localhost:8000/api/admin/recent-activity', authHeader)
      setActivities(resActivity.data)

    } catch (err) {
      console.error("Gagal mengambil data laporan:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [])

  // 📊 KONFIGURASI GRAFIK 1: PERTUMBUHAN PENGGUNA (BAR CHART)
  const barChartData = {
    labels: growthData.map(item => item.bulan),
    datasets: [
      {
        label: 'Jumlah Pengguna Baru',
        data: growthData.map(item => item.total),
        backgroundColor: MAROON,
        borderRadius: 6,
      }
    ]
  }

  // 📊 KONFIGURASI GRAFIK 2: PROFIL RISIKO USER (DONUT CHART)
  const donutChartData = {
    labels: riskData.length > 0 ? riskData.map(item => item.kategori_risiko) : ['Belum Ada Data'],
    datasets: [
      {
        data: riskData.length > 0 ? riskData.map(item => item.total) : [1],
        backgroundColor: ['#C9A84C', '#6B0F1A', '#2D6A4F', '#9CA3AF'], // Gold, Maroon, Green, Gray
        borderWidth: 1,
      }
    ]
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; cursor:pointer; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
      `}</style>

      <div style={{ minHeight:'100vh', backgroundColor:CREAM }}>
        
        {/* NAVBAR */}
        <nav style={{ backgroundColor:MAROON, height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD}>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span style={{ color:GOLD, fontWeight:'700', fontSize:'20px' }}>SmartSpend</span>
            </div>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px' }}>ADMIN</span>
          </div>
          <div style={{ display:'flex', gap:'4px' }}>
            <span onClick={() => navigate('/admin-dashboard')} className="nav-link">Dashboard</span>
            <span onClick={() => navigate('/admin-manage')} className="nav-link">Manage Users</span>
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Reports</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>AD</span>
            </div>
            <span style={{ color:'white', fontSize:'14px' }}>Admin</span>
          </div>
        </nav>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', color:MAROON, fontWeight:'600' }}>
            Menghitung Laporan Database Riil...
          </div>
        ) : (
          <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px' }}>
            
            {/* Title */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
              <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
              <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON }}>Laporan Analitik Sistem</h1>
            </div>

            {/* 📈 INDIKATOR STATISTIK (ANGKA) */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'20px', marginBottom:'32px' }}>
              
              <div style={{ backgroundColor:'white', padding:'24px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize:'13px', color:'#9CA3AF', fontWeight:'500' }}>TOTAL PENGGUNA</span>
                <h3 style={{ fontSize:'28px', color:MAROON, fontWeight:'700', marginTop:'4px' }}>{stats.total_users} <span style={{ fontSize:'14px', color:'#6B7280', fontWeight:'400' }}>Jiwa</span></h3>
              </div>

              <div style={{ backgroundColor:'white', padding:'24px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize:'13px', color:'#2D6A4F', fontWeight:'500' }}>PENGGUNA AKTIF</span>
                <h3 style={{ fontSize:'28px', color:'#2D6A4F', fontWeight:'700', marginTop:'4px' }}>{stats.active_users}</h3>
              </div>

              <div style={{ backgroundColor:'white', padding:'24px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize:'13px', color:'#C0392B', fontWeight:'500' }}>AKUN DIBLOKIR</span>
                <h3 style={{ fontSize:'28px', color:'#C0392B', fontWeight:'700', marginTop:'4px' }}>{stats.non_active_users}</h3>
              </div>

              <div style={{ backgroundColor:'white', padding:'24px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize:'13px', color:GOLD, fontWeight:'500' }}>MINGGU INI</span>
                <h3 style={{ fontSize:'28px', color:GOLD, fontWeight:'700', marginTop:'4px' }}>+{stats.new_users_this_week}</h3>
              </div>

            </div>

            {/* 📊 AREA GRAFIK DUA KOLOM */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px', marginBottom:'32px' }}>
              
              {/* Box Chart Kiri (Pertumbuhan) */}
              <div style={{ backgroundColor:'white', padding:'24px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize:'16px', fontWeight:'600', color:MAROON, marginBottom:'20px' }}>Tren Pertumbuhan Pengguna (6 Bulan Terakhir)</h3>
                <div style={{ height:'260px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Box Chart Kanan (Profil Risiko) */}
              <div style={{ backgroundColor:'white', padding:'24px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize:'16px', fontWeight:'600', color:MAROON, marginBottom:'20px' }}>Distribusi Profil Risiko</h3>
                <div style={{ height:'220px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Doughnut data={donutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

            </div>

            {/* 📑 LOG AKTIVITAS TERBARU */}
            <div style={{ backgroundColor:'white', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)', padding:'24px' }}>
              <h3 style={{ fontSize:'16px', fontWeight:'600', color:MAROON, marginBottom:'16px' }}>Log Aktivitas Pengguna Terbaru</h3>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid #F3F4F6', textAlign:'left' }}>
                    <th style={{ padding:'12px 16px', color:'#9CA3AF', fontSize:'12px', fontWeight:'600' }}>PENGGUNA</th>
                    <th style={{ padding:'12px 16px', color:'#9CA3AF', fontSize:'12px', fontWeight:'600' }}>AKSI</th>
                    <th style={{ padding:'12px 16px', color:'#9CA3AF', fontSize:'12px', fontWeight:'600' }}>WAKTU</th>
                    <th style={{ padding:'12px 16px', color:'#9CA3AF', fontSize:'12px', fontWeight:'600' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act, index) => (
                    <tr key={index} style={{ borderBottom:'1px solid #FAFAFA' }}>
                      <td style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'32px', height:'32px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', color:MAROON }}>
                          {act.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize:'13px', fontWeight:'600', color:'#1A1A1A' }}>{act.nama}</div>
                          <div style={{ fontSize:'11px', color:'#9CA3AF' }}>{act.email}</div>
                        </div>
                      </td>
                      <td style={{ padding:'14px 16px', fontSize:'13px', color:'#4B5563', fontWeight:'500' }}>{act.aksi}</td>
                      <td style={{ padding:'14px 16px', fontSize:'12px', color:'#9CA3AF' }}>{act.waktu}</td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{ fontSize:'11px', fontWeight:'600', color: act.status === 'sukses' ? '#2D6A4F' : '#C0392B', backgroundColor: act.status === 'sukses' ? '#F0FDF4' : '#FEF2F2', padding:'3px 10px', borderRadius:'12px' }}>
                          • {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </>
  )
}