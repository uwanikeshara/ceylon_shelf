import React from "react";
import type { Lending } from "../../types/Lending";
import { MdWarning, MdSend } from "react-icons/md";

interface OverdueTableProps {
  lendings: Lending[];
  sendingId: string | null;
  onSendMail: (lendingId: string) => void;
}

const OverdueTable: React.FC<OverdueTableProps> = ({ lendings, sendingId, onSendMail }) => {
  const calculateFine = (dueDateStr?: string) => {
    if (!dueDateStr) return 50;
    const due = new Date(dueDateStr).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.ceil((now - due) / (1000 * 60 * 60 * 24)));
    return diffDays * 50;
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-rose-500/15 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Overdue Book</th>
              <th className="px-6 py-4">Borrower Member</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Estimated Fine (LKR)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Dispatch Email Notice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {lendings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-emerald-400 font-bold">
                  All books have been returned on time. Zero overdue loans!
                </td>
              </tr>
            ) : (
              lendings.map((lending) => {
                const fine = calculateFine(lending.dueDate);
                return (
                  <tr key={lending._id} className="hover:bg-slate-800/40 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <MdWarning className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-white tracking-tight">{lending.bookTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-semibold">
                      {lending.readerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-rose-400 text-xs font-mono font-bold">
                      {lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-400 text-xs font-mono font-bold">
                      Rs. {fine}.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                        <span>Past Due</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onSendMail(lending._id!)}
                        disabled={sendingId === lending._id}
                        className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition border cursor-pointer ${
                          sendingId === lending._id
                            ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30"
                        }`}
                      >
                        {sendingId === lending._id ? (
                          <span>Sending Notice...</span>
                        ) : (
                          <>
                            <MdSend className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Notify Reader</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueTable;
