import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    if (cleanEmail === "admin@gmail.com") {
      sessionStorage.setItem("role", "admin")
    } else {
      sessionStorage.setItem("role", "user")
    }

    setTimeout(() => navigate("/"), 200)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-indigo-200 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-slate-900">
          Welcome Back
        </h2>

        <p className="text-center text-slate-600 mt-2 mb-6">
          Login to your account
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            loading
              ? "bg-slate-400"
              : "bg-blue-950 hover:bg-blue-800"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-slate-500 mt-4">
          Admin: admin@gmail.com / admin123
        </p>
      </div>
    </main>
  )
}

export default Login