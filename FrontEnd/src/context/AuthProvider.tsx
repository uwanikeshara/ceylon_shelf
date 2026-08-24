import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient"
import router from "../router"

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string>("")
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
  const [role, setRole] = useState<string>("user") // "user" or "admin"

  const login = (token: string, userRole: string) => {
    setHeader(token)
    setIsLoggedIn(true)
    setAccessToken(token)
    setRole(userRole)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setAccessToken("")
    setRole("user")
  }

  useEffect(() => {
    setHeader(accessToken)
  }, [accessToken])

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const result = await apiClient.post("/auth/refresh-token")
        setAccessToken(result.data.accessToken)
        setIsLoggedIn(true)
        setRole(result.data.role || "user") // expects backend to return role

        const currentPath = window.location.pathname
        if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
          router.navigate("/dashboard")
        }
      } catch (error) {
        setAccessToken("")
        setIsLoggedIn(false)
        setRole("user")
      } finally {
        setIsAuthenticating(false)
      }
    }

    tryRefresh()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating, role }}>
      {children}
    </AuthContext.Provider>
  )
}
