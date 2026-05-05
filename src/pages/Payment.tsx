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

  const calculateSeatPrice = (seatNum: number) => {
    if (seatNum <= 10) return bus.ticket_price * 1.2 // Premium (+20%)
    if (seatNum >= 31) return bus.ticket_price * 0.9 // Economy (-10%)
    return bus.ticket_price // Standard
  }

  const priceDetails = selectedSeats.map((seat: number) => ({
    seat,
    price: calculateSeatPrice(seat),
    type: seat <= 10 ? "Premium" : seat >= 31 ? "Economy" : "Standard"
  }))

  const total = priceDetails.reduce((sum: number, item: { price: number }) => sum + item.price, 0)

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

  if (data && !error) {
    await supabase
      .from("seats")
      .update({
        is_booked: true,
        is_locked: false,
        locked_by: null,
        locked_at: null,
      })
      .in("seat_number", selectedSeats)
      .eq("bus_id", bus.id)
  }

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
        
        <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="font-bold mb-2">Price Breakdown:</p>
          <ul className="text-sm space-y-1 mb-3">
            {priceDetails.map((item: { seat: number; type: string; price: number }) => (
              <li key={item.seat} className="flex justify-between">
                <span>Seat {item.seat} <span className="text-gray-500 text-xs">({item.type})</span></span>
                <span>LKR {item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-blue-600">LKR {total.toFixed(2)}</span>
          </div>
        </div>

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