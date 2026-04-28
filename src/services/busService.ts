import { supabase } from "./supabase"

// âž• Add bus
export const addBus = async (bus: any) => {
  const { data, error } = await supabase
    .from("buses")
    .insert([bus])

  return { data, error }
}

// ðŸ“¥ Get all buses
export const getBuses = async () => {
  const { data, error } = await supabase
    .from("buses")
    .select("*")

  return { data, error }
}
