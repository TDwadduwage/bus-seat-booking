import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [role, setRole] = useState<string | null>(null)

  // ✅ keep role in sync
  useEffect(() => {
    const updateRole = () => {
      setRole(sessionStorage.getItem("role"))
    }

    updateRole()

    // listen for changes (login/logout in same tab)
    window.addEventListener("storage", updateRole)

    return () => {
      window.removeEventListener("storage", updateRole)
    }
  }, [])

  // ✅ LOGOUT FIX
  const handleLogout = async () => {
    await supabase.auth.signOut()

    sessionStorage.removeItem("role")
    setRole(null) // 🔥 immediate UI update

    navigate("/login")
  }

  // ✅ BASE LINKS
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buses", path: "/results" },
    { name: "My Bookings", path: "/my-bookings" },
  ]
  if (role === "admin") {
  navLinks.push({ name: "Conductor", path: "/conductor" })
  navLinks.push({ name: "Scanner", path: "/scanner" })
}
if (role === "admin") {
  navLinks.push({ name: "Seat Map", path: "/seat-map" })
}

  return (
    <nav className="bg-blue-950 text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold">
          🚌 BusBooking LK
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-6 items-center">

          {navLinks.map((link) => {
            const active = location.pathname === link.path

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition ${
                  active ? "text-yellow-300" : "hover:text-yellow-300"
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          {/* ADMIN */}
          {role === "admin" && (
            <Link
              to="/admin"
              className={`transition ${
                location.pathname === "/admin"
                  ? "text-yellow-300"
                  : "hover:text-yellow-300"
              }`}
            >
              Admin
            </Link>
          )}

          {/* AUTH BUTTONS */}
          {!role ? (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-yellow-300">
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition"
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