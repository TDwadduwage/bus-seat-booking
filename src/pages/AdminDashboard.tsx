import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getBuses, addBus, updateBus, deleteBus } from "../services/busService"

type Bus = {
  id: string
  bus_name: string
  bus_number: string
  route_number: string
  from_location: string
  to_location: string
  bus_type: string
  total_seats: number
  departure_time: string
  arrival_time: string
  ticket_price: number
}

type BusForm = {
  bus_name: string
  bus_number: string
  route_number: string
  from_location: string
  to_location: string
  bus_type: string
  total_seats: string
  departure_time: string
  arrival_time: string
  ticket_price: string
}

const emptyForm: BusForm = {
  bus_name: "",
  bus_number: "",
  route_number: "",
  from_location: "",
  to_location: "",
  bus_type: "Normal",
  total_seats: "",
  departure_time: "",
  arrival_time: "",
  ticket_price: "",
}

const BUS_TYPES = ["Normal", "Semi-Luxury", "Luxury", "Super-Luxury"]

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<BusForm>({ ...emptyForm })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

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

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
  }

  // ✅ LOAD BUSES
  const loadBuses = async () => {
    setLoading(true)
    const { data, error } = await getBuses()

    if (error) {
      showToast(error.message, "error")
      setLoading(false)
      return
    }

    setBuses(data || [])
    setLoading(false)
  }

  const handleFormChange = (field: keyof BusForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const required: (keyof BusForm)[] = [
      "bus_name", "bus_number", "route_number",
      "from_location", "to_location", "bus_type",
      "total_seats", "departure_time", "arrival_time", "ticket_price",
    ]
    for (const field of required) {
      if (!form[field]) {
        showToast(`Please fill in "${field.replace(/_/g, " ")}"`, "error")
        return false
      }
    }
    if (isNaN(Number(form.total_seats)) || Number(form.total_seats) <= 0) {
      showToast("Total seats must be a positive number", "error")
      return false
    }
    if (isNaN(Number(form.ticket_price)) || Number(form.ticket_price) <= 0) {
      showToast("Ticket price must be a positive number", "error")
      return false
    }
    return true
  }

  // ✅ ADD BUS
  const handleAddBus = async () => {
    if (!validateForm()) return

    const payload = {
      bus_name: form.bus_name,
      bus_number: form.bus_number,
      route_number: form.route_number,
      from_location: form.from_location,
      to_location: form.to_location,
      bus_type: form.bus_type,
      total_seats: Number(form.total_seats),
      departure_time: form.departure_time,
      arrival_time: form.arrival_time,
      ticket_price: Number(form.ticket_price),
    }

    const { error } = await addBus(payload)

    if (error) {
      showToast(error.message, "error")
      return
    }

    showToast("Bus added successfully!", "success")
    setForm({ ...emptyForm })
    setShowForm(false)
    loadBuses()
  }

  // ✅ EDIT BUS
  const handleEditBus = (bus: Bus) => {
    setEditingId(bus.id)
    setForm({
      bus_name: bus.bus_name,
      bus_number: bus.bus_number,
      route_number: bus.route_number,
      from_location: bus.from_location,
      to_location: bus.to_location,
      bus_type: bus.bus_type,
      total_seats: String(bus.total_seats),
      departure_time: bus.departure_time,
      arrival_time: bus.arrival_time,
      ticket_price: String(bus.ticket_price),
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ✅ UPDATE BUS
  const handleUpdateBus = async () => {
    if (!editingId || !validateForm()) return

    const payload = {
      bus_name: form.bus_name,
      bus_number: form.bus_number,
      route_number: form.route_number,
      from_location: form.from_location,
      to_location: form.to_location,
      bus_type: form.bus_type,
      total_seats: Number(form.total_seats),
      departure_time: form.departure_time,
      arrival_time: form.arrival_time,
      ticket_price: Number(form.ticket_price),
    }

    const { error } = await updateBus(editingId, payload)

    if (error) {
      showToast(error.message, "error")
      return
    }

    showToast("Bus updated successfully!", "success")
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
    loadBuses()
  }

  // ✅ DELETE BUS
  const handleDeleteBus = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    const { error } = await deleteBus(id)

    if (error) {
      showToast(error.message, "error")
      return
    }

    showToast("Bus deleted successfully!", "success")
    loadBuses()
  }

  // ✅ CANCEL EDIT
  const handleCancel = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
  }

  // ✅ FILTERED BUSES
  const filteredBuses = buses.filter((bus) => {
    const term = searchTerm.toLowerCase()
    return (
      bus.bus_name.toLowerCase().includes(term) ||
      bus.bus_number.toLowerCase().includes(term) ||
      bus.route_number.toLowerCase().includes(term) ||
      bus.from_location.toLowerCase().includes(term) ||
      bus.to_location.toLowerCase().includes(term) ||
      bus.bus_type.toLowerCase().includes(term)
    )
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 md:p-8">
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium
            transition-all duration-300 animate-slide-in
            ${toast.type === "success"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
          style={{ animation: "slideIn 0.3s ease-out" }}
        >
          <div className="flex items-center gap-2">
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              🚌 Admin Dashboard
            </h2>
            <p className="text-blue-300 mt-1 text-sm md:text-base">
              Manage all bus routes, schedules, and pricing
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search buses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                  text-white placeholder-blue-300 focus:outline-none focus:ring-2
                  focus:ring-blue-400 focus:border-transparent backdrop-blur-sm
                  transition-all duration-200 w-48 md:w-64"
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingId(null)
                setForm({ ...emptyForm })
              }}
              className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-200
                shadow-lg hover:shadow-xl active:scale-95
                bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                hover:from-blue-600 hover:to-indigo-700"
            >
              {showForm ? "✕ Close" : "+ Add Bus"}
            </button>
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-2xl p-6 md:p-8 mb-8 transition-all duration-300"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {editingId ? "✏️ Edit Bus" : "➕ Add New Bus"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Bus Name */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Bus Name</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo Express"
                  value={form.bus_name}
                  onChange={(e) => handleFormChange("bus_name", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Bus Number */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Bus Number</label>
                <input
                  type="text"
                  placeholder="e.g. NB-7788"
                  value={form.bus_number}
                  onChange={(e) => handleFormChange("bus_number", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Route Number */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Route Number</label>
                <input
                  type="text"
                  placeholder="e.g. 138"
                  value={form.route_number}
                  onChange={(e) => handleFormChange("route_number", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* From Location */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">From Location</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo"
                  value={form.from_location}
                  onChange={(e) => handleFormChange("from_location", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* To Location */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">To Location</label>
                <input
                  type="text"
                  placeholder="e.g. Kandy"
                  value={form.to_location}
                  onChange={(e) => handleFormChange("to_location", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Bus Type */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Bus Type</label>
                <select
                  value={form.bus_type}
                  onChange={(e) => handleFormChange("bus_type", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200
                    appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2393c5fd'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "20px",
                  }}
                >
                  {BUS_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-slate-800 text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Total Seats</label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  value={form.total_seats}
                  onChange={(e) => handleFormChange("total_seats", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Departure Time */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Departure Time</label>
                <input
                  type="time"
                  value={form.departure_time}
                  onChange={(e) => handleFormChange("departure_time", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200
                    [color-scheme:dark]"
                />
              </div>

              {/* Arrival Time */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Arrival Time</label>
                <input
                  type="time"
                  value={form.arrival_time}
                  onChange={(e) => handleFormChange("arrival_time", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200
                    [color-scheme:dark]"
                />
              </div>

              {/* Ticket Price */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1.5">Ticket Price (LKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={form.ticket_price}
                  onChange={(e) => handleFormChange("ticket_price", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                    text-white placeholder-blue-300/60 focus:outline-none focus:ring-2
                    focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* FORM BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingId ? handleUpdateBus : handleAddBus}
                className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200
                  shadow-lg hover:shadow-xl active:scale-95
                  bg-gradient-to-r from-emerald-500 to-teal-600
                  hover:from-emerald-600 hover:to-teal-700"
              >
                {editingId ? "💾 Update Bus" : "➕ Add Bus"}
              </button>

              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-200
                  bg-white/10 text-white border border-white/20
                  hover:bg-white/20 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{buses.length}</p>
            <p className="text-blue-300 text-sm mt-1">Total Buses</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {buses.filter((b) => b.bus_type === "Luxury" || b.bus_type === "Super-Luxury").length}
            </p>
            <p className="text-blue-300 text-sm mt-1">Luxury Buses</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">
              {new Set(buses.map((b) => b.route_number)).size}
            </p>
            <p className="text-blue-300 text-sm mt-1">Routes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">
              {buses.reduce((sum, b) => sum + (b.total_seats || 0), 0)}
            </p>
            <p className="text-blue-300 text-sm mt-1">Total Seats</p>
          </div>
        </div>

        {/* BUS LIST */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">
              All Buses
              <span className="text-sm font-normal text-blue-300 ml-2">
                ({filteredBuses.length} {filteredBuses.length === 1 ? "bus" : "buses"})
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-300 mt-3">Loading buses...</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-5xl mb-3">🚌</p>
              <p className="text-blue-300 text-lg">
                {searchTerm ? "No buses match your search" : "No buses found. Add your first bus!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">Bus</th>
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">Route</th>
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider hidden lg:table-cell">Schedule</th>
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">Seats</th>
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold text-blue-300 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBuses.map((bus) => (
                    <tr
                      key={bus.id}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      {/* Bus Info */}
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{bus.bus_name}</p>
                        <p className="text-sm text-blue-300">{bus.bus_number}</p>
                      </td>

                      {/* Route */}
                      <td className="px-4 py-4">
                        <p className="text-white">
                          {bus.from_location}
                          <span className="text-blue-400 mx-1">→</span>
                          {bus.to_location}
                        </p>
                        <p className="text-sm text-blue-300">Route #{bus.route_number}</p>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${bus.bus_type === "Luxury" || bus.bus_type === "Super-Luxury"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : bus.bus_type === "Semi-Luxury"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {bus.bus_type}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-white text-sm">
                          🕐 {bus.departure_time} - {bus.arrival_time}
                        </p>
                      </td>

                      {/* Seats */}
                      <td className="px-4 py-4">
                        <span className="text-white font-medium">{bus.total_seats}</span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        <span className="text-emerald-400 font-bold">
                          LKR {bus.ticket_price?.toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditBus(bus)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium
                              bg-blue-500/20 text-blue-300 border border-blue-500/30
                              hover:bg-blue-500/30 transition-all duration-200 active:scale-95"
                            title="Edit bus"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBus(bus.id, bus.bus_name)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium
                              bg-red-500/20 text-red-300 border border-red-500/30
                              hover:bg-red-500/30 transition-all duration-200 active:scale-95"
                            title="Delete bus"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}

export default AdminDashboard