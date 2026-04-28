import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

type Seat = {
  id: string
  seat_number: number
  is_booked: boolean
}

const SeatSelection = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const bus = location.state?.bus

  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ LOAD SEATS FROM DATABASE
  useEffect(() => {
    if (!bus?.id) return
    loadSeats()
  }, [bus])

  const loadSeats = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("seats")
      .select("*")
      .eq("bus_id", bus.id)

    if (error) {
      console.error(error.message)
      alert("Failed to load seats")
      setLoading(false)
      return
    }

    setSeats(data || [])
    setLoading(false)
  }

  // SELECT SEAT
  const toggleSeat = (seatNumber: number, isBooked: boolean) => {
    if (isBooked) return

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber))
    } else {
      setSelectedSeats([...selectedSeats, seatNumber])
    }
  }

  // CONTINUE
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Select at least one seat")
      return
    }

    navigate("/passenger", {
      state: {
        bus,
        selectedSeats,
      },
    })
  }

  if (loading) return <p className="p-6">Loading seats...</p>

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Select Seats - {bus?.bus_name}
      </h2>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seat_number)

          return (
            <button
              key={seat.id}
              disabled={seat.is_booked}
              onClick={() => toggleSeat(seat.seat_number, seat.is_booked)}
              className={`
                h-12 rounded-lg font-semibold border transition
                ${
                  seat.is_booked
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : isSelected
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-slate-100"
                }
              `}
            >
              {seat.seat_number}
            </button>
          )
        })}
      </div>

      <p className="mb-4 text-slate-700">
        Selected Seats:{" "}
        <span className="font-bold">
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </span>
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