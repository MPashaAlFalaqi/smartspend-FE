import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

export default function AdminManageUsers() {
  const navigate = useNavigate()
  
  // 🟢 STATE UTAMA
  const [dataList, setDataList] = useState([]) 
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  
  // State Modal
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalMode, setModalMode] = useState('add') 
  
  // State Form Input
  const [formValues, setFormValues] = useState({ nama: '', username: '', email: '', password: '', status: 'aktif' })

  // Config Axios Header Token
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }

  // 🟢 1. AMBIL DATA DARI BACKEND
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/users?search=${search}`, authHeader)
      
      // Amankan format pembacaan jika backend melempar data berbentuk array murni atau object laravel pagination
      if (Array.isArray(res.data)) {
        setDataList(res.data)
      } else if (res.data && Array.isArray(res.data.data)) {
        setDataList(res.data.data)
      } else {
        setDataList([])
      }
    } catch (err) {
      console.error("Gagal mengambil data database:", err)
      setDataList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const handleWindowFocus = () => {
      fetchData()
    }
    window.addEventListener('focus', handleWindowFocus)
    return () => window.removeEventListener('focus', handleWindowFocus)
  }, [search])

  // 🟢 2. LOGIKA TRIGGER MODAL
  const handleAdd = () => {
    setModalMode('add')
    setFormValues({ nama: '', username: '', email: '', password: '', status: 'aktif' })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setModalMode('edit')
    setSelectedItem(item)
    setFormValues({ 
      nama: item.nama || '', 
      username: item.username || '',
      email: item.email || '', 
      password: '', 
      status: item.status || 'aktif' 
    })
    setShowModal(true)
  }

  const handleDelete = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  // 🟢 3. EKSEKUSI SIMPAN DATA (CREATE & UPDATE)
  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:8000/api/admin/users', formValues, authHeader)
      } else {
        await axios.put(`http://localhost:8000/api/admin/users/${selectedItem.id}`, formValues, authHeader)
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan sistem")
    }
  }

  // 🟢 4. EKSEKUSI HAPUS DATA (DELETE)
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${selectedItem.id}`, authHeader)
      setShowDeleteModal(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus")
    }
  }

  // 🟢 5. EKSEKUSI TOMBOL TOGGLE STATUS
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/users/${id}/toggle`, {}, authHeader)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  // 🟢 6. LOGIKA STYLE WARNA PROFIL RISIKO
  const getRiskBadgeStyles = (riskString) => {
    if (!riskString) return { bg: '#F3F4F6', color: '#6B7280', label: 'Belum Mengisi' };
    
    const r = riskString.toLowerCase().trim();
    
    if (r === 'konservatif' || r === 'conservative') {
      return { bg: '#E8F5E9', color: GREEN, label: 'Konservatif' };
    }
    if (r === 'moderat' || r === 'moderate') {
      return { bg: '#FFF3E0', color: '#D97706', label: 'Moderat' }; 
    }
    if (r === 'agresif' || r === 'aggressive') {
      return { bg: '#FFEBEE', color: RED, label: 'Agresif' };
    }
    
    return { bg: '#F3F4F6', color: '#6B7280', label: riskString };
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:${CREAM}; }
        .nav-link { color:white; text-decoration:none; font-size:14px; padding:6px 12px; border-radius:20px; transition:all 0.2s; cursor:pointer; }
        .nav-link:hover { background:rgba(255,255,255,0.15); }
        tr:hover td { background:#F9F9F9; }
        input:focus { border-color:${MAROON} !important; outline:none; }
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
            <span style={{ backgroundColor:GOLD, color:MAROON, fontWeight:'600', fontSize:'14px', padding:'6px 16px', borderRadius:'20px' }}>Manage Users</span>
            <span onClick={() => navigate('/admin-reports')} className="nav-link">Reports</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', backgroundColor:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:MAROON, fontWeight:'700', fontSize:'13px' }}>AD</span>
            </div>
            <span style={{ color:'white', fontSize:'14px' }}>Admin</span>
          </div>
        </nav>

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px' }}>

          {/* Title */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
            <div style={{ width:'10px', height:'10px', backgroundColor:GOLD, borderRadius:'50%' }}/>
            <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON }}>Laporan & Kelola Pengguna</h1>
          </div>

          {/* Table Card */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>

            {/* Search & Add */}
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:'12px', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1 }}>
                <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'16px' }}>🔍</span>
                <input placeholder="Cari nama atau email user..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width:'100%', height:'44px', padding:'0 16px 0 42px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA', color:'#1A1A1A' }}/>
              </div>
              <button onClick={handleAdd}
                style={{ height:'44px', padding:'0 20px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
                + Tambah Pengguna
              </button>
            </div>

            {/* Table */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ backgroundColor:'#F9F9F9', borderBottom:'1.5px solid #E5E7EB' }}>
                    <th style={{ padding:'16px 20px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', width:'8%' }}>No</th>
                    <th style={{ padding:'16px 20px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', width:'22%' }}>Nama</th>
                    <th style={{ padding:'16px 20px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', width:'25%' }}>Email</th>
                    <th style={{ padding:'16px 20px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', width:'15%' }}>Status</th>
                    <th style={{ padding:'16px 20px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', width:'15%' }}>Profil Risiko</th>
                    <th style={{ padding:'16px 20px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', width:'15%' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={{ textAlign:'center', padding:'32px', color:'#9CA3AF' }}>Sedang mengambil data database...</td></tr>
                  ) : dataList.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign:'center', padding:'32px', color:'#9CA3AF' }}>Tidak ada data ditemukan.</td></tr>
                  ) : dataList.map((item, i) => {
                    
                    // Membaca object data baru risk_profile dari AdminController
                    const currentRisk = item?.risk_profile?.kategori_risiko || 'Belum Mengisi';
                    const badge = getRiskBadgeStyles(currentRisk);
                    
                    return (
                      <tr key={item.id || i} style={{ borderBottom:'1px solid #F3F4F6' }}>
                        <td style={{ padding:'16px 20px', textAlign:'left', fontSize:'14px', color:'#9CA3AF', fontWeight:'600', verticalAlign:'middle' }}>
                          {String(i + 1).padStart(2, '0')}
                        </td>
                        <td style={{ padding:'16px 20px', textAlign:'left', fontSize:'14px', fontWeight:'700', color:'#1A1A1A', verticalAlign:'middle', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {item.nama}
                        </td>
                        <td style={{ padding:'16px 20px', textAlign:'left', fontSize:'13px', color:'#6B7280', verticalAlign:'middle', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {item.email}
                        </td>
                        <td style={{ padding:'16px 20px', textAlign:'left', verticalAlign:'middle' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', backgroundColor: item.status==='aktif' || item.status==='Aktif' ? '#E8F5E9' : '#FFEBEE', color: item.status==='aktif' || item.status==='Aktif' ? GREEN : RED, fontSize:'12px', fontWeight:'600', padding:'6px 14px', borderRadius:'20px', whiteSpace:'nowrap' }}>
                            {item.status==='aktif' || item.status==='Aktif' ? '✓ Aktif' : '✗ Nonaktif'}
                          </span>
                        </td>
                        <td style={{ padding:'16px 20px', textAlign:'left', verticalAlign:'middle' }}>
                          <span style={{ 
                            display:'inline-flex', 
                            alignItems:'center', 
                            justifyContent:'center', 
                            backgroundColor: badge.bg, 
                            color: badge.color, 
                            fontSize:'12px', 
                            fontWeight:'700', 
                            padding:'6px 14px', 
                            borderRadius:'20px', 
                            whiteSpace:'nowrap'
                          }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding:'16px 20px', textAlign:'left', verticalAlign:'middle' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <button onClick={() => handleEdit(item)} title="Edit Pengguna" style={{ width:'34px', height:'34px', backgroundColor:'#FFF3E0', border:'none', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>✏️</button>
                            <button onClick={() => handleToggleStatus(item.id)} title={item.status==='aktif' || item.status==='Aktif' ? "Ban Pengguna" : "Aktifkan Pengguna"} style={{ width:'34px', height:'34px', backgroundColor: item.status==='aktif' || item.status==='Aktif' ? '#FFEBEE' : '#E8F5E9', border:'none', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>
                              {item.status==='aktif' || item.status==='Aktif' ? '🚫' : '✅'}
                            </button>
                            <button onClick={() => handleDelete(item)} title="Hapus Pengguna" style={{ width:'34px', height:'34px', backgroundColor:'#FFEBEE', border:'none', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT */}
      {showModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'36px 40px', width:'100%', maxWidth:'480px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color:MAROON, fontSize:'20px', fontWeight:'700', marginBottom:'24px' }}>
              {modalMode==='add' ? '+ Tambah User' : '✏️ Edit Profil Pengguna'}
            </h2>
            
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>Nama Lengkap</label>
              {/* 🟢 FIXED: Ditambahkan color: '#1A1A1A' agar teks input berwarna gelap */}
              <input type="text" value={formValues.nama} onChange={e => setFormValues({...formValues, nama:e.target.value})} style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA', color:'#1A1A1A' }}/>
            </div>

            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>Username</label>
              {/* 🟢 FIXED: Ditambahkan color: '#1A1A1A' agar teks input berwarna gelap */}
              <input type="text" value={formValues.username} onChange={e => setFormValues({...formValues, username:e.target.value})} style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA', color:'#1A1A1A' }}/>
            </div>

            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>Email</label>
              {/* 🟢 FIXED: Ditambahkan color: '#1A1A1A' agar teks input berwarna gelap */}
              <input type="email" value={formValues.email} onChange={e => setFormValues({...formValues, email:e.target.value})} style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA', color:'#1A1A1A' }}/>
            </div>

            {modalMode === 'add' && (
              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>Password</label>
                {/* 🟢 FIXED: Ditambahkan color: '#1A1A1A' agar teks input berwarna gelap */}
                <input type="password" placeholder="Minimal 8 karakter" value={formValues.password} onChange={e => setFormValues({...formValues, password:e.target.value})} style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA', color:'#1A1A1A' }}/>
              </div>
            )}

            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>Status Akun</label>
              <div style={{ display:'flex', gap:'10px' }}>
                {['aktif','nonaktif'].map(s => (
                  <button key={s} type="button" onClick={() => setFormValues({...formValues, status:s})}
                    style={{ flex:1, height:'42px', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'14px', fontWeight:'600', backgroundColor: formValues.status===s?MAROON:'#F3F4F6', color: formValues.status===s?'white':'#6B7280' }}>
                    {s==='aktif'?'✓ Aktif':'✗ Nonaktif'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:'12px', marginTop:'24px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Batal</button>
              <button onClick={handleSave} style={{ flex:1, height:'48px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                {modalMode==='add'?'Tambahkan':'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {showDeleteModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', textAlign:'center' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🗑️</div>
            <h2 style={{ color:MAROON, fontSize:'20px', fontWeight:'700', marginBottom:'10px' }}>Hapus Data Pengguna?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', marginBottom:'28px' }}>
              Yakin ingin mencabut akses data untuk <strong>{selectedItem?.nama}</strong>? Tindakan ini bersifat permanen.
            </p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Batal</button>
              <button onClick={handleConfirmDelete} style={{ flex:1, height:'48px', backgroundColor:RED, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}