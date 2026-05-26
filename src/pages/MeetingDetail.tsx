import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { Trash2, Pencil, UserRoundPlus, FilePlusCorner, Copy, Clock, Download } from 'lucide-react';

// API Services & Utils
import { expenseService, meetingService, participantService, type MeetingBalanceResponse } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';

// Components
import AddParticipantModal from '../components/AddParticipantModal';
import ExpensesListModal from '../components/ExpensesListModal';
import ExpenseFormModal from '../components/ExpenseFormModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

// Assets
import TomaChocolateLogo from '../assets/TomaChocolateCircle.svg';

/**
 * Vista: MeetingDetail
 * Controlador principal para la gestión de una juntada específica.
 * Maneja el estado de participantes, gastos, saldos y renderiza el ticket final.
 */
export default function MeetingDetail() {
  const { id } = useParams();
  
  // --- STATE: DATA ---
  const [meeting, setMeeting] = useState<any>(null);
  const [balanceData, setBalanceData] = useState<MeetingBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // --- STATE: UI & MODALS ---
  const [showModal, setShowModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });
  const [toastMessage, setToastMessage] = useState("");
  
  // --- STATE: FORMS ---
  const [expenseData, setExpenseData] = useState({ description: '', amount: '', payerId: '' });
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);

  // --- NETWORK LOGIC: FETCHING & POLLING ---
  const lastFetchTime = useRef<number>(0);

  const fetchData = useCallback(async () => {
    const now = Date.now();
    
    // Cooldown check (3 seconds)
    if (now - lastFetchTime.current < 3000) return;

    try {
      if (id) {
        lastFetchTime.current = now; 
        const [m, b] = await Promise.all([
          meetingService.getMeeting(id),
          meetingService.getBalance(id)
        ]);
        
        setMeeting(m);
        setBalanceData(b);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const isAnyModalOpen = showModal || showAddParticipantModal || showExpensesModal || showConfirm;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnyModalOpen) {
        fetchData();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchData, isAnyModalOpen]);


  // --- HANDLERS: PARTICIPANTS ---
  const handleEditName = (pId: number, currentName: string) => {
    setEditingParticipantId(pId);
    setNewParticipantName(currentName);
    setShowAddParticipantModal(true);
  };

  const handleSubmitParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim() || !id) return;

    try {
      if (editingParticipantId) {
        await participantService.updateName(editingParticipantId, newParticipantName);
      } else {
        await participantService.createParticipant(id, newParticipantName);
      }
      
      setShowAddParticipantModal(false);
      setNewParticipantName("");
      setEditingParticipantId(null);
      await fetchData(); 
      
    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al procesar el participante"));
    }
  };

  const handleDeleteParticipant = (pId: number, pName: string) => {
    askConfirmation(
      "¿Eliminar participante?",
      `¿Seguro que querés eliminar a ${pName}? También se borrarán sus gastos asociados.`,
      async () => {
        try {
          await participantService.deleteParticipant(pId);
          fetchData();
        } catch (err: any) { 
          setToastMessage(extractErrorMessage(err, "Error al eliminar participante"));
        }
      }
    );
  };

  // --- HANDLERS: EXPENSES ---
  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const data = {
        description: expenseData.description,
        amount: Number(expenseData.amount),
        payerId: Number(expenseData.payerId)
      };

      if (editingExpenseId) {
        await expenseService.updateExpense(editingExpenseId, data);
        setMeeting((prev: any) => ({
          ...prev,
          expenses: prev.expenses.map((exp: any) => 
            exp.id === editingExpenseId 
              ? { ...exp, ...data, payerName: meeting.participants.find((p:any) => p.id === data.payerId)?.name } 
              : exp
          )
        }));
      } else {
        await expenseService.createExpense(id, data);
      }
    
      setShowModal(false);
      setEditingExpenseId(null);
      setExpenseData({ description: '', amount: '', payerId: '' });
      await fetchData(); 

    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al procesar el gasto"));
    }
  };

  const handleEditClick = (exp: any) => {
    setEditingExpenseId(exp.id);
    setExpenseData({
      description: exp.description,
      amount: exp.amount.toString(),
      payerId: exp.payerId.toString()
    });
    setShowExpensesModal(false);
    setShowModal(true);
  };

  const handleDeleteExpenseClick = (exp: any) => {
    askConfirmation(
      "¿Borrar gasto?",
      `¿Estás seguro de que querés eliminar "${exp.description}" por $${exp.amount}?`,
      async () => {
        try {
          await expenseService.deleteExpense(id!, exp.id);
          await fetchData(); 
        } catch(e) {
          setToastMessage("No se pudo borrar");
        }
      }
    );
  };

  // --- UTILS: CALCULATIONS & EXPORTS ---
  const getTotalPaid = (name: string) => {
    const pBalance = balanceData?.participantBalances.find(b => b.name === name);
    return pBalance ? pBalance.totalPaid : 0;
  };

  const getRemainingTime = (createdAt: string) => {
    const expirationDate = new Date(createdAt);
    expirationDate.setHours(expirationDate.getHours() + 48);
    
    const now = new Date();
    const diff = expirationDate.getTime() - now.getTime();

    if (diff <= 0) return "Expirado";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m restante`;
  };

  const askConfirmation = (title: string, message: string, action: () => void) => {
    setConfirmConfig({ title, message, onConfirm: action });
    setShowConfirm(true);
  };

  const copyTicketToClipboard = () => {
    if (!balanceData) return;
    let text = `${balanceData.meetingName}\n`;
    text += `Generado con: ${window.location.origin}\n\n`;
    text += `💰 Total gastado: $${balanceData.totalAmount.toLocaleString()}\n`;
    text += `👤 Por persona: $${balanceData.averagePerPerson.toLocaleString()}\n\n`;
    text += `📋 Detalle: \n`;
    balanceData.participantBalances.forEach(p => {
      text += `- ${p.name}: $${p.totalPaid.toLocaleString()}\n`;
    });
    text += `\n🤝 ¿Cómo se arregla? \n`;
    balanceData.transferSuggestions.forEach(t => {
      text += `- ${t.fromParticipant} le da $${t.amount.toLocaleString()} a ${t.toParticipant}\n`;
    });
    text += `\n Enlace de esta juntada: ${window.location.href}`;
    
    navigator.clipboard.writeText(text);
    setToastMessage("Ticket copiado");
  };

  const downloadTicketImage = async () => {
    const node = document.getElementById('ticket-visual');
    if (!node) return;

    const originalWidth = node.style.width;
    const originalMaxWidth = node.style.maxWidth;

    try {
      node.style.width = '384px';
      node.style.maxWidth = '384px';

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: '#fdfbf7',
        width: 384,
      });

      const link = document.createElement('a');
      link.download = `TomaChocolate-${meeting?.name || 'ticket'}.png`;
      link.href = dataUrl;
      link.click();
      
      setToastMessage("Imagen del ticket descargada");

    } catch (err) {
      console.error('Error al generar la imagen del ticket:', err);
      setToastMessage("Error al descargar la imagen del ticket");
    } finally {
      node.style.width = originalWidth;
      node.style.maxWidth = originalMaxWidth;
    }
  };


  // --- RENDER ---
  if (loading) return <div className="p-8 text-center text-chocolate-mid">Cargando...</div>;
  if (error) return (
    <div className="p-8 text-center max-w-md mx-auto mt-10 bg-red-50 rounded-2xl border border-red-100">
      <h2 className="text-2xl font-semibold text-red-700">¡Ups! No encontramos nada. La juntada no existe o ya expiró.</h2>
      <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-2 bg-chocolate-mid text-white rounded-xl cursor-pointer hover:brightness-120 active:scale-95 transition-all">Ir al inicio</button>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">
      
      {/* SECTION: Overview */}
      <section className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-chocolate-dark">{meeting?.name}</h2>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <div className="inline-flex items-center px-4 py-1 bg-chocolate-gold/20 text-chocolate-mid rounded-full text-sm border border-chocolate-mid/10 font-semibold shadow-sm">
            {meeting?.participantCount} participantes
          </div>
          {meeting?.createdAt && (
            <div className="inline-flex items-center px-4 py-1 bg-chocolate-gold/20 text-chocolate-mid border border-chocolate-mid/10 rounded-full text-sm font-semibold shadow-sm">
              <Clock className="w-4 h-4 mr-1.5" />
              {getRemainingTime(meeting.createdAt)}
            </div>
          )}
        </div>
      </section>

      {/* SECTION: Share Link */}
      <section className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 mb-8 text-center border-t-4 border-t-chocolate-gold">
        <p className="font-semibold text-chocolate-dark mb-4 flex items-center justify-center gap-2">
          <span>¡Compartí el enlace para que cada uno sume sus gastos!</span>
        </p>
        <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <code className="text-xs text-chocolate-mid font-mono break-all block">
              {window.location.href}
            </code>
          </div>
          <button 
            onClick={() => { 
              navigator.clipboard.writeText(window.location.href); 
              setToastMessage("Enlace copiado"); 
            }}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-chocolate-mid text-white py-3 rounded-xl font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Copy size={18} strokeWidth={2.5} />
            <span>Copiar enlace</span>
          </button>
        </div>
      </section>

      {/* SECTION: Participants List */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-xl font-bold text-chocolate-dark">Participantes</h3>
          <button 
            onClick={() => setShowAddParticipantModal(true)}
            className="cursor-pointer py-2 px-2 flex items-center justify-center gap-2 bg-transparent text-chocolate-gold rounded-xl font-semibold hover:text-chocolate-mid hover:underline active:scale-98 transition-all duration-150"
          >
            <UserRoundPlus size={20} strokeWidth={2.5}/> 
            <span>Añadir</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {meeting?.participants?.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-md rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-chocolate-dark">{p.name}</span>
                <button onClick={() => handleEditName(p.id, p.name)} className="text-gray-400 hover:text-chocolate-mid transition-colors cursor-pointer">
                  <Pencil size={18} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-green-600">${getTotalPaid(p.name).toLocaleString()}</span>
                <button onClick={() => handleDeleteParticipant(p.id, p.name)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <Trash2 size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setShowExpensesModal(true)}
            className="cursor-pointer w-full py-3 bg-transparent border-2 border-chocolate-mid/30 text-chocolate-mid/80 rounded-xl font-semibold text-sm hover:border-chocolate-mid hover:text-chocolate-mid hover:bg-chocolate-mid/5 active:scale-98 transition-all duration-300"
          >
            Ver y modificar gastos
          </button>
        </div>
      </section>

      {/* SECTION: Final Ticket */}
      {balanceData && balanceData.totalAmount > 0 && (
        <section className="mt-12 mb-24 animate-in zoom-in-95 duration-500 max-w-sm mx-auto ">
          <div 
            id="ticket-visual" 
            className="bg-[#fdfbf7] border-2 border-dashed border-gray-200 rounded-lg p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-chocolate-gold"></div>
            
            <div className="flex flex-col items-center mb-6">
              <img src={TomaChocolateLogo} alt="Logo" className="w-12 h-12 object-contain mb-2" />
              <h4 className="font-serif text-2xl text-chocolate-dark font-bold italic">Toma Chocolate</h4>
              <p className="text-[10px] font-bold text-chocolate-mid/50 uppercase tracking-widest mt-1">
                Resumen y Sugerencia de pagos
              </p>
            </div>

            <div className="flex flex-col items-center mb-4">
              <h5 className="font-serif text-chocolate-dark ">{meeting.name}</h5>
            </div>

            <div className="space-y-2 border-b border-dashed border-gray-200 pb-4 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Juntada:</span>
                <span className="font-semibold text-chocolate-dark">${balanceData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gasto por persona:</span>
                <span className="font-semibold text-chocolate-gold">${balanceData.averagePerPerson.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider">
                <span className="text-red-500 w-1/3">Paga</span>
                <span className="text-gray-400 w-1/3 text-center">Monto</span>
                <span className="text-green-600 w-1/3 text-right">Recibe</span>
              </div>

              <div className="space-y-2">
                {balanceData.transferSuggestions.map((t, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm flex items-center">
                    <div className="w-1/3 font-semibold truncate text-chocolate-dark text-xs">
                      {t.fromParticipant} <span className="text-red-500">➔</span>
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                      <span className="text-chocolate-dark font-bold">${t.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-1/3 font-semibold truncate text-right text-chocolate-dark text-xs">
                      <span className="text-green-600">➔</span> {t.toParticipant}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4">
            <button 
              onClick={downloadTicketImage} 
              className="cursor-pointer flex text-sm items-center justify-center gap-2 bg-chocolate-gold text-chocolate-dark py-3 rounded-xl font-semibold hover:brightness-110 active:scale-[0.98] transition-all shadow-sm"
            >
              <Download size={16} strokeWidth={2.5} />
              <span>Descargar ticket (png)</span>
            </button>
            <button 
              onClick={copyTicketToClipboard}
              className="cursor-pointer flex text-sm items-center justify-center gap-2 bg-transparent border-2 border-chocolate-mid/30 text-chocolate-dark py-3 rounded-xl font-semibold hover:border-chocolate-mid hover:text-chocolate-mid hover:bg-chocolate-mid/5 active:scale-98 transition-all duration-300"
            >
              <Copy size={16} strokeWidth={2.5} />
              <span>Copiar ticket (texto)</span>
            </button>
          </div>
        </section>
      )}

      {/* SECTION: Floating Action Button */}
      <div className="sticky bottom-8 mt-12 flex justify-center px-4 z-[40]">
        <button 
          onClick={() => setShowModal(true)} 
          className="cursor-pointer w-full max-w-xs bg-chocolate-dark text-white py-4 rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white/10"
        >
          <FilePlusCorner size={22} strokeWidth={2}/> 
          <span>Cargar Gasto</span>
        </button>
      </div>

      {/* SECTION: Modals */}
      <ExpenseFormModal 
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpenseId(null);
          fetchData();
          setExpenseData({ description: '', amount: '', payerId: '' });
        }}
        onSubmit={handleSubmitExpense}
        expenseData={expenseData}
        setExpenseData={setExpenseData}
        participants={meeting?.participants || []}
        isEditing={!!editingExpenseId}
      />

      <AddParticipantModal 
        isOpen={showAddParticipantModal}
        onClose={() => {
          setShowAddParticipantModal(false);
          setNewParticipantName("");
          fetchData();
          setEditingParticipantId(null);
        }}
        newName={newParticipantName}
        setNewName={setNewParticipantName}
        onSubmit={handleSubmitParticipant}
        isEditing={!!editingParticipantId}
      />

      <ExpensesListModal 
        isOpen={showExpensesModal}
        onClose={() => {
          setShowExpensesModal(false);
          setEditingExpenseId(null);
          fetchData();
          setExpenseData({ description: '', amount: '', payerId: '' });
        }}
        expenses={meeting?.expenses || []}
        onEdit={handleEditClick}
        onDelete={handleDeleteExpenseClick}
      />

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          fetchData();
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
      />

      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage("")} 
      />
    </main>
  );
}