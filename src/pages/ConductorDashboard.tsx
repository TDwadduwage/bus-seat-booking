import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

type Booking = {
  id: string
  passenger_name: string
  seat_numbers: string
  is_checked: boolean
  bus: {
    bus_name: string
  } | null
}

const ConductorDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()

    const channel = supabase
      .channel("live-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadBookings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadBookings = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        passenger_name,
        seat_numbers,
        is_checked,
        bus:buses (bus_name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const formatted: Booking[] = (data || []).map((b: any) => ({
      id: b.id,
      passenger_name: b.passenger_name,
      seat_numbers: b.seat_numbers,
      is_checked: b.is_checked,
      bus: Array.isArray(b.bus) ? b.bus[0] : b.bus,
    }))

    setBookings(formatted)
    setLoading(false)
  }

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        🎫 Conductor Dashboard
      </h1>

      <div className="grid gap-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-xl shadow flex justify-between items-center ${
              b.is_checked ? "bg-green-100" : "bg-white"
            }`}
          >
            <div>
              <p className="font-bold">{b.passenger_name}</p>
              <p className="text-sm">
                Bus: {b.bus?.bus_name || "N/A"}
              </p>
              <p className="text-sm">
                Seats: {b.seat_numbers}
              </p>
            </div>

            <div>
              {b.is_checked ? (
                <span className="text-green-700 font-semibold">
                  ✅ Checked
                </span>
              ) : (
                <span className="text-red-500 font-semibold">
                  ❌ Not Checked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default ConductorDashboard