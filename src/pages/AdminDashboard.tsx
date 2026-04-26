import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [buses, setBuses] = useState<Bus[]>([])
  const [busName, setBusName] = useState("")
  const [busNumber, setBusNumber] = useState("")
  const [routeNumber, setRouteNumber] = useState("")
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [busType, setBusType] = useState("")
  const [totalSeats, setTotalSeats] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [ticketPrice, setTicketPrice] = useState("")

  useEffect(() => {
    const role = sessionStorage.getItem("role")

    if (role !== "admin") {
      alert("Access denied. Admin only.")
      navigate("/login")
      return
    }

    const savedBuses = localStorage.getItem("buses")

    if (savedBuses) {
      setBuses(JSON.parse(savedBuses))
    }
  }, [navigate])

const handleAddBus = async () => {
  const { error } = await supabase.from("buses").insert({
    bus_name: busName,
    bus_number: busNumber,
    route_number: routeNumber,
    from_location: fromLocation,
    to_location: toLocation,
    bus_type: busType,
    total_seats: Number(totalSeats),
    departure_time: departureTime,
    arrival_time: arrivalTime,
    ticket_price: Number(ticketPrice),
  })

  if (error) {
    alert("Error adding bus")
    console.error(error)
    return
  }

  alert("Bus added successfully")
}

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        Admin Dashboard
      </h2>

      <p className="text-slate-600 mb-8">
        Manage buses, routes, schedules, and bookings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Total Buses</p>
          <h3 className="text-3xl font-bold text-blue-950">
            {buses.length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Routes</p>
          <h3 className="text-3xl font-bold text-blue-950">
            {buses.length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Bookings</p>
          <h3 className="text-3xl font-bold text-blue-950">0</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Revenue</p>
          <h3 className="text-3xl font-bold text-green-600">LKR 0</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Add New Bus & Schedule
          </h3>

          <input
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Bus Name"
            value={busName}
            onChange={(e) => setBusName(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Bus Number"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Route Number (Example: 138)"
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
              placeholder="From Location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
            />

            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
              placeholder="To Location"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
            />
          </div>

          <select
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
            value={busType}
            onChange={(e) => setBusType(e.target.value)}
          >
            <option value="">Select Bus Type</option>
            <option value="Normal">Normal</option>
            <option value="Semi Luxury">Semi Luxury</option>
            <option value="Luxury">Luxury</option>
            <option value="Luxury AC">Luxury AC</option>
          </select>

          <input
            type="number"
            min="1"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Total Seats"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="time"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />

            <input
              type="time"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>

          <input
            type="number"
            min="1"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6"
            placeholder="Ticket Price (LKR)"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
          />

          <button
            onClick={handleAddBus}
            className="w-full bg-blue-950 text-white py-3 rounded-xl font-semibold hover:bg-blue-800"
          >
            Add Bus Schedule
          </button>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Added Bus Schedules
          </h3>

          {buses.length === 0 ? (
            <p className="text-slate-500">No buses added yet.</p>
          ) : (
            <div className="space-y-4">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <h4 className="font-bold text-slate-900">
                    {bus.busName}
                  </h4>

                  <p className="text-sm text-slate-600">
                    Bus No: {bus.busNumber}
                  </p>

                  <p className="text-sm text-slate-600">
                    Route No: {bus.routeNumber}
                  </p>

                  <p className="text-sm text-slate-600">
                    {bus.fromLocation} → {bus.toLocation}
                  </p>

                  <p className="text-sm text-slate-600">
                    {bus.departureTime} → {bus.arrivalTime}
                  </p>

                  <p className="text-sm text-slate-600">
                    {bus.busType} | Seats: {bus.totalSeats}
                  </p>

                  <p className="text-sm font-semibold text-green-600">
                    LKR {bus.ticketPrice}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard