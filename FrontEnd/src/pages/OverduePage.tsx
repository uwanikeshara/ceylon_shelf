import React, { useEffect, useState } from "react";
import { getOverdueLendings, getOverdueCount, sendOverdueNotification } from "../services/lendingService";
import type { Lending } from "../types/Lending";
import toast from "react-hot-toast";
import OverdueTable from "../components/tables/OverdueTable";
import { MdOutlinePendingActions, MdSync } from "react-icons/md";
import { useSocket } from "../hooks/useSocket";

const OverduePage: React.FC = () => {
  const [overdueLendings, setOverdueLendings] = useState<Lending[]>([]);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [lendings, countRes] = await Promise.all([
        getOverdueLendings(),
        getOverdueCount(),
      ]);
      setOverdueLendings(lendings);
      setOverdueCount(countRes.overdueCount);
    } catch {
      toast.error("Failed to fetch overdue records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useSocket(fetchData);

  const handleSendMail = async (lendingId: string) => {
    setSendingId(lendingId);
    try {
      await sendOverdueNotification(lendingId);
      toast.success("Overdue reminder dispatched to member!");
    } catch {
      toast.error("Failed to dispatch email reminder");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-rose-500/15 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MdOutlinePendingActions className="w-4 h-4" />
            <span>Late Return Monitor</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Overdue Loan Notices</h1>
          <p className="text-xs text-slate-400 mt-1">Send automated return notices to members with past-due items</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-extrabold">
            {overdueCount} Items Currently Overdue
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Refresh Overdue List"
          >
            <MdSync className={`w-5 h-5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Scanning circulation log for overdue loans...
        </div>
      )}

      {!isLoading && (
        <OverdueTable lendings={overdueLendings} sendingId={sendingId} onSendMail={handleSendMail} />
      )}
    </div>
  );
};

export default OverduePage;
