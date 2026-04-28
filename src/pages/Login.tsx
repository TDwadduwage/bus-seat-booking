import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ FIXED LOGIN FUNCTION (INSIDE COMPONENT)
  const handleLogin = async () => {
    console.log("LOGIN CLICKED")

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

    // ✅ Normalize email
    const cleanEmail = email.trim().toLowerCase()

    if (cleanEmail === "admin@gmail.com") {
      sessionStorage.setItem("role", "admin")
      console.log("ROLE SET: admin")
    } else {
      sessionStorage.setItem("role", "user")
      console.log("ROLE SET: user")
    }

    // ✅ small delay (safe navigation)
    setTimeout(() => {
      navigate("/")
    }, 200)
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
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-950 hover:bg-blue-800"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Admin: admin@gmail.com / admin123
        </p>
      </div>
    </main>
  )
}

export default Login