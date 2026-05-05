import { useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { supabase } from "../services/supabase"

type Booking = {
  id: string
  passenger_name: string
  is_checked: boolean
}

const ConductorScanner = () => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (scannerRef.current) return

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    scannerRef.current = scanner

    const onScanSuccess = async (decodedText: string) => {
      try {
        const bookingId = decodedText.replace("BOOKING:", "").trim()

        if (!bookingId) {
          alert("❌ Invalid QR")
          return
        }

        // ✅ STEP 1: FETCH booking
        const { data, error } = await supabase
          .from("bookings")
          .select("id, passenger_name, is_checked")
          .eq("id", bookingId)
          .single()

        if (error || !data) {
          alert("❌ Invalid Ticket")
          return
        }

        const booking = data as Booking

        if (booking.is_checked) {
          alert("⚠️ Already Used Ticket")
          return
        }

        // ✅ STEP 2: UPDATE
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            is_checked: true,
            checked_at: new Date().toISOString(),
          })
          .eq("id", bookingId)

        if (updateError) {
          alert("❌ Update failed")
          return
        }

        alert(`✅ Checked-in: ${booking.passenger_name}`)
      } catch (err) {
        console.error(err)
      }
    }

    scanner.render(onScanSuccess, () => {})

    return () => {
      scannerRef.current?.clear().catch(() => {})
      scannerRef.current = null
    }
  }, [])

  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">📷 Scanner</h1>
      <div id="qr-reader" className="w-full max-w-md" />
    </main>
  )
}

export default ConductorScanner