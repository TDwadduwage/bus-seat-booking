import { useState } from "react"
import { Link } from "react-router-dom"

const Signup = () => {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = () => {
    if (!fullName || !phone || !email || !password) {
      alert("Please fill all fields")
      return
    }

    alert("Signup UI working. Supabase Auth will connect later.")
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

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Full Name
        </label>
        <input
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Phone Number
        </label>
        <input
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Password
        </label>
        <input
          type="password"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-700"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-950 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Sign Up
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