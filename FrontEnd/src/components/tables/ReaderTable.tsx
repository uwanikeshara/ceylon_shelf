import React from 'react';
import { MdEdit, MdDelete, MdPerson } from 'react-icons/md';
import type { Reader } from '../../types/Reader';

interface ReadersTableProps {
  readers: Reader[];
  onEdit: (reader: Reader) => void;
  onDelete: (reader: Reader) => void;
}

const ReaderTable: React.FC<ReadersTableProps> = ({ readers, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/10 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Member Name</th>
              <th className="px-6 py-4">Contact Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Branch Location</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {readers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No member records found.
                </td>
              </tr>
            ) : (
              readers.map((reader) => (
                <tr key={reader._id} className="hover:bg-slate-800/40 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-amber-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs shadow-inner">
                        {reader.name ? reader.name.slice(0, 2).toUpperCase() : <MdPerson />}
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-tight">{reader.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: {reader._id?.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-semibold">
                    {reader.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 text-xs font-mono">
                    {reader.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs max-w-xs truncate">
                    {reader.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-medium">
                    {typeof reader.registerDate === 'string'
                      ? reader.registerDate.split('T')[0]
                      : new Date(reader.registerDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(reader)}
                        className="p-2 text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition border border-transparent hover:border-emerald-500/30 cursor-pointer"
                        title="Edit Profile"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(reader)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/30 cursor-pointer"
                        title="Delete Member"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReaderTable;
