import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingService } from '../services/api';
import Toast from '../components/Toast';
import { extractErrorMessage } from '../utils/errorHandler';
import { Sparkles, Share2, Calculator, Info, Clock, AlertTriangle } from 'lucide-react';

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
    if (!name.trim()) {
      setToastMessage("Por favor, ingresá un nombre para la juntada");
      return;
    }

    if (count < 2 || count > 30) {
      setToastMessage("La cantidad de participantes debe ser entre 2 y 30");
      return; 
    }

    try {
      const newMeeting = await meetingService.createMeeting({ name, participantCount: count });
      navigate(`/meeting/${newMeeting.id}`);
    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al crear la juntada"));
    }
  };

  return (
    <div className="flex flex-col items-center pt-12 px-4 pb-16 min-h-[80vh]">
      
      {/* --- TARJETA NUEVA JUNTADA */}
      <div className="w-full max-w-md p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white mb-16 border-t-4 border-t-chocolate-gold">
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
      
      {/* --- ONBOARDING PASIVO --- */}
      <div className="w-full max-w-4xl space-y-12 text-gray-600 animate-fade-in">
        
        {/* Cómo funciona */}
        <div>
          <h2 className="text-xl font-semibold text-center text-chocolate-dark mb-8">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-chocolate-mid p-4 rounded-full text-white mb-4 shadow-sm">
                <Sparkles size={26} />
              </div>
              <h3 className="font-bold text-chocolate-dark mb-2">1. Creá y colaborá</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Introducí nombre y cantidad de participantes. Compartí el link de la sala para que tus amigos carguen sus gastos en tiempo real.</p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-chocolate-mid p-4 rounded-full text-white mb-4 shadow-sm">
                <Calculator size={26} />
              </div>
              <h3 className="font-bold text-chocolate-dark mb-2">2. División Inteligente</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Nuestro algoritmo calcula los saldos optimizando las transferencias para que nadie pague de más.</p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-chocolate-mid p-4 rounded-full text-white mb-4 shadow-sm">
                <Share2 size={26} />
              </div>
              <h3 className="font-bold text-chocolate-dark mb-2">3. Compartí el Ticket</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Copiá el resumen de gastos en formato texto o descargá el ticket en PNG para enviarlo fácilmente.</p>
              
            </div>
          </div>
        </div>
        <hr className="my-8 border-t border-gray-300" />

        {/* Recordatorios importantes */}
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-800 mb-5 flex items-center gap-2">
            <Info size={18} /> Tener en cuenta antes de empezar
          </h3>
          <div className="space-y-5">
            <div className="flex gap-4">
              <Clock className="text-chocolate-dark shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-chocolate-dark">Duración de las salas (48hs)</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Para mantener la plataforma ágil y gratuita, todas las juntadas y sus gastos se eliminan automáticamente pasadas las 48 horas de su creación.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <AlertTriangle className="text-chocolate-dark shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-chocolate-dark">Sin registros ni cuentas</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">La única forma de volver a entrar a tu juntada es mediante su enlace. ¡Guardalo o compartilo con tus amigos ni bien lo crees!</p>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 border-t border-gray-300" />
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <p className="italic text-chocolate-dark">TomaChocolate es un proyecto de código abierto. No recopilamos datos personales, emails ni contraseñas ya que no es necesario registrarte para usar esta herramienta. Toda la información de las salas es temporal y se elimina automáticamente.</p>
        </div>
      </div>

      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage("")} 
      />
    </div>
  );
}