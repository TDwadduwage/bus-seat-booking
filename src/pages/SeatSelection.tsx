import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type Bus = {
  id: number
  busName: string
  busNumber: string
  routeNumber: string
  fromLocation: string
  toLocation: string
  busType: string
  totalSeats: string
}

const bookedSeats = ["A1", "A2", "B3", "C4"]

const generateSeats = (totalSeats: number) => {
  const seats: string[][] = []
  const seatsPerRow = 4
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let seatCount = 1

  for (let rowIndex = 0; seatCount <= totalSeats; rowIndex++) {
    const rowLetter = alphabet[rowIndex]
    const rowSeats: string[] = []

    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      if (seatCount <= totalSeats) {
        rowSeats.push(`${rowLetter}${seatNumber}`)
        seatCount++
      }
    }

    seats.push(rowSeats)
  }

  return seats
}

const SeatSelection = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const busId = params.get("busId")
  const from = params.get("from")
  const to = params.get("to")
  const date = params.get("date")

  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)

  useEffect(() => {
    const savedBuses = localStorage.getItem("buses")

    if (savedBuses && busId) {
      const buses: Bus[] = JSON.parse(savedBuses)
      const bus = buses.find((item) => item.id === Number(busId))

      if (bus) {
        setSelectedBus(bus)
      }
    }
  }, [busId])

  const totalSeats = selectedBus ? Number(selectedBus.totalSeats) : 32
  const seats = generateSeats(totalSeats)

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) return

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const getSeatClass = (seat: string) => {
    if (bookedSeats.includes(seat)) {
      return "bg-red-500 cursor-not-allowed opacity-80"
    }

    if (selectedSeats.includes(seat)) {
      return "bg-blue-600 hover:bg-blue-700"
    }

    return "bg-green-500 hover:bg-green-600"
  }

  const handleContinue = () => {
    navigate(
      `/passenger?seats=${selectedSeats.join(",")}&from=${from}&to=${to}&date=${date}&busId=${busId}`
    )
  }

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Select Your Seats
          </h2>

          <p className="text-slate-600 mb-2">
            {from} → {to} | {date}
          </p>

          {selectedBus && (
            <p className="text-slate-500 mb-6">
              {selectedBus.busName} | Bus No: {selectedBus.busNumber} | Route No:{" "}
              {selectedBus.routeNumber}
            </p>
          )}

          <div className="flex gap-5 text-sm mb-8">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span>
              Available
            </span>

            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-600"></span>
              Selected
            </span>

            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500"></span>
              Booked
            </span>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-center bg-slate-800 text-white rounded-xl py-2 mb-6">
              Driver
            </div>

            {seats.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex justify-center items-center mb-3"
              >
                <div className="flex gap-3">
                  {row.slice(0, 2).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={bookedSeats.includes(seat)}
                      className={`w-12 h-12 rounded-xl text-white font-semibold transition ${getSeatClass(
                        seat
                      )}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>

                <div className="w-10"></div>

                <div className="flex gap-3">
                  {row.slice(2).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={bookedSeats.includes(seat)}
                      className={`w-12 h-12 rounded-xl text-white font-semibold transition ${getSeatClass(
                        seat
                      )}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Booking Summary
          </h3>

          <div className="space-y-3 text-slate-700">
            <p>
              <span className="font-semibold">Bus ID:</span> {busId}
            </p>

            {selectedBus && (
              <p>
                <span className="font-semibold">Bus:</span>{" "}
                {selectedBus.busName}
              </p>
            )}

            <p>
              <span className="font-semibold">Route:</span> {from} → {to}
            </p>

            <p>
              <span className="font-semibold">Date:</span> {date}
            </p>

            <p>
              <span className="font-semibold">Total Bus Seats:</span>{" "}
              {totalSeats}
            </p>

            <p>
              <span className="font-semibold">Selected Seats:</span>{" "}
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "No seats selected"}
            </p>

            <p>
              <span className="font-semibold">Total Selected:</span>{" "}
              {selectedSeats.length}
            </p>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={handleContinue}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition ${
              selectedSeats.length === 0
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-950 hover:bg-blue-800"
            }`}
          >
            Continue Booking
          </button>
        </aside>
      </div>
    </main>
  )
}

export default SeatSelection