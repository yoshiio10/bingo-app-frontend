import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icono de leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const iconoVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const iconoNaranja = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

export default function Mapa() {
  const [puntos, setPuntos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    cargarPuntos();
    cargarSolicitudes();
  }, []);

  const cargarPuntos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/puntos', { headers: { authorization: token } });
      setPuntos(res.data.puntos);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarSolicitudes = async () => {
    try {
      const url = usuario?.rol === 'residente'
        ? 'http://localhost:3000/api/solicitudes/mis-solicitudes'
        : 'http://localhost:3000/api/solicitudes/pendientes';
      const res = await axios.get(url, { headers: { authorization: token } });
      setSolicitudes(res.data.solicitudes);
    } catch (err) {
      console.error(err);
    }
  };

  const volver = () => {
    if (usuario?.rol === 'residente') navigate('/dashboard-residente');
    else navigate('/dashboard-reciclador');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>♻️ BingoApp — Mapa</h1>
        <div style={styles.headerDerecha}>
          <button style={styles.botonVolver} onClick={volver}>← Volver</button>
        </div>
      </div>

      <div style={styles.leyenda}>
        <span style={styles.item}><span style={{...styles.punto, background:'#2d6a4f'}}></span> Puntos de recolección</span>
        <span style={styles.item}><span style={{...styles.punto, background:'#f4a261'}}></span> Solicitudes</span>
      </div>

      <MapContainer center={[22.2734, -97.8428]} zoom={13} style={styles.mapa}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {puntos.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={iconoVerde}>
            <Popup>
              <strong>{p.nombre}</strong><br/>
              {p.direccion}<br/>
              🕐 {p.horario_apertura} - {p.horario_cierre}<br/>
              📦 {p.tipos_residuos}
            </Popup>
          </Marker>
        ))}
        {solicitudes.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={iconoNaranja}>
            <Popup>
              <strong>{s.tipo_residuo}</strong><br/>
              {s.descripcion}<br/>
              📍 {s.direccion}<br/>
              Estado: {s.estado}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh' },
  header: { background: '#2d6a4f', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { color: 'white', margin: 0, fontSize: '1.2rem' },
  headerDerecha: { display: 'flex', gap: '1rem' },
  botonVolver: { padding: '0.4rem 1rem', borderRadius: '8px', background: 'white', color: '#2d6a4f', border: 'none', cursor: 'pointer' },
  leyenda: { background: 'white', padding: '0.5rem 2rem', display: 'flex', gap: '2rem', borderBottom: '1px solid #eee' },
  item: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' },
  punto: { width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block' },
  mapa: { flex: 1 }
};