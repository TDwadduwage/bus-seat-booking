import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { 
  saveBookingsToCache, 
  loadBookingsFromCache, 
  getSyncQueue, 
  syncOfflineCheckins 
} from "../services/offlineSync"

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
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)
  const syncQueueCount = getSyncQueue().length

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    loadBookings()

    const channel = supabase
      .channel("live-bookings")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          const updated = payload.new

          setBookings((prev) => {
            const newBookings = prev.map((b) =>
              b.id === updated.id
                ? { ...b, is_checked: updated.is_checked }
                : b
            )
            saveBookingsToCache(newBookings)
            return newBookings
          })
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    const res = await syncOfflineCheckins()
    setSyncing(false)
    if (res.success) {
      alert(`Successfully synced ${res.count} check-ins!`)
      loadBookings()
    } else {
      alert("Failed to sync. Please try again.")
    }
  }

  const loadBookings = async () => {
    setLoading(true)

    try {
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

      if (error) throw error

      const formatted: Booking[] = (data || []).map((b: any) => ({
        id: b.id,
        passenger_name: b.passenger_name,
        seat_numbers: b.seat_numbers,
        is_checked: b.is_checked,
        bus: Array.isArray(b.bus) ? b.bus[0] : b.bus,
      }))

      setBookings(formatted)
      saveBookingsToCache(formatted)
    } catch (err) {
      console.warn("Offline or error fetching bookings. Loading from cache.", err)
      const cached = loadBookingsFromCache()
      setBookings(cached)
    }

    setLoading(false)
  }

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          🎫 Conductor Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
          {syncQueueCount > 0 && (
            <button 
              onClick={handleSync}
              disabled={syncing || !isOnline}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition"
            >
              {syncing ? "Syncing..." : `Sync Now (${syncQueueCount})`}
            </button>
          )}
        </div>
      </div>

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