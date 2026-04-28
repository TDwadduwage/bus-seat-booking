import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

type Bus = {
  id: string
  bus_name: string
  from_location: string
  to_location: string
}

type Booking = {
  id: string
  seat_numbers: string
  passenger_name: string
  created_at: string
  bus?: Bus
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

 const loadBookings = async () => {
  setLoading(true)

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      seat_numbers,
      passenger_name,
      created_at,
      bus:buses!inner (
        id,
        bus_name,
        from_location,
        to_location
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Booking fetch error:", error)
    setLoading(false)
    return
  }

  // ✅ FIX: formatted MUST be here (outside error block)
  const formatted = (data || []).map((b: any) => ({
    ...b,
    bus: Array.isArray(b.bus) ? b.bus[0] : b.bus
  }))

  setBookings(formatted)
  setLoading(false)
}

  if (loading) {
    return <p className="p-6">Loading bookings...</p>
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="border p-4 mb-4 rounded">
            
            {/* BUS INFO */}
            <p className="font-bold">
              {b.bus?.bus_name || "Bus not found"}
            </p>

            <p>
              {b.bus?.from_location || "?"} → {b.bus?.to_location || "?"}
            </p>

            {/* BOOKING INFO */}
            <p><b>Seats:</b> {b.seat_numbers}</p>

            <p><b>Passenger:</b> {b.passenger_name || "N/A"}</p>

            <p className="text-sm text-gray-500">
              {new Date(b.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </main>
  )
}

export default MyBookings