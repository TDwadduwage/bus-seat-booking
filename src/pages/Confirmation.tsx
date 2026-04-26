import { Link, useLocation } from "react-router-dom"

const Confirmation = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const bookingId = "BK" + Math.floor(100000 + Math.random() * 900000)

  return (
    <main className="px-6 py-10 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <span className="text-4xl">✅</span>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Booking Confirmed!
        </h2>

        <p className="text-slate-600 mt-2">
          Your bus seat booking has been successfully completed.
        </p>

        <div className="mt-8 bg-slate-100 rounded-2xl p-6 text-left">
          <h3 className="text-xl font-bold mb-4 text-slate-900">
            E-Ticket Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
            <p><span className="font-semibold">Booking ID:</span> {bookingId}</p>
            <p><span className="font-semibold">Bus ID:</span> {params.get("busId")}</p>
            <p><span className="font-semibold">Name:</span> {params.get("name")}</p>
            <p><span className="font-semibold">Phone:</span> {params.get("phone")}</p>
            <p><span className="font-semibold">Email:</span> {params.get("email")}</p>
            <p><span className="font-semibold">NIC / Passport:</span> {params.get("nic")}</p>
            <p><span className="font-semibold">Route:</span> {params.get("from")} → {params.get("to")}</p>
            <p><span className="font-semibold">Date:</span> {params.get("date")}</p>
            <p><span className="font-semibold">Seats:</span> {params.get("seats")}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="bg-blue-950 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800"
          >
            Book Another Trip
          </Link>

          <Link
            to="/my-bookings"
            className="bg-slate-200 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Confirmation