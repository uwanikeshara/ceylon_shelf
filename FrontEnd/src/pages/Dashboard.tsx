import { useEffect, useState } from "react";
import CountCards from "../components/CountCards";
import { getBookCountWithCopies } from "../services/bookService";
import { getLendingCount, getOverdueCount } from "../services/lendingService";
import { getAllReaders } from "../services/readerService";
import { useSocket } from "../hooks/useSocket";
import { MdOutlineLibraryBooks, MdOutlineCheckCircle, MdAccessTime, MdCampaign } from "react-icons/md";

function Dashboard() {
  const [bookCount, setBookCount] = useState(0);
  const [readerCount, setReaderCount] = useState(0);
  const [lendingCount, setLendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const [bookRes, readerRes, lendingRes, overdueRes] = await Promise.all([
        getBookCountWithCopies(),
        getAllReaders(),
        getLendingCount(),
        getOverdueCount(),
      ]);
      setBookCount(bookRes.count);
      setReaderCount(readerRes.length);
      setLendingCount(lendingRes.count);
      setOverdueCount(overdueRes.overdueCount);
    } catch {
      
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  useSocket(fetchCounts);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
              <MdOutlineLibraryBooks className="w-4 h-4" />
              <span>National Digital Library & Knowledge Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ceylon<span className="text-amber-400">Shelf</span> Management Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xl leading-relaxed">
              Real-time monitoring of circulation, reader memberships, catalog inventory, and overdue return notices across Colombo, Kandy, Galle & Jaffna branches.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/70 p-3.5 rounded-2xl border border-emerald-500/20 shadow-inner">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Network Node Status</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center justify-end space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Sync (Socket.IO)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CountCards
        bookCount={bookCount}
        readerCount={readerCount}
        lendingCount={lendingCount}
        overdueCount={overdueCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <MdCampaign className="w-5 h-5 text-emerald-400" />
                <span>Circulation Guidelines & Operating Rules</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Standard terms for registered CeylonShelf cardholders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4.5 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MdOutlineCheckCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-200 text-sm">Loan Quota</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maximum 3 books per member for a standard 14-day borrowing term. Renewals permissible once.
              </p>
            </div>

            <div className="bg-slate-950/70 p-4.5 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <MdAccessTime className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-200 text-sm">Overdue Fine Terms</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Overdue fines calculated at LKR 50 per day past due date. Automated email reminders dispatched daily.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl">
          <h2 className="text-lg font-extrabold text-white mb-4 pb-3 border-b border-slate-800">
            System Infrastructure
          </h2>
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Application Stack</span>
              <span className="font-bold text-slate-200">Node.js + React TS</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-bold text-emerald-400">MongoDB Enterprise Cluster</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Real-Time Messaging</span>
              <span className="font-bold text-teal-400">Socket.IO WebSockets</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Coverage Region</span>
              <span className="font-bold text-slate-200">Sri Lanka (Colombo / Kandy / Galle)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;