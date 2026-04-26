import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
    <main className="px-6 py-10">
      <section className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-700 font-semibold mb-3">
            Sri Lanka Bus Seat Booking
          </p>

          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Book your bus seats across Sri Lanka easily
          </h1>

          <p className="mt-5 text-slate-600 text-lg">
            Search routes, compare buses, select your seats, and confirm your booking online.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Search Buses
          </h2>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            From
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            To
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Travel Date
          </label>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-700"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="w-full bg-blue-950 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
          >
            Search Available Buses
          </button>
        </div>
      </section>
    </main>
  )
}

export default Home