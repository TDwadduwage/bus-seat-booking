import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import QRCode from "qrcode"
import jsPDF from "jspdf"

const Confirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<any>(null)
  const [qr, setQr] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) {
      setError("Missing booking ID")
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            seat_numbers,
            passenger_name,
            bus:buses (
              bus_name,
              from_location,
              to_location,
              ticket_price
            )
          `)
          .eq("id", id)
          .single()

        if (error) throw error

        if (!data) throw new Error("No booking found")

        const bus = Array.isArray(data.bus) ? data.bus[0] : data.bus

        if (!bus) throw new Error("Bus data missing")

        setBooking({ ...data, bus })

      } catch (err: any) {
        console.error("FETCH ERROR:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  useEffect(() => {
    if (!booking?.id) return

    QRCode.toDataURL(`BOOKING:${booking.id}`)
      .then(setQr)
      .catch(console.error)
  }, [booking])

  if (loading) return <p className="p-6">Loading booking...</p>

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    )
  }

  if (!booking) return null

  const total =
    booking.seat_numbers.split(",").length *
    booking.bus.ticket_price

  const downloadPDF = async () => {
    const doc = new jsPDF()

    doc.text("Bus Ticket", 20, 20)
    doc.text(`Booking ID: ${booking.id}`, 20, 40)

    const qrImg =
      qr || (await QRCode.toDataURL(`BOOKING:${booking.id}`))

    doc.addImage(qrImg, "PNG", 20, 60, 50, 50)

    doc.save(`ticket-${booking.id}.pdf`)
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Booking Confirmed 🎉
        </h2>

        <div className="text-left space-y-2 mb-6">
          <p><b>Bus:</b> {booking.bus.bus_name}</p>
          <p><b>Route:</b> {booking.bus.from_location} → {booking.bus.to_location}</p>
          <p><b>Seats:</b> {booking.seat_numbers}</p>
          <p><b>Passenger:</b> {booking.passenger_name}</p>
          <p><b>Total:</b> LKR {total}</p>
          <p className="text-green-700 font-semibold">
            <b>Booking ID:</b> {booking.id}
          </p>
        </div>

        {qr && (
          <img src={qr} className="w-40 mx-auto mb-6" />
        )}

        <button
          onClick={downloadPDF}
          className="bg-blue-900 text-white px-4 py-2 rounded-xl"
        >
          Download Ticket
        </button>

      </div>
    </main>
  )
}

export default Confirmation