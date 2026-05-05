import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

type Seat = {
    id: string
    seat_number: number
    is_booked: boolean
}

type Booking = {
    seat_numbers: string
    is_checked: boolean
}

const SeatMapDashboard = () => {
    const [seats, setSeats] = useState<Seat[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])

    const busId = "YOUR_BUS_ID_HERE" // 🔥 replace or pass dynamically

    // ✅ LOAD DATA
    useEffect(() => {
        loadData()

        // 🔥 REALTIME: seats
        const seatChannel = supabase
            .channel("seat-live")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "seats",
                    filter: `bus_id=eq.${busId}`,
                },
                () => loadData()
            )
            .subscribe()

        // 🔥 REALTIME: bookings
        const bookingChannel = supabase
            .channel("booking-live")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookings",
                },
                () => loadData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(seatChannel)
            supabase.removeChannel(bookingChannel)
        }
    }, [])

    const loadData = async () => {
        // seats
        const { data: seatData } = await supabase
            .from("seats")
            .select("*")
            .eq("bus_id", busId)
            .order("seat_number", { ascending: true })

        // bookings
        const { data: bookingData } = await supabase
            .from("bookings")
            .select("seat_numbers, is_checked")

        setSeats(seatData || [])
        setBookings(bookingData || [])
    }

    // ✅ CHECK IF SEAT IS BOARDED
    const isBoarded = (seatNumber: number) => {
        return bookings.some(
            (b) =>
                b.is_checked &&
                b.seat_numbers.split(", ").includes(String(seatNumber))
        )
    }

    return (
        <main className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                🪑 Live Seat Map
            </h1>

            <div className="grid grid-cols-5 gap-4">
                {seats.map((seat) => {
                    const boarded = isBoarded(seat.seat_number)

                    let style = "bg-white"

                    if (boarded) {
                        style = "bg-green-500 text-white"
                    } else if (seat.is_booked) {
                        style = "bg-red-500 text-white"
                    }

                    return (
                        <div
                            key={seat.id}
                            className={`h-12 flex items-center justify-center rounded-xl font-semibold shadow transition-all duration-300 hover:scale-110 hover:shadow-xl ${style}`}
                        >
                            {seat.seat_number}
                        </div>
                    )
                })}
            </div>

            {/* LEGEND */}
            <div className="mt-6 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-white border"></span> Available
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-500"></span> Booked
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-500"></span> Boarded
                </div>
            </div>
        </main>
    )
}

export default SeatMapDashboard