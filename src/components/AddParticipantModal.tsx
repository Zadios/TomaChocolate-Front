import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newName: string;
  setNewName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
}

export default function AddParticipantModal({ isOpen, onClose, newName, setNewName, onSubmit, isEditing }: Props) {
  if (!isOpen) return null; // Si no está abierto, no renderiza nada

  return (
    <div 
    className="fixed inset-0 bg-chocolate-dark/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-in fade-in"
    onClick={onClose}
    >
      <div 
      className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95"
      onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-chocolate-dark">
                {isEditing ? "Editar Participante" : "Nuevo Participante"}
            </h3>
            <button onClick={onClose} className="cursor-pointer text-gray-400 text-2xl hover:text-gray-500"><X size={18} strokeWidth={2.5}/></button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">{isEditing ? "Cambiar nombre" : "Nombre"}</label>
            <input 
              autoFocus required type="text" maxLength={10} placeholder="¿Cómo se llama?" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-chocolate-gold"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-chocolate-gold text-chocolate-dark hover:brightness-110 active:scale-95 py-4 rounded-2xl font-semibold text-lg shadow-lg">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}