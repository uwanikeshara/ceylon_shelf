import React, { useState, useEffect } from "react";
import type { Book } from "../../types/Book";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: Omit<Book, "_id">) => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  publishedDate?: string;
  genre?: string;
  availableCopies?: string;
}

const BookForm = ({ book, onSubmit }: BookFormProps) => {
  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    publishedDate: string;
    genre: string;
    availableCopies: number;
  }>({
    title: "",
    author: "",
    publishedDate: new Date().toISOString().split("T")[0],
    genre: "",
    availableCopies: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        publishedDate: typeof book.publishedDate === "string"
          ? book.publishedDate.split("T")[0]
          : new Date(book.publishedDate).toISOString().split("T")[0],
        genre: book.genre,
        availableCopies: book.availableCopies,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        publishedDate: new Date().toISOString().split("T")[0],
        genre: "",
        availableCopies: 1,
      });
    }
    setErrors({});
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Book title is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required";
    }
    if (!formData.publishedDate) {
      newErrors.publishedDate = "Publication date is required";
    }
    if (!formData.genre.trim()) {
      newErrors.genre = "Genre category is required";
    }
    if (
      formData.availableCopies === undefined ||
      formData.availableCopies === null ||
      isNaN(Number(formData.availableCopies)) ||
      Number(formData.availableCopies) < 0
    ) {
      newErrors.availableCopies = "Must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        availableCopies: Number(formData.availableCopies),
        publishedDate: formData.publishedDate,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableCopies" ? Number(value) : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Book Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
            errors.title ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
          placeholder="e.g. Madol Doova"
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="author" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Author Name
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
            errors.author ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
          placeholder="e.g. Martin Wickramasinghe"
        />
        {errors.author && <p className="mt-1 text-xs text-red-400">{errors.author}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="genre" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Genre Category
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
              errors.genre ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
            } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
            placeholder="e.g. Sri Lankan Classic / Fiction"
          />
          {errors.genre && <p className="mt-1 text-xs text-red-400">{errors.genre}</p>}
        </div>

        <div>
          <label htmlFor="availableCopies" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Available Copies
          </label>
          <input
            type="number"
            id="availableCopies"
            name="availableCopies"
            value={formData.availableCopies}
            onChange={handleChange}
            min={0}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
              errors.availableCopies ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
            } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
            placeholder="Available units"
          />
          {errors.availableCopies && <p className="mt-1 text-xs text-red-400">{errors.availableCopies}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="publishedDate" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Publication Date
        </label>
        <input
          type="date"
          id="publishedDate"
          name="publishedDate"
          value={formData.publishedDate}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
            errors.publishedDate ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          } text-slate-100 rounded-xl text-sm focus:outline-none transition`}
          required
        />
        {errors.publishedDate && <p className="mt-1 text-xs text-red-400">{errors.publishedDate}</p>}
      </div>

      <button type="submit" className="hidden">Submit</button>
    </form>
  );
};

export default BookForm;