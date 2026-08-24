import React from "react";
import { MdMenuBook, MdGroup, MdBookmarkAdded, MdOutlineReceiptLong } from "react-icons/md";

interface CountCardsProps {
  bookCount: number;
  readerCount: number;
  lendingCount: number;
  overdueCount?: number;
}

const CountCards: React.FC<CountCardsProps> = ({ bookCount, readerCount, lendingCount, overdueCount = 0 }) => {
  const cards = [
    {
      label: "Total Books",
      count: bookCount,
      subtext: "Catalog titles across branches",
      icon: <MdMenuBook className="w-6 h-6 text-emerald-400" />,
      accentColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-md shadow-emerald-500/10",
      badge: "Ceylon Literature",
    },
    {
      label: "Active Members",
      count: readerCount,
      subtext: "Registered cardholders",
      icon: <MdGroup className="w-6 h-6 text-teal-400" />,
      accentColor: "border-teal-500/30 bg-teal-500/10 text-teal-300 shadow-md shadow-teal-500/10",
      badge: "Verified Readers",
    },
    {
      label: "Active Loans",
      count: lendingCount,
      subtext: "Borrowed books on circulation",
      icon: <MdBookmarkAdded className="w-6 h-6 text-cyan-400" />,
      accentColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-md shadow-cyan-500/10",
      badge: "14-Day Terms",
    },
    {
      label: "Overdue Notices",
      count: overdueCount,
      subtext: "Pending returns & fine notices",
      icon: <MdOutlineReceiptLong className="w-6 h-6 text-amber-400" />,
      accentColor: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-md shadow-amber-500/10",
      badge: "Rs. 50/day fine",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl border ${card.accentColor} group-hover:scale-110 transition-transform duration-200`}>
              {card.icon}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80">
              {card.badge}
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-white tracking-tight mb-1 group-hover:text-emerald-300 transition-colors">
              {card.count}
            </div>
            <div className="text-sm font-bold text-slate-200">{card.label}</div>
            <div className="text-xs text-slate-400 mt-1">{card.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountCards;
