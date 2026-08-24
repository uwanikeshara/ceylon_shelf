import React, { useState } from "react";
import type { Lending } from "../../types/Lending";
import toast from "react-hot-toast";

interface LendingFormProps {
  onSubmit: (data: Partial<Lending>) => void;
  books: { _id: string; title: string }[];
  readers: { _id: string; name: string }[];
}

const LendingForm: React.FC<LendingFormProps> = ({ onSubmit, books, readers }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const defaultDueStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    bookId: "",
    readerId: "",
    borrowDate: todayStr,
    dueDate: defaultDueStr,
    returnDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "borrowDate" && value) {
        const bDate = new Date(value);
        if (!isNaN(bDate.getTime())) {
          const dDate = new Date(bDate.getTime() + 14 * 24 * 60 * 60 * 1000);
          updated.dueDate = dDate.toISOString().split("T")[0];
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId || !formData.readerId || !formData.dueDate) {
      toast.error("Select a book, reader, and due date");
      return;
    }
    const selectedBook = books.find((b) => b._id === formData.bookId);
    const selectedReader = readers.find((r) => r._id === formData.readerId);

    const payload: Partial<Lending> = {
      bookId: formData.bookId,
      readerId: formData.readerId,
      bookTitle: selectedBook ? selectedBook.title : "",
      readerName: selectedReader ? selectedReader.name : "",
      borrowDate: formData.borrowDate ? new Date(formData.borrowDate).toISOString() : new Date().toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
    };

    if (formData.returnDate) {
      payload.returnDate = new Date(formData.returnDate).toISOString();
      payload.status = "returned";
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Catalog Book Title
        </label>
        <select
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          required
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition"
        >
          <option value="">Select Catalog Book</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Registered Library Member
        </label>
        <select
          name="readerId"
          value={formData.readerId}
          onChange={handleChange}
          required
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition"
        >
          <option value="">Select Member</option>
          {readers.map((reader) => (
            <option key={reader._id} value={reader._id}>
              {reader.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Issue Date
          </label>
          <input
            type="date"
            name="borrowDate"
            value={formData.borrowDate}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Due Date (14-Day Term)
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Return Date <span className="text-slate-500 font-normal">(Optional if currently active)</span>
        </label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition"
        />
      </div>

      <button type="submit" className="hidden">Submit</button>
    </form>
  );
};

export default LendingForm;
