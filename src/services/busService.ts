import { supabase } from "./supabase"

// ➕ Add bus
export const addBus = async (bus: any) => {
  const { data, error } = await supabase
    .from("buses")
    .insert([bus])

  return { data, error }
}

// 📥 Get all buses
export const getBuses = async () => {
  const { data, error } = await supabase
    .from("buses")
    .select("*")

  return { data, error }
}

// ✏️ Update bus
export const updateBus = async (id: string, bus: any) => {
  const { data, error } = await supabase
    .from("buses")
    .update(bus)
    .eq("id", id)

  return { data, error }
}

// 🗑️ Delete bus
export const deleteBus = async (id: string) => {
  const { data, error } = await supabase
    .from("buses")
    .delete()
    .eq("id", id)

  return { data, error }
}
