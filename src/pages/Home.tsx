import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const cities = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Kurunegala",
  "Matara",
  "Negombo",
  "Anuradhapura",
  "Badulla",
  "Trincomalee"
]

const Home = () => {
  const navigate = useNavigate()

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields")
      return
    }

    navigate(`/results?from=${from}&to=${to}&date=${date}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-blue-700 font-semibold mb-3">
            Sri Lanka Bus Seat Booking facility
          </p>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Travel smarter across Sri Lanka 🚌
          </h1>

          <p className="mt-5 text-slate-600 text-lg">
            Compare buses, choose your seats, and book your journey in seconds.
          </p>

          {/* OPTIONAL CTA */}
          <motion.button
            onClick={() => document.getElementById("searchBox")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-6 bg-blue-950 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Booking
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE - SEARCH CARD */}
        <motion.div
          id="searchBox"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Search Buses
          </h2>

          {/* FROM */}
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            From
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-700"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          {/* TO */}
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            To
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-700"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          {/* DATE */}
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Travel Date
          </label>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-700"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* BUTTON */}
          <motion.button
            onClick={handleSearch}
            className="w-full bg-blue-950 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Search Available Buses
          </motion.button>
        </motion.div>

      </section>

      {/* EXTRA SECTION (OPTIONAL) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pb-16 px-6"
      >
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Why choose us?
        </h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow">
            ⚡ Fast Booking
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            🪑 Seat Selection
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            🔒 Secure Payments
          </div>
        </div>
      </motion.section>

    </main>
  )
}

export default Home