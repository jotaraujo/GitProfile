import { createClient } from '@supabase/supabase-js'

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let warned = false
const warnOnce = () => {
	if (!warned) {
		warned = true
		console.warn(
			'[Supabase] Variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não configuradas. Autenticação e banco de dados desativados.',
		)
	}
}

// Cria um cliente fake que não crasha — qualquer chamada de método retorna
// uma Promise resolvida com null (ou um objeto vazio), mantendo o app funcional
// mesmo sem Supabase configurado.
function createStubClient(): ReturnType<typeof createClient> {
	return new Proxy(
		{},
		{
			get(_target, prop) {
				warnOnce()

				// auth, storage, etc. — retorna outro proxy que também não crasha
				if (typeof prop === 'string' && !prop.startsWith('_')) {
					return createStubClient()
				}

				// Funções: .auth.signOut(), .from('table').select('*'), etc.
				if (prop === 'then') return undefined // não é Promise
				return async (..._args: unknown[]) => ({
					data: null,
					error: null,
					count: null,
					status: 200,
					statusText: 'OK (stub)',
				})
			},
		},
	) as unknown as ReturnType<typeof createClient>
}

export const supabase =
	supabaseURL && supabaseKey
		? createClient(supabaseURL, supabaseKey)
		: createStubClient()
