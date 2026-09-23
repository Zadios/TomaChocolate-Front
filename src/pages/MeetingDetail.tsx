import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FilePlusCorner, Copy, Clock } from 'lucide-react';

// Custom Hooks & Services
import { useMeetingDetail } from '../hooks/useMeetingDetail';
import { expenseService, participantService, type ExpenseRequest } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';

// Components
import ParticipantList from '../components/ParticipantList';
import MeetingTicket from '../components/MeetingTicket';
import AddParticipantModal from '../components/AddParticipantModal';
import ExpensesListModal from '../components/ExpensesListModal';
import ExpenseFormModal from '../components/ExpenseFormModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function MeetingDetail() {
  const { id } = useParams();

  // --- ESTADO: UI & MODALES ---
  const [showModal, setShowModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isAnyModalOpen = showModal || showAddParticipantModal || showExpensesModal || showConfirm;
  const isSubmittingRef = useRef<boolean>(false);

  // --- DATA HOOK ---
  const { meeting, balanceData, loading, error, fetchData } = useMeetingDetail(id, isAnyModalOpen);

  // --- ESTADO: FORMULARIOS ---
  const [expenseData, setExpenseData] = useState<{ description: string; amount: string; payerId: string; consumerIds: number[]; }>({ description: '', amount: '', payerId: '', consumerIds: [] });
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({ title: '', message: '', confirmText: 'Eliminar', onConfirm: () => {} });

  const askConfirmation = (title: string, message: string, action: () => void, confirmText = "Eliminar", cancelAction?: () => void) => {
    setConfirmConfig({ title, message, confirmText, onConfirm: action, onCancel: cancelAction });
    setShowConfirm(true);
  };

  // --- PARTICIPANTES ---
  const handleEditName = (pId: number, currentName: string) => {
    setEditingParticipantId(pId);
    setNewParticipantName(currentName);
    setShowAddParticipantModal(true);
  };

  const executeCreateParticipant = async (name: string, includeInAllExpenses: boolean) => {
    if (!id || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await participantService.createParticipant(id, name, includeInAllExpenses);
      setNewParticipantName("");
      setEditingParticipantId(null);
      await fetchData(true);
    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al procesar el participante"));
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmitParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim() || !id || isSubmittingRef.current) return;

    if (editingParticipantId) {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      try {
        await participantService.updateName(editingParticipantId, newParticipantName);
        setShowAddParticipantModal(false);
        setNewParticipantName("");
        setEditingParticipantId(null);
        await fetchData(true);
      } catch (err: any) {
        setToastMessage(extractErrorMessage(err, "Error al procesar el participante"));
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
      return;
    }

    const currentParticipantsCount = meeting?.participants?.length || 0;
    const hasAllExpenses = currentParticipantsCount > 0 && meeting?.expenses?.some((exp: any) => {
      const consumersCount = exp.consumerIds?.length ?? exp.consumers?.length ?? 0;
      return consumersCount === currentParticipantsCount;
    });

    const nameToCreate = newParticipantName.trim();
    setShowAddParticipantModal(false);

    if (hasAllExpenses) {
      askConfirmation(
        "Gastos anteriores detectados",
        `Hay gastos cargados 'Para todos'. ¿Querés incluir a "${nameToCreate}" en esos gastos?`,
        () => {
          setConfirmConfig(prev => ({ ...prev, onCancel: undefined }));
          setShowConfirm(false);
          executeCreateParticipant(nameToCreate, true);
        },
        "Sí, incluir",
        () => executeCreateParticipant(nameToCreate, false)
      );
    } else {
      await executeCreateParticipant(nameToCreate, false);
    }
  };

  const handleDeleteParticipant = (pId: number, pName: string) => {
    askConfirmation(
      "¿Eliminar participante?",
      `¿Seguro que querés eliminar a ${pName}? También se borrarán sus gastos asociados.`,
      async () => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setShowConfirm(false);
        try {
          await participantService.deleteParticipant(pId);
          await fetchData(true);
        } catch (err: any) { 
          setToastMessage(extractErrorMessage(err, "Error al eliminar participante"));
        } finally {
          isSubmittingRef.current = false;
          setIsSubmitting(false);
        }
      },
      "Eliminar"
    );
  };

  // --- GASTOS ---
  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const data: ExpenseRequest = {
        description: expenseData.description,
        amount: Number(expenseData.amount),
        payerId: Number(expenseData.payerId),
        consumerIds: expenseData.consumerIds.length > 0 ? expenseData.consumerIds : undefined
      };

      if (editingExpenseId) {
        await expenseService.updateExpense(editingExpenseId, data);
      } else {
        await expenseService.createExpense(id, data);
      }

      setShowModal(false);
      setEditingExpenseId(null);
      setExpenseData({ description: '', amount: '', payerId: '', consumerIds: [] });
      await fetchData(true);

    } catch (err: any) {
      setToastMessage(extractErrorMessage(err, "Error al procesar el gasto"));
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (expense: any) => {
    setEditingExpenseId(expense.id);
    setExpenseData({
      description: expense.description,
      amount: expense.amount.toString(),
      payerId: expense.payerId ? expense.payerId.toString() : (expense.payer?.id?.toString() || ''),
      consumerIds: expense.consumerIds || expense.consumers?.map((c: any) => c.id) || []
    });
    setShowExpensesModal(false);
    setShowModal(true);
  };

  const handleDeleteExpenseClick = (exp: any) => {
    askConfirmation(
      "¿Borrar gasto?",
      `¿Estás seguro de que querés eliminar "${exp.description}" por $${exp.amount}?`,
      async () => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setShowConfirm(false);
        try {
          await expenseService.deleteExpense(id!, exp.id);
          await fetchData(true);
        } catch {
          setToastMessage("No se pudo borrar");
        } finally {
          isSubmittingRef.current = false;
          setIsSubmitting(false);
        }
      },
      "Eliminar"
    );
  };

  // --- CÁLCULOS SECUNDARIOS ---
  const totalParticipants = meeting?.participants?.length || 0;
  const { sharedExpensesTotal, specificExpensesTotal } = (meeting?.expenses || []).reduce(
    (acc: { sharedExpensesTotal: number; specificExpensesTotal: number }, exp: any) => {
      const consumersCount = exp.consumerIds?.length ?? exp.consumers?.length ?? 0;
      const isForEveryone = consumersCount === 0 || (totalParticipants > 0 && consumersCount === totalParticipants);

      if (isForEveryone) {
        acc.sharedExpensesTotal += Number(exp.amount || 0);
      } else {
        acc.specificExpensesTotal += Number(exp.amount || 0);
      }
      return acc;
    },
    { sharedExpensesTotal: 0, specificExpensesTotal: 0 }
  );

  const hasSpecificExpenses = specificExpensesTotal > 0;

  const getRemainingTime = (createdAt: string) => {
    const utcString = createdAt.endsWith('Z') || createdAt.includes('+') ? createdAt : `${createdAt}Z`;
    const expirationDate = new Date(utcString);
    expirationDate.setHours(expirationDate.getHours() + 48);
    const diff = expirationDate.getTime() - new Date().getTime();

    if (diff <= 0) return "Expirado";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m restante`;
  };

  if (loading) return <div className="p-8 text-center text-chocolate-mid">Cargando...</div>;
  if (error) return (
    <div className="p-8 text-center max-w-md mx-auto mt-10 bg-red-50 rounded-2xl border border-red-100">
      <h2 className="text-2xl font-semibold text-red-700">¡Ups! No encontramos nada. La juntada no existe o ya expiró.</h2>
      <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-2 bg-chocolate-mid text-white rounded-xl cursor-pointer hover:brightness-120 active:scale-95 transition-all">Ir al inicio</button>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">
      
      {/* CABECERA */}
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

      {/* COMPARTIR ENLACE */}
      <section className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 mb-8 text-center border-t-4 border-t-chocolate-gold">
        <p className="font-semibold text-chocolate-dark mb-4">
          ¡Compartí el enlace para que cada uno sume sus gastos!
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

      {/* COMPONENTE: LISTA PARTICIPANTES */}
      <ParticipantList 
        participants={meeting?.participants || []}
        balanceData={balanceData}
        onAddParticipant={() => setShowAddParticipantModal(true)}
        onEditParticipant={handleEditName}
        onDeleteParticipant={handleDeleteParticipant}
        onOpenExpensesModal={() => setShowExpensesModal(true)}
      />

      {/* COMPONENTE: TICKET FINAL */}
      {balanceData && balanceData.totalAmount > 0 && balanceData.transferSuggestions.length > 0 && (
        <MeetingTicket 
          meetingName={meeting?.name}
          balanceData={balanceData}
          sharedExpensesTotal={sharedExpensesTotal}
          specificExpensesTotal={specificExpensesTotal}
          hasSpecificExpenses={hasSpecificExpenses}
          onToast={setToastMessage}
        />
      )}

      {/* BOTON FLOTANTE */}
      <div className="sticky bottom-8 mt-12 flex justify-center px-4 z-[40]">
        <button 
          onClick={() => setShowModal(true)} 
          className="cursor-pointer w-full max-w-xs bg-chocolate-dark text-white py-4 rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white/10"
        >
          <FilePlusCorner size={22} strokeWidth={2}/> 
          <span>Cargar Gasto</span>
        </button>
      </div>

      {/* MODALES & TOAST */}
      <ExpenseFormModal 
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpenseId(null);
          fetchData();
          setExpenseData({ description: '', amount: '', payerId: '', consumerIds: [] });
        }}
        onSubmit={handleSubmitExpense}
        expenseData={expenseData}
        setExpenseData={setExpenseData}
        participants={meeting?.participants || []}
        isEditing={!!editingExpenseId}
        isSubmitting={isSubmitting}
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
        isSubmitting={isSubmitting}
      />

      <ExpensesListModal 
        isOpen={showExpensesModal}
        onClose={() => {
          setShowExpensesModal(false);
          setEditingExpenseId(null);
          fetchData();
          setExpenseData({ description: '', amount: '', payerId: '', consumerIds: [] });
        }}
        expenses={meeting?.expenses || []}
        participants={meeting?.participants || []}
        onEdit={handleEditClick}
        onDelete={handleDeleteExpenseClick}
      />

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          const currentCancel = confirmConfig.onCancel;
          setConfirmConfig({ title: '', message: '', confirmText: 'Eliminar', onConfirm: () => {} });
          if (currentCancel) {
            currentCancel();
          } else {
            fetchData();
          }
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        onConfirm={confirmConfig.onConfirm}
      />

      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage("")} 
      />
    </main>
  );
}