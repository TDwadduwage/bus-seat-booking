import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  // 🔥 Get role from session
  const role = sessionStorage.getItem("role")

  // ✅ Base links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buses", path: "/results" },
    { name: "My Bookings", path: "/my-bookings" },
    { name: "Signup", path: "/signup" },
  ]

  // 👉 Show Login only if NOT logged in
  if (!role) {
    navLinks.push({ name: "Login", path: "/login" })
  }

  // 👉 Show Admin only if admin logged in
  if (role === "admin") {
    navLinks.push({ name: "Admin", path: "/admin" })
  }

  return (
    <nav className="bg-blue-950 text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          🚌 BusBooking LK
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const active = location.pathname === link.path

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition ${
                  active
                    ? "text-yellow-300"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar