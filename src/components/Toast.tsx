import { useEffect } from 'react';

interface Props {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed bottom-28 inset-x-0 z-[300] px-4 flex justify-center pointer-events-none">
      <div 
        className={`
          pointer-events-auto
          w-full max-w-xs sm:max-w-sm
          bg-chocolate-dark/70 backdrop-blur-sm 
          text-white px-6 py-3 rounded-2xl shadow-xl 
          border border-white/10 text-center 
          animate-toast
        `}
      >
        <span className="font-medium text-sm tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
}