import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', contrasena: '', rol: 'residente', colonia: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://bingo-app-backend-i8c1.onrender.com/api/auth/registro', form);
      navigate('/');
    } catch (err) {
      setError('Error al registrarse, intenta de nuevo');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>E
        <h1 style={styles.titulo}>♻️ BingoApp</h1>
        <h2 style={styles.subtitulo}>Crear cuenta</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="text" name="nombre" placeholder="Nombre completo" onChange={handleChange} />
        <input style={styles.input} type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} />
        <input style={styles.input} type="tel" name="telefono" placeholder="Teléfono" onChange={handleChange} />
        <input style={styles.input} type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
        <input style={styles.input} type="text" name="colonia" placeholder="Colonia" onChange={handleChange} />
        <select style={styles.input} name="rol" onChange={handleChange}>
          <option value="residente">Residente</option>
          <option value="reciclador">Reciclador</option>
        </select>
        <button style={styles.boton} onClick={handleSubmit}>Registrarse</button>
        <p style={styles.link}>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4f8' },
  card: { background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  titulo: { textAlign: 'center', color: '#2d6a4f', margin: 0 },
  subtitulo: { textAlign: 'center', color: '#555', margin: 0, fontWeight: 'normal' },
  input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  boton: { padding: '0.8rem', borderRadius: '8px', background: '#2d6a4f', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', margin: 0 },
  link: { textAlign: 'center', color: '#555' }
};