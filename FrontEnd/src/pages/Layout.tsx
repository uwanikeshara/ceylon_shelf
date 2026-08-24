import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/useAuth"
import { useSocket } from "../hooks/useSocket"

const Layout = () => {
  const { isAuthenticating } = useAuth()

  useSocket()

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-semibold animate-pulse">
        Initializing CeylonShelf Portal...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
