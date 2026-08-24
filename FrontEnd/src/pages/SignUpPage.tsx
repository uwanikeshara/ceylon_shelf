import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "../services/authService"
import toast from "react-hot-toast"
import { useAuth } from "../context/useAuth"
import { MdOutlineLocalLibrary, MdPersonOutline, MdMailOutline, MdLockOutline, MdBadge } from "react-icons/md"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: "user" | "admin"
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name) {
      newErrors.name = "Full name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        const res: any = await signUp({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: formData.role,
        })
        if (res.accessToken) {
          login(res.accessToken, res.role || formData.role)
        }
        toast.success(`Account registered! Welcome to CeylonShelf, ${res.name || formData.name}!`)
        navigate("/dashboard")
      } catch (error: any) {
        const apiError = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Registration failed";
        toast.error(apiError);
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-emerald-500/20 shadow-2xl z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 text-slate-950 shadow-lg shadow-emerald-500/20 mb-4">
            <MdOutlineLocalLibrary className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Register Account
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Join CeylonShelf Digital Library Network
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Account Registration Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/90 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: "user" }))}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  formData.role === "user"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MdPersonOutline className="w-4 h-4" />
                <span>Library Member</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: "admin" }))}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  formData.role === "admin"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MdBadge className="w-4 h-4" />
                <span>Staff / Admin</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MdPersonOutline className="w-5 h-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border ${
                  errors.name ? "border-rose-500/80" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
                } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
                placeholder="Kasun Perera"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MdMailOutline className="w-5 h-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border ${
                  errors.email ? "border-rose-500/80" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
                } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
                placeholder="kasun.perera@ceylonshelf.lk"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MdLockOutline className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border ${
                  errors.password ? "border-rose-500/80" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
                } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MdLockOutline className="w-5 h-5" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border ${
                  errors.confirmPassword ? "border-rose-500/80" : "border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
                } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {!isLoading ? `Create ${formData.role === "admin" ? "Staff / Admin" : "Member"} Account` : "Processing..."}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
