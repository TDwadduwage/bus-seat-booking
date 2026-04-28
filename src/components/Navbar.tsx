import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const Navbar = () => {
  const location = useLocation()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setRole(sessionStorage.getItem("role"))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    sessionStorage.removeItem("role")
    window.location.href = "/login"
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buses", path: "/results" },
    { name: "My Bookings", path: "/my-bookings" },
  ]

  if (!role) {
    navLinks.push({ name: "Login", path: "/login" })
    navLinks.push({ name: "Signup", path: "/signup" })
  }

  if (role === "admin") {
    navLinks.push({ name: "Admin", path: "/admin" })
  }

  return (
    <nav className="bg-blue-950 text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-xl font-bold">
          🚌 BusBooking LK
        </Link>

        <div className="hidden md:flex gap-6">

          {navLinks.map((link) => {
            const active = location.pathname === link.path

            return (
              <Link
                key={link.path}
                to={link.path}
                className={active ? "text-yellow-300" : "hover:text-yellow-300"}
              >
                {link.name}
              </Link>
            )
          })}

          {role && (
            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-400"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar