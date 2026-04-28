import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

const Results = () => {
  const [buses, setBuses] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    loadBuses()
  }, [])

  const loadBuses = async () => {
    const { data, error } = await supabase
      .from("buses")
      .select("*")   // ✅ THIS IS WHERE IT GOES

    if (error) {
      console.log(error.message)
      return
    }

    setBuses(data || [])
  }

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Buses</h2>

      {buses.map((bus) => (
        <div key={bus.id} className="border p-4 rounded mb-3">
          <h3 className="font-bold">{bus.bus_name}</h3>
          <p>{bus.from_location} → {bus.to_location}</p>
          <p>LKR {bus.ticket_price}</p>

          <button
            onClick={() => {
              navigate("/seats", {
                state: { bus }   // ✅ pass full bus object
              })
            }}
            className="bg-blue-900 text-white px-4 py-2 rounded mt-2"
          >
            Select Seats
          </button>
        </div>
      ))}
    </main>
  )
}

export default Results