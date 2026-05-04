import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../services/supabase"

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { bus, selectedSeats, passenger } = location.state || {}
  const [loading, setLoading] = useState(false)

  if (!bus || !selectedSeats || !passenger) {
    return <p className="p-6 text-red-500">Missing payment data</p>
  }

  const total = selectedSeats.length * bus.ticket_price

 const handlePayment = async () => {
  setLoading(true)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    alert("Please login first")
    setLoading(false)
    return
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        bus_id: bus.id,
        seat_numbers: selectedSeats.join(", "),
        passenger_name: passenger.name,
        user_id: user.id, // ✅ CRITICAL FIX
      },
    ])
    .select()
    .single()

  setLoading(false)

  if (error) {
    console.error(error)
    alert(error.message)
    return
  }

  navigate(`/confirmation/${data.id}`)
}

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Payment</h2>

        <p><b>Bus:</b> {bus.bus_name}</p>
        <p><b>Seats:</b> {selectedSeats.join(", ")}</p>
        <p className="mb-6"><b>Total:</b> LKR {total}</p>

        <input className="input mb-3" placeholder="Card Number" />
        <input className="input mb-3" placeholder="MM/YY" />
        <input className="input mb-6" placeholder="CVV" />

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </main>
  )
}

export default Payment