import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  expenseData: {
    description: string;
    amount: string;
    payerId: string;
  };
  setExpenseData: (data: any) => void;
  participants: any[];
  isEditing: boolean;
}

export default function ExpenseFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  expenseData, 
  setExpenseData, 
  participants,
  isEditing 
}: Props) {
  
  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 bg-chocolate-dark/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
    onClick={onClose}
    >
      <div 
      className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 duration-300"
      onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-chocolate-dark">
            {isEditing ? "Editar Gasto" : "Crear Gasto"}
          </h3>
          <button onClick={onClose} className="cursor-pointer text-gray-400 text-2xl hover:text-gray-500"><X size={18} strokeWidth={2.5}/></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Selector de Quién Pagó */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">¿Quién pagó?</label>
            <select 
              required 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold"
              value={expenseData.payerId} 
              onChange={(e) => setExpenseData({...expenseData, payerId: e.target.value})}
            >
              <option value="">Seleccioná un amigo...</option>
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
              maxLength={20}
              placeholder="Ej: Carbón y carne" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold"
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
              placeholder="0.00" 
              max={9999999}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold font-mono text-lg"
              value={expenseData.amount} 
              onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-chocolate-gold text-chocolate-dark py-4 rounded-2xl font-semibold text-lg shadow-lg hover:brightness-105 active:scale-95 transition-all mt-4"
          >
            {isEditing ? "Guardar Cambios" : "Confirmar Gasto"}
          </button>
        </form>
      </div>
    </div>
  );
}