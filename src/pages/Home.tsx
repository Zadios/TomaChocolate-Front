import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingService } from '../services/api';
import Toast from '../components/Toast';
import { extractErrorMessage } from '../utils/errorHandler';
import { Sparkles, Share2, Calculator, Info, Clock, AlertTriangle, Users } from 'lucide-react';

/**
 * Vista: Home
 * Renderiza la pantalla inicial para la creación de una nueva juntada.
 */
export default function Home() {
  const [name, setName] = useState('');
  const [count, setCount] = useState<number | ''>(2);
  const [toastMessage, setToastMessage] = useState("");
  const [totalMeetings, setTotalMeetings] = useState<number | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    meetingService.getTotalMeetings()
      .then((data) => setTotalMeetings(data.total))
      .catch(() => setTotalMeetings(null));
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setToastMessage("Por favor, ingresá un nombre para la juntada");
      return;
    }

    const currentCount = Number(count);

    if (currentCount < 2 || currentCount > 30) {
      setToastMessage("La cantidad de participantes debe ser entre 2 y 30");
      return; 
    }

    setIsLoading(true);

    try {
      const newMeeting = await meetingService.createMeeting({ name, participantCount: currentCount });
      navigate(`/meeting/${newMeeting.id}`);
    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al crear la juntada"));
      setIsLoading(false);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setCount('');
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setCount(parsed);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-16 min-h-[80vh]">
      
      {/* --- ENCABEZADO Y TITULO PRINCIPAL --- */}
      <div className="w-full max-w-4xl space-y-12 text-center mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-chocolate-dark tracking-tight leading-tight mb-3">
          Dividí los gastos de tus juntadas <span className="text-chocolate-gold">sin vueltas</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Cargá los pagos, compartí el enlace con tus amigos y calculen quién le debe a quién en segundos.
        </p>

        {/* --- BADGE CONTADOR GLOBAL --- */}
        {totalMeetings !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-chocolate-gold/15 border border-chocolate-gold/30 rounded-full text-chocolate-dark text-xs font-medium shadow-sm">
            <Users size={14} className="text-chocolate-dark" />
            <span>
              <strong className="font-bold font-mono text-sm">{totalMeetings.toLocaleString('es-AR')}</strong> juntadas creadas hasta la fecha
            </span>
          </div>
        )}
      </div>

      {/* --- TARJETA NUEVA JUNTADA --- */}
      <div className="w-full max-w-md p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white mb-16 border-t-4 border-t-chocolate-mid">
        <h2 className="text-2xl font-bold text-chocolate-dark mb-6 text-center">Nueva Juntada</h2>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="meeting-name" className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              Nombre de la Juntada
            </label>
            <input 
              id="meeting-name"
              type="text" 
              autoFocus
              maxLength={32} 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chocolate-gold outline-none transition-all"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ej: Asado de Viernes"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label htmlFor="participant-count" className="block text-xs font-bold text-gray-400 uppercase">
                Participantes iniciales
              </label>
              <span className="text-[10px] text-gray-400 font-normal">Podés modificarlo después</span>
            </div>
            <input 
              id="participant-count"
              type="number" 
              min="2" 
              max="30" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chocolate-gold outline-none transition-all"
              value={count} 
              onChange={handleCountChange}
            />
          </div>
          
          <button 
            onClick={handleCreate} 
            disabled={isLoading}
            className={`w-full text-chocolate-dark py-4 rounded-xl font-semibold text-lg transition-all shadow-md 
              ${isLoading 
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-chocolate-gold hover:brightness-110 active:scale-95"
              }`}
          >
            {isLoading ? "Creando Juntada..." : "Crear Juntada"}
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
              <p className="text-sm text-gray-500 leading-relaxed">
                Introducí nombre y cantidad de participantes. Compartí el link de la sala para que tus amigos carguen sus gastos en tiempo real.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-chocolate-mid p-4 rounded-full text-white mb-4 shadow-sm">
                <Calculator size={26} />
              </div>
              <h3 className="font-bold text-chocolate-dark mb-2">2. División Inteligente</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Nuestro algoritmo calcula los saldos optimizando las transferencias para que nadie pague de más.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-chocolate-mid p-4 rounded-full text-white mb-4 shadow-sm">
                <Share2 size={26} />
              </div>
              <h3 className="font-bold text-chocolate-dark mb-2">3. Compartí el Ticket</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Copiá el resumen de gastos en formato texto o descargá el ticket en PNG para enviarlo fácilmente.
              </p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-t border-gray-300" />

        {/* Recordatorios importantes */}
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-sm font-bold uppercase tracking-wider text-chocolate-dark mb-5 flex items-center gap-2">
            <Info size={18} /> Tener en cuenta antes de empezar
          </h3>
          <div className="space-y-5">
            <div className="flex gap-4">
              <Clock className="text-chocolate-dark shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-chocolate-dark">Duración de las salas (48hs)</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Para mantener la plataforma ágil y gratuita, todas las juntadas y sus gastos se eliminan automáticamente pasadas las 48 horas de su creación.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <AlertTriangle className="text-chocolate-dark shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-chocolate-dark">Sin registros ni cuentas</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  La única forma de volver a entrar a tu juntada es mediante su enlace. ¡Guardalo o compartilo con tus amigos ni bien lo crees!
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-t border-gray-300" />

        {/* Footer / Nota de privacidad */}
        <div className="p-6 md:p-8 max-w-3xl mx-auto text-center">
          <p className="italic md:text-sm text-chocolate-dark leading-relaxed">
            TomaChocolate es un proyecto de código abierto. No recopilamos datos personales, emails ni contraseñas ya que no es necesario registrarte para usar esta herramienta. Toda la información de las salas es temporal y se elimina automáticamente.
          </p>
        </div>
      </div>

      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage("")} 
      />
    </div>
  );
}