import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const Confirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { bus, selectedSeats, passenger } = location.state || {}

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const saveBooking = async () => {
      if (!bus || !selectedSeats || !passenger) {
        setLoading(false)
        return
      }

      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        alert("Login required")
        setLoading(false)
        return
      }

      // ✅ STEP 1: SAVE BOOKING
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: userData.user.id,
          bus_id: bus.id,
          seat_numbers: selectedSeats.join(","),
          seats: selectedSeats.length
        })

      if (bookingError) {
        alert("Booking failed: " + bookingError.message)
        setLoading(false)
        return
      }

      // ✅ STEP 2: LOCK SEATS
      const { error: seatError } = await supabase
        .from("seats")
        .update({ is_booked: true })
        .eq("bus_id", bus.id)
        .in("seat_number", selectedSeats)

      if (seatError) {
        alert("Seat locking failed: " + seatError.message)
        setLoading(false)
        return
      }

      // ✅ SUCCESS
      setSuccess(true)
      setLoading(false)

      // optional redirect after 2 sec
      setTimeout(() => {
        navigate("/my-bookings")
      }, 2000)
    }

    saveBooking()
  }, [])

  // ❌ Missing state
  if (!bus || !selectedSeats || !passenger) {
    return <p className="p-6">Missing booking data</p>
  }

  // ⏳ Loading state
  if (loading) {
    return <p className="p-6">Saving booking...</p>
  }

  // 🎉 Success UI
  if (success) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Booking Confirmed 🎉
        </h2>

        <p><b>Passenger:</b> {passenger.name}</p>
        <p><b>Seats:</b> {selectedSeats.join(", ")}</p>
        <p><b>Bus:</b> {bus.bus_name}</p>

        <p className="mt-4 text-green-600">
          Redirecting to My Bookings...
        </p>
      </main>
    )
  }

  return null
}

export default Confirmation