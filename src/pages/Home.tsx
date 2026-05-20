import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingService } from '../services/api';
import Toast from '../components/Toast';
import { extractErrorMessage } from '../utils/errorHandler';

/**
 * Vista: Home
 * Renderiza la pantalla inicial para la creación de una nueva juntada.
 */
export default function Home() {
  const [name, setName] = useState('');
  const [count, setCount] = useState(2);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const newMeeting = await meetingService.createMeeting({ name, participantCount: count });
      navigate(`/meeting/${newMeeting.id}`);
    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al crear la juntada"));
    }
  };

  return (
    <div className="flex flex-col items-center pt-12 px-4 min-h-[80vh]">
      <div className="w-full max-w-md p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white">
        <h2 className="text-2xl font-bold text-chocolate-dark mb-6 text-center">Nueva Juntada</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              Nombre de la Juntada
            </label>
            <input 
              type="text" 
              maxLength={32} 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chocolate-gold outline-none transition-all"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ej: Asado de Viernes"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              Participantes iniciales
            </label>
            <input 
              type="number" 
              min="2" 
              max="30" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chocolate-gold outline-none transition-all"
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          
          <button 
            onClick={handleCreate} 
            className="w-full bg-chocolate-gold text-chocolate-dark py-4 rounded-xl font-semibold text-lg hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            Crear Juntada
          </button>
        </div>
      </div>
      
      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage("")} 
      />
    </div>
  );
}