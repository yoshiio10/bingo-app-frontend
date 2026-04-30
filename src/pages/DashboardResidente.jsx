import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DashboardResidente() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [form, setForm] = useState({ descripcion: '', tipo_residuo: '', lat: 22.2734, lng: -97.8428 });
  const [formPunto, setFormPunto] = useState({ nombre: '', direccion: '', tipos_residuos: '', horario_apertura: '', horario_cierre: '' });
  const [mensaje, setMensaje] = useState('');
  const [mensajePunto, setMensajePunto] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await axios.get('https://bingo-app-backend-i8c1.onrender.com/api/solicitudes/mis-solicitudes', {
        headers: { authorization: token }
      });
      setSolicitudes(res.data.solicitudes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleChangePunto = e => setFormPunto({ ...formPunto, [e.target.name]: e.target.value });

  const handleSubmitPunto = async () => {
    try {
      const direccionCompleta = `${formPunto.direccion}, Ciudad Madero, Tamaulipas, Mexico`;
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccionCompleta)}&format=json&limit=1`
      );

      if (geoRes.data.length === 0) {
        setMensajePunto('❌ No se encontró la dirección, intenta ser más específico');
        return;
      }

      const lat = parseFloat(geoRes.data[0].lat);
      const lng = parseFloat(geoRes.data[0].lon);

      await axios.post('https://bingo-app-backend-i8c1.onrender.com/api/puntos', {
        nombre: formPunto.nombre,
        direccion: formPunto.direccion,
        lat,
        lng,
        tipos_residuos: formPunto.tipos_residuos,
        horario_apertura: formPunto.horario_apertura,
        horario_cierre: formPunto.horario_cierre
      }, {
        headers: { authorization: token }
      });

      setMensajePunto('✅ Punto agregado al mapa correctamente');
      setFormPunto({ nombre: '', direccion: '', tipos_residuos: '', horario_apertura: '', horario_cierre: '' });
    } catch (err) {
      setMensajePunto('❌ Error al agregar punto');
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://bingo-app-backend-i8c1.onrender.com/api/solicitudes', form, {
        headers: { authorization: token }
      });
      setMensaje('✅ Solicitud enviada correctamente');
      setForm({ descripcion: '', tipo_residuo: '', lat: 22.2734, lng: -97.8428 });
      cargarSolicitudes();
    } catch (err) {
      setMensaje('❌ Error al enviar solicitud');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  const colorEstado = estado => {
    const colores = { pendiente: '#f4a261', aceptada: '#457b9d', en_camino: '#2d6a4f', completada: '#52b788', cancelada: '#e63946' };
    return colores[estado] || '#999';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>♻️ BingoApp</h1>
        <div style={styles.headerDerecha}>
          <span style={styles.bienvenida}>Hola, {usuario?.nombre}</span>
          <button style={styles.botonSalir} onClick={cerrarSesion}>Salir</button>
        </div>
      </div>

      <div style={styles.contenido}>
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Nueva solicitud de recolección</h2>
          <input style={styles.input} name="descripcion" placeholder="¿Qué necesitas que recojan?" value={form.descripcion} onChange={handleChange} />
          <select style={styles.input} name="tipo_residuo" value={form.tipo_residuo} onChange={handleChange}>
            <option value="">Tipo de residuo</option>
            <option value="electrodomestico">Electrodoméstico</option>
            <option value="mueble">Mueble</option>
            <option value="escombro">Escombro</option>
            <option value="electronico">Electrónico</option>
            <option value="otro">Otro</option>
          </select>
          {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
          <button style={styles.boton} onClick={handleSubmit}>Solicitar recolección</button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Nuevo punto de recolección</h2>
          <input style={styles.input} name="nombre" placeholder="Nombre del punto" value={formPunto.nombre} onChange={handleChangePunto} />
          <input style={styles.input} name="direccion" placeholder="Dirección (calle y colonia)" value={formPunto.direccion} onChange={handleChangePunto} />
          <input style={styles.input} name="tipos_residuos" placeholder="Tipos de residuos (ej. Plástico, Cartón)" value={formPunto.tipos_residuos} onChange={handleChangePunto} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#555' }}>Horario de apertura</label>
              <input style={styles.input} type="time" name="horario_apertura" value={formPunto.horario_apertura} onChange={handleChangePunto} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#555' }}>Horario de cierre</label>
              <input style={styles.input} type="time" name="horario_cierre" value={formPunto.horario_cierre} onChange={handleChangePunto} />
            </div>
          </div>
          {mensajePunto && <p style={styles.mensaje}>{mensajePunto}</p>}
          <button style={styles.boton} onClick={handleSubmitPunto}>Agregar punto al mapa</button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Mis solicitudes</h2>
          {solicitudes.length === 0 ? (
            <p style={styles.vacio}>No tienes solicitudes aún</p>
          ) : (
            solicitudes.map(s => (
              <div key={s.id} style={styles.solicitud}>
                <div style={styles.solicitudHeader}>
                  <span style={styles.tipo}>{s.tipo_residuo}</span>
                  <span style={{ ...styles.estado, background: colorEstado(s.estado) }}>{s.estado}</span>
                </div>
                <p style={styles.descripcion}>{s.descripcion}</p>
                <p style={styles.direccionText}>📍 {s.direccion}</p>
                <p style={styles.fecha}>🕐 {new Date(s.creado_en).toLocaleDateString()}</p>
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
  header: { background: '#2d6a4f', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { color: 'white', margin: 0 },
  headerDerecha: { display: 'flex', alignItems: 'center', gap: '1rem' },
  bienvenida: { color: 'white' },
  botonSalir: { padding: '0.4rem 1rem', borderRadius: '8px', background: 'white', color: '#2d6a4f', border: 'none', cursor: 'pointer' },
  botonMapa: { padding: '0.4rem 1rem', borderRadius: '8px', background: 'white', color: '#2d6a4f', border: 'none', cursor: 'pointer' },
  contenido: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px', margin: '0 auto' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  cardTitulo: { margin: 0, color: '#2d6a4f' },
  input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  boton: { padding: '0.8rem', borderRadius: '8px', background: '#2d6a4f', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer' },
  mensaje: { textAlign: 'center', margin: 0 },
  vacio: { color: '#999', textAlign: 'center' },
  solicitud: { border: '1px solid #eee', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  solicitudHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tipo: { fontWeight: 'bold', color: '#333', textTransform: 'capitalize' },
  estado: { padding: '0.2rem 0.8rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem' },
  descripcion: { margin: 0, color: '#555' },
  direccionText: { margin: 0, color: '#777', fontSize: '0.9rem' },
  fecha: { margin: 0, color: '#999', fontSize: '0.85rem' }
};