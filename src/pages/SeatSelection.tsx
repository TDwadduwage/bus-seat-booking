import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

type Seat = {
  id: string
  seat_number: number
  is_booked: boolean
  is_locked: boolean
  locked_at: string | null
  locked_by: string | null
}

const LOCK_DURATION = 5 * 60 // 5 mins

const SeatSelection = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const bus = location.state?.bus

  const sessionId = sessionStorage.getItem("session_id") || crypto.randomUUID()

  sessionStorage.setItem("session_id", sessionId)

  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(LOCK_DURATION)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bus?.id) return

    loadSeats()

    const channel = supabase
      .channel("seat-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "seats",
          filter: `bus_id=eq.${bus.id}`,
        },
        () => {
          loadSeats()
        }
      )
      .subscribe()

    return () => {
      unlockMySeats()
      supabase.removeChannel(channel)
    }
  }, [bus])

  // countdown
  useEffect(() => {
    if (selectedSeats.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          unlockMySeats()
          setSelectedSeats([])
          alert("Seat lock expired")
          return LOCK_DURATION
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedSeats])

  const loadSeats = async () => {
    setLoading(true)

    await autoUnlockExpiredSeats()

    const { data, error } = await supabase
      .from("seats")
      .select("*")
      .eq("bus_id", bus.id)
      .order("seat_number", { ascending: true })

    if (error) {
      console.error(error.message)
      setLoading(false)
      return
    }

    setSeats(data || [])
    setLoading(false)
  }

  const autoUnlockExpiredSeats = async () => {
    const expiry = new Date(Date.now() - LOCK_DURATION * 1000).toISOString()

    await supabase
      .from("seats")
      .update({
        is_locked: false,
        locked_at: null,
        locked_by: null,
      })
      .eq("is_locked", true)
      .lt("locked_at", expiry)
  }

  const unlockMySeats = async () => {
    await supabase
      .from("seats")
      .update({
        is_locked: false,
        locked_at: null,
        locked_by: null,
      })
      .eq("locked_by", sessionId)
      .eq("is_booked", false)
  }

  const toggleSeat = async (seat: Seat) => {
    if (seat.is_booked) return

    const mine = seat.locked_by === sessionId
    const unavailable = seat.is_locked && !mine

    if (unavailable) return

    const isSelected = selectedSeats.includes(seat.seat_number)

    if (isSelected) {
      await supabase
        .from("seats")
        .update({
          is_locked: false,
          locked_at: null,
          locked_by: null,
        })
        .eq("id", seat.id)

      setSelectedSeats((prev) =>
        prev.filter((s) => s !== seat.seat_number)
      )
    } else {
      await supabase
        .from("seats")
        .update({
          is_locked: true,
          locked_at: new Date().toISOString(),
          locked_by: sessionId,
        })
        .eq("id", seat.id)
        .eq("is_locked", false)

      setSelectedSeats((prev) => [...prev, seat.seat_number])
      setTimeLeft(LOCK_DURATION)
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Select at least one seat")
      return
    }

    navigate("/passenger", {
      state: {
        bus,
        selectedSeats,
        sessionId,
      },
    })
  }

  if (!bus) return <p className="p-6">No bus selected</p>
  if (loading) return <p className="p-6">Loading seats...</p>

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-3">
        Select Seats - {bus.bus_name}
      </h2>

      {selectedSeats.length > 0 && (
        <p className="text-red-600 font-semibold mb-6">
          Lock expires in: {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      )}

      <div className="grid grid-cols-5 gap-4 mb-8">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seat_number)
          const mine = seat.locked_by === sessionId

          return (
            <button
              key={seat.id}
              disabled={
                seat.is_booked || (seat.is_locked && !mine)
              }
              onClick={() => toggleSeat(seat)}
              className={`
                h-12 rounded-xl font-semibold shadow transition
                ${
                  seat.is_booked
                    ? "bg-red-500 text-white"
                    : seat.is_locked && !mine
                    ? "bg-yellow-400"
                    : isSelected
                    ? "bg-green-600 text-white scale-110"
                    : "bg-white hover:bg-blue-50"
                }
              `}
            >
              {seat.seat_number}
            </button>
          )
        })}
      </div>

      <p className="mb-5">
        Selected Seats:{" "}
        <b>
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None"}
        </b>
      </p>

      <button
        onClick={handleContinue}
        className="bg-blue-950 text-white px-6 py-3 rounded-xl"
      >
        Continue
      </button>
    </main>
  )
}

export default SeatSelection