import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      if (res.data.usuario.rol === 'residente') {
        navigate('/dashboard-residente');
      } else {
        navigate('/dashboard-reciclador');
      }
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>♻️ BingoApp</h1>
        <h2 style={styles.subtitulo}>Iniciar sesión</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} />
        <input style={styles.input} type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
        <button style={styles.boton} onClick={handleSubmit}>Entrar</button>
        <p style={styles.link}>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f4f8' },
  card: { background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  titulo: { textAlign: 'center', color: '#2d6a4f', margin: 0 },
  subtitulo: { textAlign: 'center', color: '#555', margin: 0, fontWeight: 'normal' },
  input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  boton: { padding: '0.8rem', borderRadius: '8px', background: '#2d6a4f', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', margin: 0 },
  link: { textAlign: 'center', color: '#555' }
};