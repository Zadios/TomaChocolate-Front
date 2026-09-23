import { UserRoundPlus, Pencil, Trash2 } from 'lucide-react';
import { type MeetingBalanceResponse } from '../services/api';

interface ParticipantListProps {
  participants: any[];
  balanceData: MeetingBalanceResponse | null;
  onAddParticipant: () => void;
  onEditParticipant: (id: number, name: string) => void;
  onDeleteParticipant: (id: number, name: string) => void;
  onOpenExpensesModal: () => void;
}

export default function ParticipantList({
  participants,
  balanceData,
  onAddParticipant,
  onEditParticipant,
  onDeleteParticipant,
  onOpenExpensesModal,
}: ParticipantListProps) {
  
  const getTotalPaid = (name: string) => {
    const pBalance = balanceData?.participantBalances.find((b) => b.name === name);
    return pBalance ? pBalance.totalPaid : 0;
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-xl font-bold text-chocolate-dark">Participantes</h3>
        <button 
          onClick={onAddParticipant}
          className="cursor-pointer py-2 px-2 flex items-center justify-center gap-2 bg-transparent text-chocolate-gold rounded-xl font-semibold hover:text-chocolate-mid hover:underline active:scale-98 transition-all duration-150"
        >
          <UserRoundPlus size={20} strokeWidth={2.5}/> 
          <span>Añadir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {participants?.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-md rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-chocolate-dark">{p.name}</span>
              <button onClick={() => onEditParticipant(p.id, p.name)} className="text-gray-400 hover:text-chocolate-mid transition-colors cursor-pointer">
                <Pencil size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-green-600">${getTotalPaid(p.name).toLocaleString()}</span>
              <button onClick={() => onDeleteParticipant(p.id, p.name)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={onOpenExpensesModal}
          className="cursor-pointer w-full py-3 bg-transparent border-2 border-chocolate-mid/30 text-chocolate-mid/80 rounded-xl font-semibold text-sm hover:border-chocolate-mid hover:text-chocolate-mid hover:bg-chocolate-mid/5 active:scale-98 transition-all duration-300"
        >
          Ver y modificar gastos
        </button>
      </div>
    </section>
  );
}