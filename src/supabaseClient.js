import { createClient } from '@supabase/supabase-js'

// Thông số dự án của Thầy Tùng
const supabaseUrl = 'https://erkeqbxlwofjjddtqwiw.supabase.co'
const supabaseAnonKey = 'sb_publishable_z1Ltmo1dvd-9T1DD9qknaA_A-CPwrIs' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)