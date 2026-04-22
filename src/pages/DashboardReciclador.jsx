import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DashboardReciclador() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await axios.get('https://bingo-app-backend-i8c1.onrender.com/api/solicitudes/pendientes', {
        headers: { authorization: token }
      });
      setSolicitudes(res.data.solicitudes);
    } catch (err) {
      console.error(err);
    }
  };

  const aceptarSolicitud = async (id) => {
    try {
      await axios.put(`https://bingo-app-backend-i8c1.onrender.com/api/solicitudes/${id}/aceptar`, {}, {
        headers: { authorization: token }
      });
      setMensaje('✅ Solicitud aceptada');
      cargarSolicitudes();
    } catch (err) {
      setMensaje('❌ Error al aceptar solicitud');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>♻️ BingoApp</h1>
        <div style={styles.headerDerecha}>
          <span style={styles.bienvenida}>Hola, {usuario?.nombre}</span>
          <button style={styles.botonSalir} onClick={cerrarSesion}>Salir</button>
          <button style={styles.botonMapa} onClick={() => navigate('/mapa')}>Ver en el mapa</button>
        </div>
      </div>

      <div style={styles.contenido}>
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Solicitudes disponibles</h2>
          {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
          <button style={styles.botonActualizar} onClick={cargarSolicitudes}>🔄 Actualizar</button>
          {solicitudes.length === 0 ? (
            <p style={styles.vacio}>No hay solicitudes pendientes por ahora</p>
          ) : (
            solicitudes.map(s => (
              <div key={s.id} style={styles.solicitud}>
                <div style={styles.solicitudHeader}>
                  <span style={styles.tipo}>{s.tipo_residuo}</span>
                  <span style={styles.badge}>Pendiente</span>
                </div>
                <p style={styles.descripcion}>{s.descripcion}</p>
                <p style={styles.direccionText}>📍 {s.direccion}</p>
                <p style={styles.residente}>👤 {s.nombre_residente} — {s.telefono}</p>
                <p style={styles.fecha}>🕐 {new Date(s.creado_en).toLocaleDateString()}</p>
                <button style={styles.botonAceptar} onClick={() => aceptarSolicitud(s.id)}>
                  ✅ Aceptar solicitud
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  header: { background: '#1d3557', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { color: 'white', margin: 0 },
  headerDerecha: { display: 'flex', alignItems: 'center', gap: '1rem' },
  bienvenida: { color: 'white' },
  botonSalir: { padding: '0.4rem 1rem', borderRadius: '8px', background: 'white', color: '#1d3557', border: 'none', cursor: 'pointer' },
  contenido: { padding: '2rem', maxWidth: '700px', margin: '0 auto' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  cardTitulo: { margin: 0, color: '#1d3557' },
  mensaje: { textAlign: 'center', margin: 0 },
  botonActualizar: { padding: '0.5rem 1rem', borderRadius: '8px', background: '#f0f4f8', border: '1px solid #ddd', cursor: 'pointer', alignSelf: 'flex-start' },
  vacio: { color: '#999', textAlign: 'center' },
  solicitud: { border: '1px solid #eee', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  solicitudHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tipo: { fontWeight: 'bold', color: '#333', textTransform: 'capitalize' },
  badge: { padding: '0.2rem 0.8rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', background: '#f4a261' },
  descripcion: { margin: 0, color: '#555' },
  direccionText: { margin: 0, color: '#777', fontSize: '0.9rem' },
  residente: { margin: 0, color: '#457b9d', fontSize: '0.9rem' },
  fecha: { margin: 0, color: '#999', fontSize: '0.85rem' },
  botonAceptar: { padding: '0.7rem', borderRadius: '8px', background: '#2d6a4f', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }
};