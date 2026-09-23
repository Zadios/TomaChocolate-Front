import { toPng } from 'html-to-image';
import { Copy, Download } from 'lucide-react';
import { type MeetingBalanceResponse } from '../services/api';
import TomaChocolateLogo from '../assets/TomaChocolateCircle.svg';

interface MeetingTicketProps {
  meetingName: string;
  balanceData: MeetingBalanceResponse;
  sharedExpensesTotal: number;
  specificExpensesTotal: number;
  hasSpecificExpenses: boolean;
  onToast: (msg: string) => void;
}

export default function MeetingTicket({
  meetingName,
  balanceData,
  sharedExpensesTotal,
  specificExpensesTotal,
  hasSpecificExpenses,
  onToast,
}: MeetingTicketProps) {
  
  const copyTicketToClipboard = () => {
    let text = `${balanceData.meetingName}\n`;
    text += `Generado con: ${window.location.origin}\n\n`;
    text += `💰 Total gastado: $${balanceData.totalAmount.toLocaleString()}\n`;
    
    if (hasSpecificExpenses) {
      text += `👥 Gastos para todos: $${sharedExpensesTotal.toLocaleString()}\n`;
      text += `🎯 Gastos específicos: $${specificExpensesTotal.toLocaleString()}\n\n`;
    } else {
      text += `👤 Por persona: $${balanceData.averagePerPerson.toLocaleString()}\n\n`;
    }

    text += `📋 Detalle: \n`;
    balanceData.participantBalances.forEach((p) => {
      text += `- ${p.name}: $${p.totalPaid.toLocaleString()}\n`;
    });
    text += `\n🤝 ¿Cómo se arregla? \n`;
    balanceData.transferSuggestions.forEach((t) => {
      text += `- ${t.fromParticipant} le da $${t.amount.toLocaleString()} a ${t.toParticipant}\n`;
    });
    text += `\n Enlace de esta juntada: ${window.location.href}`;
    
    navigator.clipboard.writeText(text);
    onToast("Ticket copiado");
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
      link.download = `TomaChocolate-${meetingName || 'ticket'}.png`;
      link.href = dataUrl;
      link.click();
      
      onToast("Imagen del ticket descargada");

    } catch (err) {
      console.error('Error al generar la imagen del ticket:', err);
      onToast("Error al descargar la imagen del ticket");
    } finally {
      node.style.width = originalWidth;
      node.style.maxWidth = originalMaxWidth;
    }
  };

  return (
    <section className="mt-12 mb-24 animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
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
          <h5 className="font-serif text-chocolate-dark">{meetingName}</h5>
        </div>

        <div className="space-y-2 border-b border-dashed border-gray-200 pb-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Juntada:</span>
            <span className="font-semibold text-chocolate-dark">${balanceData.totalAmount.toLocaleString()}</span>
          </div>

          {hasSpecificExpenses ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Gastos para todos:</span>
                <span className="font-semibold text-chocolate-dark">${sharedExpensesTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gastos específicos:</span>
                <span className="font-semibold text-chocolate-gold">${specificExpensesTotal.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-500">Gasto por persona:</span>
              <span className="font-semibold text-chocolate-gold">${balanceData.averagePerPerson.toLocaleString()}</span>
            </div>
          )}
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
  );
}