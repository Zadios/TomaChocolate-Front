import { X, Users, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  expenseData: {
    description: string;
    amount: string;
    payerId: string;
    consumerIds: number[];
  };
  setExpenseData: (data: any) => void;
  participants: any[];
  isEditing: boolean;
  isSubmitting: boolean;
}

export default function ExpenseFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  expenseData, 
  setExpenseData, 
  participants,
  isEditing,
  isSubmitting
}: Props) {
  
  if (!isOpen) return null;

  const isSpecificConsumers = expenseData.consumerIds.length > 0;

  const handleToggleConsumerMode = (specific: boolean) => {
    if (!specific) {
      // "TODOS"
      setExpenseData({ ...expenseData, consumerIds: [] });
    } else {
      // "ESPECÍFICO"
      const defaultConsumer = expenseData.payerId ? [Number(expenseData.payerId)] : [];
      setExpenseData({ ...expenseData, consumerIds: defaultConsumer });
    }
  };

  const handleToggleParticipant = (participantId: number) => {
    const current = expenseData.consumerIds;
    const exists = current.includes(participantId);

    let updated: number[];
    if (exists) {
      updated = current.filter(id => id !== participantId);
    } else {
      updated = [...current, participantId];
    }

    setExpenseData({ ...expenseData, consumerIds: updated });
  };

  return (
    <div 
      className="fixed inset-0 bg-chocolate-dark/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-chocolate-dark">
            {isEditing ? "Editar Gasto" : "Crear Gasto"}
          </h3>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="cursor-pointer text-gray-400 text-2xl hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} strokeWidth={2.5}/>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Selector de Quién Pagó */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">¿Quién pagó?</label>
            <select 
              required 
              disabled={isSubmitting}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold disabled:opacity-60"
              value={expenseData.payerId} 
              onChange={(e) => setExpenseData({...expenseData, payerId: e.target.value})}
            >
              <option value="">Seleccioná un participante...</option>
              {participants?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Input Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">¿Qué compró?</label>
            <input 
              required 
              type="text" 
              maxLength={30}
              disabled={isSubmitting}
              placeholder="Ej: Carne, Carbón, Bebidas" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold disabled:opacity-60"
              value={expenseData.description} 
              onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
            />
          </div>

          {/* Input Monto */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">¿Cuánto gastó?</label>
            <input 
              required 
              type="number" 
              disabled={isSubmitting}
              placeholder="0.00" 
              max={9999999}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold font-mono text-lg disabled:opacity-60"
              value={expenseData.amount} 
              onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
            />
          </div>

          {/* Selector de para quiénes es el gasto */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 ml-1">
              ¿Para quién/es es este gasto?
            </label>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleToggleConsumerMode(false)}
                className={`p-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  !isSpecificConsumers 
                    ? 'bg-chocolate-gold/10 border-chocolate-gold text-chocolate-dark font-semibold' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Users size={16} />
                Todos
              </button>
              
              <button
                type="button"
                onClick={() => handleToggleConsumerMode(true)}
                className={`p-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  isSpecificConsumers 
                    ? 'bg-chocolate-gold/10 border-chocolate-gold text-chocolate-dark font-semibold' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <User size={16} />
                Específico / Individual
              </button>
            </div>

            {/* Sub-lista de personas si seleccionó Específico */}
            {isSpecificConsumers && (
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  Seleccioná las personas que consumieron este gasto:
                </p>
                <div className="flex flex-wrap gap-2">
                  {participants?.map((p: any) => {
                    const isSelected = expenseData.consumerIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleToggleParticipant(p.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-chocolate-gold text-chocolate-dark shadow-sm'
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || (isSpecificConsumers && expenseData.consumerIds.length === 0)}
            className={`w-full text-chocolate-dark py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all mt-4
              ${isSubmitting || (isSpecificConsumers && expenseData.consumerIds.length === 0)
                ? "bg-gray-400 cursor-not-allowed opacity-70" 
                : "bg-chocolate-gold hover:brightness-105 active:scale-95"
              }`}
          >
            {isSubmitting 
              ? (isEditing ? "Guardando Cambios..." : "Confirmando Gasto...") 
              : (isEditing ? "Guardar Cambios" : "Confirmar Gasto")
            }
          </button>
        </form>
      </div>
    </div>
  );
}