import { supabase } from "./supabase"

const BOOKINGS_CACHE_KEY = "conductor_bookings_cache"
const SYNC_QUEUE_KEY = "conductor_sync_queue"

export const saveBookingsToCache = (bookings: any[]) => {
  localStorage.setItem(BOOKINGS_CACHE_KEY, JSON.stringify(bookings))
}

export const loadBookingsFromCache = () => {
  const cached = localStorage.getItem(BOOKINGS_CACHE_KEY)
  return cached ? JSON.parse(cached) : []
}

export const queueOfflineCheckin = (bookingId: string) => {
  const queue = getSyncQueue()
  if (!queue.includes(bookingId)) {
    queue.push(bookingId)
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  }

  // Update local cache to reflect checked-in status immediately
  const bookings = loadBookingsFromCache()
  const updatedBookings = bookings.map((b: any) =>
    b.id === bookingId ? { ...b, is_checked: true, checked_at: new Date().toISOString() } : b
  )
  saveBookingsToCache(updatedBookings)
}

export const getSyncQueue = (): string[] => {
  const queue = localStorage.getItem(SYNC_QUEUE_KEY)
  return queue ? JSON.parse(queue) : []
}

export const clearSyncQueue = () => {
  localStorage.removeItem(SYNC_QUEUE_KEY)
}

export const syncOfflineCheckins = async () => {
  const queue = getSyncQueue()
  if (queue.length === 0) return { success: true, count: 0 }

  try {
    const { error } = await supabase
      .from("bookings")
      .update({
        is_checked: true,
        checked_at: new Date().toISOString(),
      })
      .in("id", queue)

    if (error) throw error

    clearSyncQueue()
    return { success: true, count: queue.length }
  } catch (error) {
    console.error("Failed to sync offline checkins:", error)
    return { success: false, count: queue.length }
  }
}
