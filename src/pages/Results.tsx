import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"

type Bus = {
  id: number
  busName: string
  busNumber: string
  routeNumber: string
  fromLocation: string
  toLocation: string
  busType: string
  totalSeats: string
  departureTime: string
  arrivalTime: string
  ticketPrice: string
}

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const from = params.get("from")
  const to = params.get("to")
  const date = params.get("date")

  const [buses, setBuses] = useState<Bus[]>([])

 useEffect(() => {
  const fetchBuses = async () => {
    const { data } = await supabase.from("buses").select("*")
    setBuses(data || [])
  }

  fetchBuses()
}, [])

  const filteredBuses = buses.filter(
  (bus) =>
    bus.from_location.toLowerCase() === from?.toLowerCase() &&
    bus.to_location.toLowerCase() === to?.toLowerCase()
)

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-slate-900">
        Available Buses
      </h2>

      <p className="text-slate-600 mb-6">
        {from} → {to} | {date}
      </p>

      {filteredBuses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No buses found
          </h3>
          <p className="text-slate-600">
            No buses are available for this route yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between gap-5 md:items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {bus.busName}
                </h3>

                <p className="text-slate-500">
                  Bus No: {bus.busNumber} | Route No: {bus.routeNumber}
                </p>

                <p className="text-slate-500">{bus.busType}</p>

                <div className="flex items-center gap-4 mt-3 text-slate-700">
                  <span className="font-semibold">{bus.departureTime}</span>
                  <span className="text-xl">→</span>
                  <span className="font-semibold">{bus.arrivalTime}</span>
                </div>

                <p className="mt-2 text-slate-600">
                  {bus.fromLocation} → {bus.toLocation}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-green-600 font-bold text-xl">
                  LKR {bus.ticketPrice}
                </p>

                <p className="text-sm text-slate-500">
                  {bus.totalSeats} seats available
                </p>

                <p className="text-sm text-slate-500">
                  Travel Date: {date}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/seats?busId=${bus.id}&from=${bus.fromLocation}&to=${bus.toLocation}&date=${date}`
                    )
                  }
                  className="mt-3 bg-blue-950 text-white px-5 py-2 rounded-lg hover:bg-blue-800"
                >
                  Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Results