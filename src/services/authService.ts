import { supabase } from "./supabase"

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()

  // 👇 safely return null if no user
  return data?.user ?? null
}