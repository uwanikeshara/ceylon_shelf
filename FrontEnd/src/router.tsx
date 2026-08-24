import { createBrowserRouter } from "react-router-dom"

import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import Dashboard from "./pages/Dashboard"
import Layout from "./pages/Layout"
import AdminRoutes from "./pages/AdminRoutes"
import Readers from "./pages/ReadersPage"
import Books from "./pages/BooksPage"
import Lending from "./pages/LendingPage"
import Overdue from "./pages/OverduePage"
import Users from "./pages/UserPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        element: <AdminRoutes />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          {
            path: "/dashboard/users",
            element: (
              // Only admin can see this page, but AdminRoutes already checks
              <Users />
            ),
          },
          { path: "/dashboard/readers", element: <Readers /> },
          { path: "/dashboard/books", element: <Books /> },
          { path: "/dashboard/lending", element: <Lending /> },
          { path: "/dashboard/overdue", element: <Overdue /> },
        ],
      },
    ],
  },
])

export default router
