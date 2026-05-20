import { Trash2, Pencil, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expenses: any[];
  onEdit: (expense: any) => void;
  onDelete: (expense: any) => void;
}

export default function ExpensesListModal({ isOpen, onClose, expenses, onEdit, onDelete }: Props) {
  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 bg-chocolate-dark/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in"
    onClick={onClose}
    >
      <div 
      className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 max-h-[80vh] flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-chocolate-dark">Gastos</h3>
          <button onClick={onClose} className="cursor-pointer text-gray-400 text-2xl hover:text-gray-500"><X size={18} strokeWidth={2.5}/></button>
        </div>

        {/* Lista de Gastos */}
        <div className="overflow-y-auto space-y-3 pr-1">
          {expenses?.length > 0 ? (
            expenses.map((exp: any) => (
              <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="font-semibold text-chocolate-dark">{exp.description}</span>
                  <span className="text-xs text-gray-500">Pagó: {exp.payerName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-chocolate-dark">${exp.amount.toLocaleString()}</span>
                  
                  {/* Botón Editar */}
                  <button 
                    onClick={() => onEdit(exp)}
                    className="p-1 text-gray-400 hover:text-chocolate-mid transition-colors cursor-pointer"
                  ><Pencil size={18} strokeWidth={2.5} /></button>

                  {/* Botón Borrar */}
                  <button 
                    onClick={() => onDelete(exp)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  ><Trash2 size={18} strokeWidth={2.5} /></button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10">No hay gastos cargados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}