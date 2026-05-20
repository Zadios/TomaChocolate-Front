// components/ConfirmModal.tsx
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Eliminar" }: Props) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-chocolate-dark/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-chocolate-dark mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="cursor-pointer flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="cursor-pointer flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}