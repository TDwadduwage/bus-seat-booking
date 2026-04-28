import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

const Confirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { bus, selectedSeats, passenger } = location.state || {}

  const hasRun = useRef(false)

  useEffect(() => {
    const saveBooking = async () => {
      if (hasRun.current) return
      hasRun.current = true

      const user = await supabase.auth.getUser()

      if (!user.data.user) {
        alert("Login required")
        return
      }

      if (!bus || !selectedSeats?.length || !passenger) {
        alert("Missing booking data")
        return
      }

      // 1. INSERT BOOKING (FIXED)
      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: user.data.user.id,
        bus_id: bus.id,
        seat_numbers: selectedSeats.join(","),
        passenger_name: passenger.name,
        phone: passenger.phone,
        email: passenger.email,
        nic: passenger.nic,
      })

      if (bookingError) {
        console.error(bookingError)
        alert("Booking failed")
        return
      }

      // 2. LOCK SEATS
      await supabase
        .from("seats")
        .update({ is_booked: true })
        .eq("bus_id", bus.id)
        .in("seat_number", selectedSeats)

      alert("Booking Successful 🎉")
      navigate("/my-bookings")
    }

    saveBooking()
  }, [])

  return <p className="p-6">Processing booking...</p>
}

export default Confirmation