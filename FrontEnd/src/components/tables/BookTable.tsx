import React from 'react';
import { MdEdit, MdDelete, MdMenuBook } from 'react-icons/md';
import type { Book } from '../../types/Book';

interface BooksTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookTable: React.FC<BooksTableProps> = ({ books, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/10 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Title & Details</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Category / Genre</th>
              <th className="px-6 py-4">Published</th>
              <th className="px-6 py-4">Stock Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No books currently cataloged.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-slate-800/40 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <MdMenuBook className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-tight">{book.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: {book._id?.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-semibold">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-300 border border-slate-700/80">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-medium">
                    {typeof book.publishedDate === 'string'
                      ? book.publishedDate.split('T')[0]
                      : new Date(book.publishedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.availableCopies > 0 ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{book.availableCopies} Copies Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>Out of Stock</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition border border-transparent hover:border-emerald-500/30 cursor-pointer"
                        title="Edit Details"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(book)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/30 cursor-pointer"
                        title="Delete Record"
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

export default BookTable;
