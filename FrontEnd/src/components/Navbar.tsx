import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "../context/useAuth"
import { MdOutlineLocalLibrary, MdLogout, MdLogin, MdDashboard, MdWifi } from "react-icons/md"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn, role, logout: unauthenticate } = useAuth()

  const handleLogin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsMenuOpen(false)
    navigate("/login")
  }

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsMenuOpen(false)
    setIsLoading(true)
    try {
      await logout()
      toast.success("Logged out successfully")
      unauthenticate()
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Logout failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDashboard = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsMenuOpen(false)
    navigate("/dashboard")
  }

  return (
    <nav className="bg-slate-900/90 backdrop-blur-xl border-b border-emerald-500/10 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleDashboard}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <MdOutlineLocalLibrary className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Ceylon<span className="text-amber-400">Shelf</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/20 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MdWifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Network Active</span>
            </div>

            {isLoggedIn && (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <div className="flex items-center space-x-2 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                    {role === "admin" ? "ADM" : "MBR"}
                  </div>
                  <span className="font-medium hidden lg:inline capitalize text-slate-200">{role} Account</span>
                </div>

                <button
                  type="button"
                  onClick={handleDashboard}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition duration-150 border border-slate-700 hover:border-emerald-500/40 cursor-pointer"
                >
                  <MdDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Portal</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition duration-150 border border-rose-500/20 cursor-pointer"
                >
                  <MdLogout className="w-4 h-4" />
                  <span>{isLoading ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4.5 py-2 rounded-xl text-sm font-bold transition duration-150 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <MdLogin className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2">
            {!isLoggedIn && (
              <button
                type="button"
                onClick={handleLogin}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                <MdLogin className="w-5 h-5" />
                <span>Portal Login</span>
              </button>
            )}

            {isLoggedIn && (
              <>
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-800 text-slate-200 py-2.5 rounded-xl font-medium cursor-pointer"
                >
                  <MdDashboard className="w-5 h-5 text-emerald-400" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-rose-500/10 text-rose-400 py-2.5 rounded-xl font-medium border border-rose-500/20 cursor-pointer"
                >
                  <MdLogout className="w-5 h-5" />
                  <span>{isLoading ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
