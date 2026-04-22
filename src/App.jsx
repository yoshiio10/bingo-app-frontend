import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import DashboardResidente from './pages/DashboardResidente';
import DashboardReciclador from './pages/DashboardReciclador';
import Mapa from './pages/Mapa';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard-residente" element={<DashboardResidente />} />
        <Route path="/dashboard-reciclador" element={<DashboardReciclador />} />
        <Route path="/mapa" element={<Mapa />} />
      </Routes>
    </BrowserRouter>
  );
}