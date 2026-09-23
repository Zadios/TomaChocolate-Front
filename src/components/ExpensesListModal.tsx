import React from 'react';
import { Trash2, Pencil, X } from 'lucide-react';
import type { Participant } from './ExpenseFormModal';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  payerName?: string;
  payer?: { id: number; name: string };
  consumers?: Array<{ id: number; name: string } | number>;
  consumerIds?: number[];
  consumerNames?: string[];
}

interface ExpensesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  participants?: Participant[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpensesListModal({
  isOpen,
  onClose,
  expenses = [],
  participants = [],
  onEdit,
  onDelete,
}: ExpensesListModalProps) {
  if (!isOpen) return null;

  /**
   * Resuelve el nombre de un consumidor según si viene como ID o como Objeto.
   */
  const getParticipantName = (target: any): string => {
    if (!target) return '';
    if (typeof target === 'object' && target.name) return target.name;
    const found = participants.find((p) => p.id === Number(target));
    return found ? found.name : '';
  };

  /**
   * Genera el texto descriptivo del tag según la cantidad de consumidores.
   */
  const getConsumerTagInfo = (exp: Expense) => {
    const consumers = exp.consumers || exp.consumerIds || exp.consumerNames || [];

    // Si no hay lista o abarca a la totalidad de participantes
    const isForEveryone =
      consumers.length === 0 ||
      (participants.length > 0 && consumers.length === participants.length);

    if (isForEveryone) {
      return { tag: 'Para todos', isAll: true };
    }

    if (consumers.length === 1) {
      const name = getParticipantName(consumers[0]) || '1 persona';
      return { tag: `Exclusivo de ${name}`, isAll: false };
    }

    if (consumers.length === 2) {
      const name1 = getParticipantName(consumers[0]);
      const name2 = getParticipantName(consumers[1]);
      const tagText = name1 && name2 ? `Para ${name1} y ${name2}` : 'Para 2 personas';
      return { tag: tagText, isAll: false };
    }

    return { tag: `Para ${consumers.length} personas`, isAll: false };
  };

  return (
    <div
      className="fixed inset-0 bg-chocolate-dark/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-chocolate-dark">Gastos</h3>
            <p className="text-xs text-gray-400">Detalle de compras registradas</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Lista escroleable de gastos */}
        <div className="overflow-y-auto pr-1">
          {expenses.length > 0 ? (
            expenses.map((exp, index) => {
              const { tag, isAll } = getConsumerTagInfo(exp);
              const payerName = exp.payerName || exp.payer?.name || 'Desconocido';

              return (
                <React.Fragment key={exp.id || index}>
                  <div className="py-2.5 px-1 space-y-2">
                    {/* Fila 1: Descripción y Monto */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-chocolate-dark leading-snug break-words text-sm sm:text-base flex-1">
                        {exp.description}
                      </span>
                      <span className="font-bold text-chocolate-dark font-mono text-base sm:text-lg shrink-0 whitespace-nowrap">
                        ${exp.amount?.toLocaleString()}
                      </span>
                    </div>

                    {/* Fila 2: Pagador, Tag y Acciones */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
                        <span className="text-gray-500 truncate">
                          Pagó: <strong className="text-gray-700 font-medium">{payerName}</strong>
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${
                            isAll
                              ? 'bg-gray-100 text-gray-600 border-gray-300'
                              : 'bg-chocolate-gold/20 text-chocolate-dark border-chocolate-gold/30'
                          }`}
                        >
                          {tag}
                        </span>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <button
                          type="button"
                          onClick={() => onEdit(exp)}
                          className="p-1.5 text-gray-400 hover:text-chocolate-dark hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar gasto"
                        >
                          <Pencil size={15} strokeWidth={2.5} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(exp)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar gasto"
                        >
                          <Trash2 size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Separador entre ítems */}
                  {index < expenses.length - 1 && (
                    <div className="mx-4 border-b border-gray-200 my-1" />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <p className="text-center text-gray-400 py-10 text-sm">No hay gastos cargados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}