import { Navigate, Outlet, useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/useAuth"

const AdminRoutes = () => {
  const { isLoggedIn, role, isAuthenticating } = useAuth()
  const location = useLocation()

  if (isAuthenticating) return null

  if (
    location.pathname.startsWith("/dashboard/users") &&
    role !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-950 p-2 sm:p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminRoutes
