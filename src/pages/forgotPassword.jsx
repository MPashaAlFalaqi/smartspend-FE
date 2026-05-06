import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email wajib diisi!");
      return;
    }

    // nanti ini connect ke backend
    console.log("Kirim reset ke:", email);

    alert("Link reset password berhasil dikirim!");
  };

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>SmartSpend</h2>
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* ICON */}
        <div style={styles.icon}>🔒</div>

        {/* TITLE */}
        <h2 style={styles.title}>Lupa Password?</h2>
        <p style={styles.desc}>
          Masukkan email kamu dan kami akan mengirimkan link untuk mereset password.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Alamat Email</label>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Kirim Link Reset
          </button>
        </form>

        {/* BACK */}
        <p style={styles.back} onClick={() => navigate("/login")}>
          ← Kembali ke Login
        </p>
      </div>
    </div>
    </div>
  );
}

const styles = {
  navbar: {
  width: "100%",
  backgroundColor: "#7a0c0c",
  padding: "15px 30px",
  position: "fixed",
  top: 0,
  left: 0,
},

logo: {
  color: "#ecb009",
  margin: 0,
  fontWeight: "bold",
  position:"relative",
  left:"-500px",
},
  container: {
    height: "100vh",
    backgroundColor: "#fcfaf7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
     paddingTop: "80px",
  },

  card: {
    width: "350px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  icon: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  title: {
    color: "#7a0c0c",
    marginBottom: "10px",
  },

  desc: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#7a0c0c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  back: {
    marginTop: "15px",
    color: "#f5d51e",
    cursor: "pointer",
    fontSize: "14px",
  },
};
