import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MAROON = '#6B0F1A'
const GOLD = '#C9A84C'
const CREAM = '#F5F0E8'
const GREEN = '#2D6A4F'
const RED = '#C0392B'

const usersData = [
  { id:1, nama:'Andi Pratama', email:'andi@email.com', status:'aktif', profil:'Moderat', bergabung:'12 Jan 2025' },
  { id:2, nama:'Siti Rahma', email:'siti@email.com', status:'aktif', profil:'Konservatif', bergabung:'15 Jan 2025' },
  { id:3, nama:'Budi Santoso', email:'budi@email.com', status:'nonaktif', profil:'Agresif', bergabung:'20 Jan 2025' },
  { id:4, nama:'Dewi Lestari', email:'dewi@email.com', status:'aktif', profil:'Moderat', bergabung:'22 Feb 2025' },
  { id:5, nama:'Rafi Ahmad', email:'rafi@email.com', status:'aktif', profil:'Konservatif', bergabung:'01 Mar 2025' },
]

export default function AdminManageUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(usersData)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalMode, setModalMode] = useState('add')
  const [formUser, setFormUser] = useState({ nama:'', email:'', status:'aktif', profil:'Moderat' })

  const filtered = users.filter(u =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setModalMode('add')
    setFormUser({ nama:'', email:'', status:'aktif', profil:'Moderat' })
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setModalMode('edit')
    setSelectedUser(user)
    setFormUser({ nama:user.nama, email:user.email, status:user.status, profil:user.profil })
    setShowModal(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleSaveUser = () => {
    if (modalMode === 'add') {
      setUsers([...users, { id:users.length+1, ...formUser, bergabung:'Baru saja' }])
    } else {
      setUsers(users.map(u => u.id===selectedUser.id ? {...u, ...formUser} : u))
    }
    setShowModal(false)
  }

  const handleConfirmDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id))
    setShowDeleteModal(false)
  }

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => u.id===id ? {...u, status: u.status==='aktif'?'nonaktif':'aktif'} : u))
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
            <h1 style={{ fontSize:'26px', fontWeight:'700', color:MAROON }}>Kelola Pengguna</h1>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
            {[
              { label:'Total Pengguna', value:'1,240', icon:'👥', color:MAROON },
              { label:'Aktif Bulan Ini', value:'876', icon:'✅', color:GREEN },
              { label:'Akun Baru Minggu Ini', value:'34', icon:'🆕', color:GOLD },
            ].map((s,i) => (
              <div key={i} style={{ backgroundColor:'white', borderRadius:'14px', padding:'20px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ fontSize:'12px', color:'#9CA3AF', marginBottom:'6px' }}>{s.label}</p>
                  <p style={{ fontSize:'26px', fontWeight:'700', color:s.color }}>{s.value}</p>
                </div>
                <div style={{ width:'48px', height:'48px', backgroundColor:s.color+'15', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div style={{ backgroundColor:'white', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>

            {/* Search & Add */}
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:'12px', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1 }}>
                <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'16px' }}>🔍</span>
                <input placeholder="Cari nama atau email..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width:'100%', height:'44px', padding:'0 16px 0 42px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA' }}/>
              </div>
              <button onClick={handleAdd}
                style={{ height:'44px', padding:'0 20px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap', fontFamily:'Poppins,sans-serif' }}>
                + Tambah Pengguna
              </button>
            </div>

            {/* Table */}
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ backgroundColor:'#F9F9F9' }}>
                  {['No','Nama','Email','Status','Profil Risiko','Bergabung','Aksi'].map(h => (
                    <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u,i) => (
                  <tr key={u.id}>
                    <td style={{ padding:'16px 20px', fontSize:'14px', color:'#9CA3AF', fontWeight:'600' }}>0{i+1}</td>
                    <td style={{ padding:'16px 20px', fontSize:'14px', fontWeight:'600', color:'#1A1A1A' }}>{u.nama}</td>
                    <td style={{ padding:'16px 20px', fontSize:'13px', color:'#6B7280' }}>{u.email}</td>
                    <td style={{ padding:'16px 20px' }}>
                      <span style={{ display:'inline-block', backgroundColor: u.status==='aktif'?'#F0FDF4':'#FEF2F2', color: u.status==='aktif'?GREEN:RED, fontSize:'12px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px' }}>
                        {u.status==='aktif'?'✓ Aktif':'✗ Nonaktif'}
                      </span>
                    </td>
                    <td style={{ padding:'16px 20px', fontSize:'13px', color:'#6B7280' }}>{u.profil}</td>
                    <td style={{ padding:'16px 20px', fontSize:'13px', color:'#9CA3AF' }}>{u.bergabung}</td>
                    <td style={{ padding:'16px 20px' }}>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => handleEdit(u)}
                          style={{ width:'32px', height:'32px', backgroundColor:'#FFF3E0', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px' }}>✏️</button>
                        <button onClick={() => handleToggleStatus(u.id)}
                          style={{ width:'32px', height:'32px', backgroundColor: u.status==='aktif'?'#FEF2F2':'#F0FDF4', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px' }}>
                          {u.status==='aktif'?'🚫':'✅'}
                        </button>
                        <button onClick={() => handleDelete(u)}
                          style={{ width:'32px', height:'32px', backgroundColor:'#FEF2F2', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding:'16px 24px', borderTop:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontSize:'13px', color:'#9CA3AF' }}>Menampilkan 1-{filtered.length} dari 1,240 pengguna</p>
              <div style={{ display:'flex', gap:'6px' }}>
                {['←','1','2','3','...','248','→'].map((p,i) => (
                  <button key={i} style={{ width:'34px', height:'34px', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600', backgroundColor: p==='1'?GOLD:'#F3F4F6', color: p==='1'?'white':'#6B7280', fontFamily:'Poppins,sans-serif' }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT */}
      {showModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'36px 40px', width:'100%', maxWidth:'480px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color:MAROON, fontSize:'20px', fontWeight:'700', marginBottom:'24px' }}>
              {modalMode==='add' ? '+ Tambah Pengguna' : '✏️ Edit Pengguna'}
            </h2>
            {[
              { label:'Nama Lengkap', key:'nama', type:'text', ph:'Masukkan nama' },
              { label:'Email', key:'email', type:'email', ph:'Masukkan email' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={formUser[f.key]}
                  onChange={e => setFormUser({...formUser, [f.key]:e.target.value})}
                  style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', backgroundColor:'#FAFAFA' }}/>
              </div>
            ))}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px', color:'#374151' }}>Status</label>
              <div style={{ display:'flex', gap:'10px' }}>
                {['aktif','nonaktif'].map(s => (
                  <button key={s} type="button" onClick={() => setFormUser({...formUser, status:s})}
                    style={{ flex:1, height:'42px', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'14px', fontWeight:'600', fontFamily:'Poppins,sans-serif', backgroundColor: formUser.status===s?MAROON:'#F3F4F6', color: formUser.status===s?'white':'#6B7280' }}>
                    {s==='aktif'?'✓ Aktif':'✗ Nonaktif'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:'12px', marginTop:'24px' }}>
              <button onClick={() => setShowModal(false)}
                style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Batal</button>
              <button onClick={handleSaveUser}
                style={{ flex:1, height:'48px', backgroundColor:MAROON, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                {modalMode==='add'?'Tambahkan':'Simpan'}
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
            <h2 style={{ color:MAROON, fontSize:'20px', fontWeight:'700', marginBottom:'10px' }}>Hapus Pengguna?</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', marginBottom:'28px' }}>
              Yakin ingin menghapus <strong>{selectedUser?.nama}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ flex:1, height:'48px', backgroundColor:'white', border:`1.5px solid ${MAROON}`, color:MAROON, borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Batal</button>
              <button onClick={handleConfirmDelete}
                style={{ flex:1, height:'48px', backgroundColor:RED, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}