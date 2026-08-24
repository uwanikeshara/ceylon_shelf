import React, { useState, useEffect } from "react";
import type { Reader, ReaderFormData } from "../../types/Reader";

interface ReaderFormProps {
  reader?: Reader | null;
  onSubmit: (readerData: Omit<Reader, "_id">) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  registerDate?: string;
}

const ReaderForm = ({ reader, onSubmit }: ReaderFormProps) => {
  const [formData, setFormData] = useState<ReaderFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    registerDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (reader) {
      setFormData({
        name: reader.name,
        email: reader.email,
        phoneNumber: reader.phoneNumber,
        address: reader.address,
        registerDate: typeof reader.registerDate === "string"
          ? reader.registerDate.split("T")[0]
          : new Date(reader.registerDate).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        registerDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [reader]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{9,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Residential / branch address is required";
    }

    if (!formData.registerDate) {
      newErrors.registerDate = "Registration date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Full Member Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
            errors.name ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
          placeholder="e.g. Nimal Perera"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
              errors.email ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
            } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
            placeholder="e.g. nimal.perera@ceylonshelf.lk"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
              errors.phoneNumber ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
            } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
            placeholder="e.g. +94 77 123 4567"
          />
          {errors.phoneNumber && <p className="mt-1 text-xs text-red-400">{errors.phoneNumber}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          City / Branch Location Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
            errors.address ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
          placeholder="e.g. No. 45, Galle Road, Colombo 03"
        />
        {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="registerDate" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Membership Issue Date
        </label>
        <input
          type="date"
          id="registerDate"
          name="registerDate"
          value={formData.registerDate}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
            errors.registerDate ? "border-red-500" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          } text-slate-100 rounded-xl text-sm focus:outline-none transition`}
          required
        />
        {errors.registerDate && <p className="mt-1 text-xs text-red-400">{errors.registerDate}</p>}
      </div>

      <button type="submit" className="hidden">Submit</button>
    </form>
  );
};

export default ReaderForm;