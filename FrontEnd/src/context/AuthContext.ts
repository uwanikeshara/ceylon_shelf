import { createContext } from "react"

export interface AuthContextType {
  isLoggedIn: boolean
  login: (accessToken: string, role: string) => void
  logout: () => void
  isAuthenticating: boolean
  role: string
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
