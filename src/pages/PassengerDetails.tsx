import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

const PassengerDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const seats = params.get("seats")
  const from = params.get("from")
  const to = params.get("to")
  const date = params.get("date")
  const busId = params.get("busId")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [nic, setNic] = useState("")

  const handleBooking = () => {
    if (!name || !phone || !email || !nic) {
      alert("Please fill all passenger details")
      return
    }

    navigate(
      `/confirmation?name=${name}&phone=${phone}&email=${email}&nic=${nic}&seats=${seats}&from=${from}&to=${to}&date=${date}&busId=${busId}`
    )
  }

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Passenger Details
          </h2>

          <p className="text-slate-600 mb-8">
            Enter passenger information to complete your booking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                NIC / Passport Number
              </label>
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Enter NIC or passport"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleBooking}
            className="mt-8 bg-blue-950 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
          >
            Confirm Booking
          </button>
        </section>

        <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Trip Summary
          </h3>

          <div className="space-y-3 text-slate-700">
            <p><span className="font-semibold">Bus ID:</span> {busId}</p>
            <p><span className="font-semibold">Route:</span> {from} → {to}</p>
            <p><span className="font-semibold">Date:</span> {date}</p>
            <p><span className="font-semibold">Seats:</span> {seats}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default PassengerDetails