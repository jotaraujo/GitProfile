import { createClient } from '@supabase/supabase-js'

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseURL || !supabaseKey) {
	throw new Error(
		'As variáveis de ambiente do Supabase não estão configuradas no arquivo .env!',
	)
}

export const supabase = createClient(supabaseURL, supabaseKey)
