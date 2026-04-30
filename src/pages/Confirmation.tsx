import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import QRCode from "qrcode"
import jsPDF from "jspdf"

const Confirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { bus, selectedSeats, passenger, bookingId } = location.state || {}

  const [qr, setQr] = useState("")

  useEffect(() => {
    if (!bookingId) return

    const generateQR = async () => {
      const qrData = JSON.stringify({
        bookingId,
        bus: bus.bus_name,
        seats: selectedSeats,
      })

      const url = await QRCode.toDataURL(qrData)
      setQr(url)
    }

    generateQR()
  }, [bookingId])

  if (!bus || !selectedSeats || !passenger) {
    return <p className="p-6">Missing booking data</p>
  }

  const total = selectedSeats.length * bus.ticket_price

  // ✅ PDF DOWNLOAD
  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Bus Ticket", 20, 20)

    doc.setFontSize(12)
    doc.text(`Booking ID: ${bookingId}`, 20, 40)
    doc.text(`Bus: ${bus.bus_name}`, 20, 50)
    doc.text(`Route: ${bus.from_location} → ${bus.to_location}`, 20, 60)
    doc.text(`Seats: ${selectedSeats.join(", ")}`, 20, 70)
    doc.text(`Passenger: ${passenger.name}`, 20, 80)
    doc.text(`Total: LKR ${total}`, 20, 90)

    if (qr) {
      doc.addImage(qr, "PNG", 20, 100, 50, 50)
    }

    doc.save("ticket.pdf")
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Booking Confirmed 🎉
        </h2>

        <p className="mb-4">Your booking was successful</p>

        <div className="text-left space-y-2 mb-6">
          <p><b>Bus:</b> {bus.bus_name}</p>
          <p><b>Route:</b> {bus.from_location} → {bus.to_location}</p>
          <p><b>Seats:</b> {selectedSeats.join(", ")}</p>
          <p><b>Passenger:</b> {passenger.name}</p>
          <p><b>Total:</b> LKR {total}</p>
          <p><b>Booking ID:</b> {bookingId}</p>
        </div>

        {/* ✅ QR CODE */}
        {qr && (
          <div className="flex justify-center mb-6">
            <img src={qr} alt="QR Code" className="w-40 h-40" />
          </div>
        )}

        {/* ✅ BUTTONS */}
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