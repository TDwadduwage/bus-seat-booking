import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getBuses, addBus } from "../services/busService"

type Bus = {
  id: string
  bus_name: string
  from_location: string
  to_location: string
  ticket_price: number
}

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(false)

  const [busName, setBusName] = useState("")
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [ticketPrice, setTicketPrice] = useState("")

  // ✅ AUTH + LOAD
  useEffect(() => {
    const role = sessionStorage.getItem("role")

    if (role !== "admin") {
      alert("Admin only")
      navigate("/login")
      return
    }

    loadBuses()
  }, [])

  // ✅ LOAD BUSES
  const loadBuses = async () => {
    setLoading(true)

    const { data, error } = await getBuses()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setBuses(data || [])
    setLoading(false)
  }

  // ✅ ADD BUS
  const handleAddBus = async () => {
    if (!busName || !fromLocation || !toLocation || !ticketPrice) {
      alert("Fill all fields")
      return
    }

    const { error } = await addBus({
      bus_name: busName,
      from_location: fromLocation,
      to_location: toLocation,
      ticket_price: Number(ticketPrice),
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("Bus added")

    setBusName("")
    setFromLocation("")
    setToLocation("")
    setTicketPrice("")

    loadBuses()
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input
          placeholder="Bus Name"
          value={busName}
          onChange={(e) => setBusName(e.target.value)}
          className="input"
        />
        <input
          placeholder="From"
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          className="input"
        />
        <input
          placeholder="To"
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          className="input"
        />
        <input
          placeholder="Price"
          type="number"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          className="input"
        />

        <button
          onClick={handleAddBus}
          className="bg-blue-900 text-white px-4 py-2 rounded mt-3"
        >
          Add Bus
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : buses.length === 0 ? (
        <p>No buses found</p>
      ) : (
        buses.map((bus) => (
          <div key={bus.id} className="border p-4 rounded mb-2">
            <p className="font-bold">{bus.bus_name}</p>
            <p>{bus.from_location} → {bus.to_location}</p>
            <p>LKR {bus.ticket_price}</p>
          </div>
        ))
      )}
    </main>
  )
}

export default AdminDashboard