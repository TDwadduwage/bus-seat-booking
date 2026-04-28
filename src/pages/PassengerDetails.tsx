import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

const PassengerDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const bus = location.state?.bus
const selectedSeats = location.state?.selectedSeats || []

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [nic, setNic] = useState("")

  // 🔥 Safety check
  if (!bus || !selectedSeats) {
    return <p className="p-6">Missing booking data</p>
  }

  const handleBooking = () => {
    if (!name || !phone || !email || !nic) {
      alert("Fill all fields")
      return
    }

    navigate("/confirmation", {
      state: {
        bus,
        selectedSeats,
        passenger: {
          name,
          phone,
          email,
          nic,
        },
      },
    })
  }

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Passenger Details
          </h2>

          <p className="text-slate-600 mb-8">
            Enter passenger information to complete your booking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <input
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="input"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input"
              placeholder="NIC / Passport"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />

          </div>

          <button
            onClick={handleBooking}
            className="mt-8 bg-blue-950 text-white px-8 py-3 rounded-xl"
          >
            Confirm Booking
          </button>
        </section>

        {/* SUMMARY */}
        <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">
            Trip Summary
          </h3>

          <div className="space-y-3 text-slate-700">

            <p>
              <b>Bus:</b> {bus.bus_name}
            </p>

            <p>
              <b>Route:</b> {bus.from_location} → {bus.to_location}
            </p>

            <p>
              <b>Seats:</b> {selectedSeats.join(", ")}
            </p>

            <p>
              <b>Total:</b> LKR {selectedSeats.length * bus.ticket_price}
            </p>

          </div>
        </aside>

      </div>
    </main>
  )
}

export default PassengerDetails