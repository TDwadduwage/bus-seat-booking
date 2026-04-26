import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    // 🔥 Simple role logic (for demo)
    if (email === "admin@gmail.com" && password === "admin123") {
      sessionStorage.setItem("role", "admin")
      alert("Admin login successful")
      navigate("/admin")
    } else {
      sessionStorage.setItem("role", "user")
      alert("User login successful")
      navigate("/")
    }
  }

  return (
    <main className="px-6 py-10 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Login
        </h2>

        <p className="text-slate-600 text-center mt-2 mb-8">
          Access your account
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-950 text-white py-3 rounded-xl font-semibold hover:bg-blue-800"
        >
          Login
        </button>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Admin: admin@gmail.com / admin123
        </p>
      </div>
    </main>
  )
}

export default Login