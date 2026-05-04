import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

const PassengerDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()

 const { bus, selectedSeats} = location.state || {}

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [nic, setNic] = useState("")

  if (!bus || !selectedSeats.length) {
    return <p className="p-6">Missing booking data</p>
  }

  const handleBooking = () => {
    if (!name || !phone || !email || !nic) {
      alert("Fill all fields")
      return
    }

   navigate("/payment", {
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
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 px-6 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* FORM */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">Passenger Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input className="input" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="input" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="input" placeholder="NIC" value={nic} onChange={(e)=>setNic(e.target.value)} />
          </div>

          <button
            onClick={handleBooking}
            className="mt-6 bg-blue-950 text-white px-6 py-3 rounded-xl"
          >
            Confirm Booking
          </button>
        </section>

        {/* SUMMARY */}
        <aside className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-4">Trip Summary</h3>

          <p><b>Bus:</b> {bus.bus_name}</p>
          <p><b>Route:</b> {bus.from_location} → {bus.to_location}</p>
          <p><b>Seats:</b> {selectedSeats.join(", ")}</p>
          <p><b>Total:</b> LKR {selectedSeats.length * bus.ticket_price}</p>
        </aside>

      </div>
    </main>
  )
}

export default PassengerDetails