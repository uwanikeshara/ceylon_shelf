import React, { useEffect, useState } from "react";
import LendingTable from "../components/tables/LendingTable";
import LendingForm from "../components/forms/LendingForm";
import Dialog from "../components/Dialog";
import {
  getAllLendings,
  addLending,
  completeLending,
  deleteLending,
} from "../services/lendingService";
import { getAllBooks } from "../services/bookService";
import { getAllReaders } from "../services/readerService";
import type { Lending } from "../types/Lending";
import type { Book } from "../types/Book";
import type { Reader } from "../types/Reader";
import { MdAdd, MdBookmarkAdded, MdSearch, MdSync } from "react-icons/md";
import toast from "react-hot-toast";
import { useSocket } from "../hooks/useSocket";

const LendingPage: React.FC = () => {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "complete" | "delete" | null;
    lending: Lending | null;
  }>({ open: false, type: null, lending: null });

  const [returnDateInput, setReturnDateInput] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [lendingsData, booksData, readersData] = await Promise.all([
        getAllLendings(),
        getAllBooks(),
        getAllReaders(),
      ]);
      setLendings(lendingsData);
      setBooks(booksData);
      setReaders(readersData);
    } catch {
      toast.error("Failed to load loan records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useSocket(fetchAll);

  const handleAddLending = () => setIsAddDialogOpen(true);

  const handleFormSubmit = async (data: Partial<Lending>) => {
    try {
      await addLending(data as any);
      fetchAll();
      setIsAddDialogOpen(false);
      toast.success("Book loan issued to member");
    } catch (error: any) {
      const apiMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to create loan record";
      toast.error(apiMsg);
    }
  };

  const handleComplete = (lending: Lending) => {
    setReturnDateInput(new Date().toISOString().split("T")[0]);
    setConfirmDialog({ open: true, type: "complete", lending });
  };

  const handleDelete = (lending: Lending) => {
    setConfirmDialog({ open: true, type: "delete", lending });
  };

  const handleConfirm = async () => {
    if (!confirmDialog.lending) return;
    try {
      if (confirmDialog.type === "complete") {
        await completeLending(confirmDialog.lending._id!, returnDateInput);
        toast.success("Book returned to circulation");
      } else if (confirmDialog.type === "delete") {
        await deleteLending(confirmDialog.lending._id!);
        toast.success("Loan record deleted");
      }
      fetchAll();
    } catch (error: any) {
      const apiMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Action failed";
      toast.error(apiMsg);
    } finally {
      setConfirmDialog({ open: false, type: null, lending: null });
    }
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, type: null, lending: null });
  };

  const filteredLendings = lendings.filter((l) => {
    const bTitle = l.bookTitle?.toLowerCase() || "";
    const rName = l.readerName?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return bTitle.includes(term) || rName.includes(term) || (l.status && l.status.toLowerCase().includes(term));
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-emerald-500/10 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MdBookmarkAdded className="w-4 h-4" />
            <span>Circulation Desk</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Book Circulation & Loans</h1>
          <p className="text-xs text-slate-400 mt-1">Track active loans, due dates, returns, and overdue fines across branches</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAll}
            className="p-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Refresh Loans"
          >
            <MdSync className={`w-5 h-5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
          <button
            onClick={handleAddLending}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4.5 py-2.5 rounded-xl font-extrabold text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <MdAdd className="w-5 h-5" />
            <span>Issue New Loan</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
        <MdSearch className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search loans by book title, member name, or status..."
          className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
        />
      </div>

      {isLoading && (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Loading CeylonShelf loan registers...
        </div>
      )}

      {!isLoading && (
        <LendingTable lendings={filteredLendings} onComplete={handleComplete} onDelete={handleDelete} />
      )}

      <Dialog
        isOpen={isAddDialogOpen}
        onCancel={() => setIsAddDialogOpen(false)}
        onConfirm={() => {
          const form = document.querySelector("form") as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        title="Issue Book Loan to Member"
      >
        <LendingForm
          onSubmit={handleFormSubmit}
          books={books.filter((b): b is Book & { _id: string } => Boolean(b._id))}
          readers={readers.filter((r): r is Reader & { _id: string } => Boolean(r._id))}
        />
      </Dialog>

      <Dialog
        isOpen={confirmDialog.open}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title={
          confirmDialog.type === "complete"
            ? "Mark Book Returned"
            : "Remove Loan Record"
        }
      >
        {confirmDialog.type === "complete" ? (
          <div className="space-y-4 text-slate-300 text-sm">
            <p className="leading-relaxed">
              Confirm return of <strong className="text-white">"{confirmDialog.lending?.bookTitle}"</strong> borrowed by <strong className="text-white">"{confirmDialog.lending?.readerName}"</strong>.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Official Return Date
              </label>
              <input
                type="date"
                value={returnDateInput}
                onChange={(e) => setReturnDateInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>
        ) : (
          <p className="text-slate-300 text-sm leading-relaxed">
            Are you sure you want to purge this lending log? This action cannot be undone.
          </p>
        )}
      </Dialog>
    </div>
  );
};

export default LendingPage;