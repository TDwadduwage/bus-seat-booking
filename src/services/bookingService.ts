import { supabase } from "./supabase"

export const createBooking = async (payload: {
  user_id: string
  bus_id: number
  seat_numbers: string
  passenger_name: string
  phone: string
  email: string
  nic: string
}) => {
  return await supabase.from("bookings").insert([payload])
}

export const getMyBookings = async () => {
  return await supabase
    .from("bookings")
    .select("*, buses(*)")
    .order("created_at", { ascending: false })
}