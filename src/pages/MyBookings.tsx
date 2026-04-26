const bookings = [
  {
    id: "BK102938",
    route: "Colombo → Kandy",
    date: "2026-04-28",
    seats: "A3, A4",
    status: "Confirmed"
  },
  {
    id: "BK204851",
    route: "Galle → Colombo",
    date: "2026-05-02",
    seats: "B1",
    status: "Confirmed"
  }
]

const MyBookings = () => {
  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        My Bookings
      </h2>

      <p className="text-slate-600 mb-8">
        View your recent Sri Lanka bus seat bookings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {booking.id}
              </h3>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {booking.status}
              </span>
            </div>

            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-semibold">Route:</span>{" "}
                {booking.route}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {booking.date}
              </p>
              <p>
                <span className="font-semibold">Seats:</span>{" "}
                {booking.seats}
              </p>
            </div>

            <button className="mt-6 bg-slate-200 text-slate-900 px-5 py-2 rounded-xl font-semibold hover:bg-slate-300">
              View Ticket
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

export default MyBookings