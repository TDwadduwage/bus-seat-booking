import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

const Signup = () => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!fullName || !phone || !email || !password) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      alert(error.message)
      return
    }

    // 2️⃣ Save extra user data in profile table
    const user = data.user

    if (user) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: fullName,
          phone: phone,
          email: email,
        },
      ])
    }

    setLoading(false)

    alert("Signup successful! Please login.")
    navigate("/login")
  }

  return (
    <main className="px-6 py-10 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Create Account
        </h2>

        <p className="text-slate-600 text-center mt-2 mb-8">
          Register to book bus seats across Sri Lanka.
        </p>

        <input
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-950 hover:bg-blue-800"
          }`}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-slate-600 text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-800 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Signup