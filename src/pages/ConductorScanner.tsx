import { useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { supabase } from "../services/supabase"
import { loadBookingsFromCache, queueOfflineCheckin } from "../services/offlineSync"

const ConductorScanner = () => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (scannerRef.current) return

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    )

    scannerRef.current = scanner

    const onScanSuccess = async (decodedText: string) => {
      try {
        console.log("SCANNED:", decodedText)

        const bookingId = decodedText.replace("BOOKING:", "").trim()

        if (!bookingId) {
          alert("❌ Invalid QR format")
          return
        }

        // ✅ 1. Check local cache first
        const cachedBookings = loadBookingsFromCache()
        const cachedTicket = cachedBookings.find((b: any) => b.id === bookingId)

        if (cachedTicket) {
          if (cachedTicket.is_checked) {
            alert("⚠️ Already Used Ticket")
            return
          }
          
          queueOfflineCheckin(bookingId)
          
          if (navigator.onLine) {
            // Try to sync immediately without awaiting
            supabase.from("bookings").update({ is_checked: true, checked_at: new Date().toISOString() }).eq("id", bookingId).then()
          }
          
          alert(`✅ Checked-in: ${cachedTicket.passenger_name}`)
          return
        }

        // ✅ 2. If not in cache, fallback to Supabase (if online)
        if (!navigator.onLine) {
          alert("❌ Offline: Ticket not found in local cache")
          return
        }

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .single()

        if (error || !data) {
          alert("❌ Invalid Ticket")
          return
        }

        if (data.is_checked) {
          alert("⚠️ Already Used Ticket")
          return
        }

        // ✅ update check-in
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            is_checked: true,
            checked_at: new Date().toISOString(),
          })
          .eq("id", bookingId)

        if (updateError) {
          // If network fails during update, queue it
          queueOfflineCheckin(bookingId)
        }

        alert(`✅ Checked-in: ${data.passenger_name}`)
      } catch (err) {
        console.error(err)
        alert("Scanner error")
      }
    }

    scanner.render(onScanSuccess, () => {})

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [])

  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">
        📷 Conductor Scanner
      </h1>

      <div
        id="qr-reader"
        className="w-full max-w-md rounded-xl overflow-hidden shadow-lg"
      />
    </main>
  )
}

export default ConductorScanner