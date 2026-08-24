import React from "react";
import type { User } from "../../types/User";
import { MdDelete, MdSecurity } from "react-icons/md";

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onDelete }) => (
  <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/10 shadow-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-950/70 border-b border-slate-800/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="px-6 py-4">User Name</th>
            <th className="px-6 py-4">System Email</th>
            <th className="px-6 py-4">Privilege Level</th>
            <th className="px-6 py-4 text-right">Revoke Access</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm">
          {loading ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                Loading staff credentials...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                No user accounts configured.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-800/40 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <MdSecurity className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white tracking-tight">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-semibold">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    user.role === 'admin'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700/80'
                  }`}>
                    {user.role || 'Member'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onDelete(user._id!)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/30 cursor-pointer"
                    title="Revoke Credentials"
                  >
                    <MdDelete className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;
