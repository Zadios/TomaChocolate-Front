import { Routes, Route } from 'react-router-dom';

// Componentes de Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Vistas / Páginas
import Home from './pages/Home';
import MeetingDetail from './pages/MeetingDetail';

/**
 * Componente principal y enrutador de la aplicación.
 * Gestiona el layout base (Header/Footer) y la navegación entre páginas.
 */
export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting/:id" element={<MeetingDetail />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}