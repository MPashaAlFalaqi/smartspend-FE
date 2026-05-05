import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    nama: '', email: '', password: '', konfirmasi: '', setuju: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    if (name === 'password') {
      if (value.length === 0) setPasswordStrength(0)
      else if (value.length < 4) setPasswordStrength(1)
      else if (value.length < 6) setPasswordStrength(2)
      else if (value.length < 8) setPasswordStrength(3)
      else setPasswordStrength(4)
    }
  }

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Sedang', 'Kuat']
  const strengthColor = ['', '#C0392B', '#E67E22', '#F1C40F', '#2D6A4F']

  const handleRegister = (e) => {
    e.preventDefault()
    if (!formData.nama || !formData.email || !formData.password || !formData.konfirmasi) {
      setError('Semua field wajib diisi!'); return
    }
    if (formData.password !== formData.konfirmasi) {
      setError('Password dan konfirmasi tidak cocok!'); return
    }
    if (!formData.setuju) {
      setError('Kamu harus menyetujui Syarat & Ketentuan!'); return
    }
    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      {/* Import Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus { border-color: #6B0F1A !important; background-color: #fff !important; }
        button:hover { opacity: 0.9; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        fontFamily: "'Poppins', sans-serif",
      }}>

        {/* ===== KIRI — Branding ===== */}
        <div style={{
          width: '42%',
          backgroundColor: '#6B0F1A',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)',
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color: '#C9A84C', fontWeight: '700', fontSize: '20px', letterSpacing: '0.5px' }}>
              SmartSpend
            </span>
          </div>

          {/* Konten Tengah */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
            
            {/* Icon Besar */}
            <div style={{
              width: '120px', height: '120px',
              backgroundColor: 'rgba(201,168,76,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '32px',
              border: '2px solid rgba(201,168,76,0.3)',
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#C9A84C">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>

            <h2 style={{
              color: '#FFFFFF', fontSize: '26px', fontWeight: '700',
              margin: '0 0 16px 0', lineHeight: '1.3', letterSpacing: '-0.3px'
            }}>
              Mulai Kelola<br/>Keuanganmu
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '14px',
              lineHeight: '1.7', margin: '0 0 40px 0', fontWeight: '300'
            }}>
              Daftar sekarang dan kendalikan keuangan dengan lebih cerdas bersama SmartSpend.
            </p>

            {/* Feature List */}
            {[
              '📊 Analisis profil risiko finansial',
              '💰 Budget planner bulanan',
              '🔔 Spending alert otomatis',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                marginBottom: '12px', width: '100%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: '10px 16px', borderRadius: '10px',
              }}>
                <span style={{ fontSize: '16px' }}>{item.split(' ')[0]}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '400' }}>
                  {item.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== KANAN — Form ===== */}
        <div style={{
          width: '58%',
          backgroundColor: '#F5F0E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          overflowY: 'auto',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '44px 40px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 32px rgba(107,15,26,0.08)',
          }}>

            {/* Header Form */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{
                color: '#6B0F1A', fontSize: '24px',
                fontWeight: '700', margin: '0 0 6px 0', letterSpacing: '-0.3px'
              }}>
                Buat Akun Baru 👋
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0, fontWeight: '400' }}>
                Isi data diri kamu untuk memulai perjalanan finansialmu
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                borderLeft: '4px solid #C0392B', borderRadius: '10px',
                padding: '12px 16px', marginBottom: '20px',
                color: '#C0392B', fontSize: '13px', fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleRegister}>

              {/* Nama */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  NAMA LENGKAP
                </label>
                <input type="text" name="nama" placeholder="Masukkan nama lengkap"
                  value={formData.nama} onChange={handleChange} style={inputStyle} />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  ALAMAT EMAIL
                </label>
                <input type="email" name="email" placeholder="contoh@email.com"
                  value={formData.email} onChange={handleChange} style={inputStyle} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange}
                    style={{ ...inputStyle, padding: '0 48px 0 16px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9CA3AF' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Strength Bar */}
                {formData.password.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      {[1,2,3,4].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: '5px', borderRadius: '10px',
                          backgroundColor: i <= passwordStrength ? strengthColor[passwordStrength] : '#E5E7EB',
                          transition: 'all 0.3s ease'
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: strengthColor[passwordStrength], fontWeight: '500' }}>
                      Kekuatan password: {strengthLabel[passwordStrength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151', letterSpacing: '0.3px' }}>
                  KONFIRMASI PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} name="konfirmasi"
                    placeholder="Ulangi password kamu" value={formData.konfirmasi} onChange={handleChange}
                    style={{ ...inputStyle, padding: '0 48px 0 16px' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9CA3AF' }}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', padding: '14px', backgroundColor: '#FFF8F0', borderRadius: '10px', border: '1px solid #FDE8CC' }}>
                <input type="checkbox" name="setuju" checked={formData.setuju} onChange={handleChange}
                  style={{ marginTop: '2px', accentColor: '#6B0F1A', width: '16px', height: '16px', cursor: 'pointer' }} />
                <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', fontWeight: '400' }}>
                  Saya menyetujui{' '}
                  <a href="#" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '600' }}>
                    Syarat & Ketentuan
                  </a>
                  {' '}serta{' '}
                  <a href="#" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '600' }}>
                    Kebijakan Privasi
                  </a>
                  {' '}SmartSpend
                </span>
              </div>

              {/* Tombol Daftar */}
              <button type="submit" style={{
                width: '100%', height: '52px',
                backgroundColor: '#6B0F1A', color: '#FFFFFF',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', marginBottom: '20px',
                letterSpacing: '0.3px', fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 15px rgba(107,15,26,0.3)',
              }}>
                Daftar Sekarang →
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>atau daftar dengan</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Google Button */}
              <button type="button" style={{
                width: '100%', height: '48px',
                backgroundColor: '#FFFFFF', border: '1.5px solid #E5E7EB',
                borderRadius: '12px', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Daftar dengan Google
              </button>

            </form>

            {/* Link Login */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#9CA3AF', marginTop: '24px', marginBottom: 0 }}>
              Sudah punya akun?{' '}
              <Link to="/" style={{ color: '#6B0F1A', fontWeight: '600', textDecoration: 'none' }}>
                Masuk Sekarang
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  )
}