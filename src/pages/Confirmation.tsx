import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import QRCode from "qrcode"
import jsPDF from "jspdf"
type Bus = {
  bus_name: string
  from_location: string
  to_location: string
  ticket_price: number
}

type Booking = {
  id: string
  seat_numbers: string
  passenger_name: string
  bus: Bus
}

const Confirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [qr, setQr] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // ✅ FETCH BOOKING FROM DB
  useEffect(() => {
    if (!id) return

    const fetchBooking = async () => {
      setLoading(true)

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

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const formatted = {
        ...data,
        bus: Array.isArray(data.bus) ? data.bus[0] : data.bus,
      }

      setBooking(formatted)
      setLoading(false)
    }

    fetchBooking()
  }, [id])

  // ✅ GENERATE QR
  useEffect(() => {
    if (!booking) return

    const generateQR = async () => {
      const qrData = JSON.stringify({
        bookingId: booking.id,
        seats: booking.seat_numbers,
      })

      const url = await QRCode.toDataURL(qrData)
      setQr(url)
    }

    generateQR()
  }, [booking])

  // ✅ DOWNLOAD PDF
  const downloadPDF = async () => {
    if (!booking) return

    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Bus Ticket 🎟️", 20, 20)

    doc.setFontSize(12)
    doc.text(`Booking ID: ${booking.id}`, 20, 40)
    doc.text(`Bus: ${booking.bus.bus_name}`, 20, 50)
    doc.text(
      `Route: ${booking.bus.from_location} → ${booking.bus.to_location}`,
      20,
      60
    )
    doc.text(`Seats: ${booking.seat_numbers}`, 20, 70)
    doc.text(`Passenger: ${booking.passenger_name}`, 20, 80)

    const total =
      booking.seat_numbers.split(",").length *
      booking.bus.ticket_price

    doc.text(`Total: LKR ${total}`, 20, 90)

    const qrImage = qr || (await QRCode.toDataURL(booking.id))

    doc.addImage(qrImage, "PNG", 20, 100, 50, 50)

    doc.save(`ticket-${booking.id}.pdf`)
  }

  if (loading) {
    return <p className="p-6">Loading booking...</p>
  }

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-3">Booking not found</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    )
  }

  const total =
    booking.seat_numbers.split(",").length *
    booking.bus.ticket_price

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Booking Confirmed 🎉
        </h2>

        <p className="mb-4">Your booking was successful</p>

        <div className="text-left space-y-2 mb-6">
          <p><b>Bus:</b> {booking.bus.bus_name}</p>
          <p>
            <b>Route:</b> {booking.bus.from_location} → {booking.bus.to_location}
          </p>
          <p><b>Seats:</b> {booking.seat_numbers}</p>
          <p><b>Passenger:</b> {booking.passenger_name}</p>
          <p><b>Total:</b> LKR {total}</p>
          <p className="text-green-700 font-semibold">
            <b>Booking ID:</b> {booking.id}
          </p>
        </div>

        {/* QR */}
        {qr && (
          <div className="flex justify-center mb-6">
            <img src={qr} alt="QR" className="w-40 h-40" />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={downloadPDF}
            className="bg-blue-900 text-white px-4 py-2 rounded-xl"
          >
            Download Ticket
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 px-4 py-2 rounded-xl"
          >
            Go Home
          </button>
        </div>

      </div>
    </main>
  )
}

export default Confirmation