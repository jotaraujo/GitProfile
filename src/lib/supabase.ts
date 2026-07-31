import { createClient } from '@supabase/supabase-js'

console.log('[debug] URL:', import.meta.env.VITE_SUPABASE_URL?.slice(0, 20))
console.log(
	'[debug] KEY:',
	import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10),
)

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

// Retorna uma Promise com shape { data, error } — padrão do Supabase
function stubResult(data: unknown = null) {
	return Promise.resolve({
		data,
		error: null,
		count: null,
		status: 200,
		statusText: 'OK (stub)',
	})
}

// Query builder: encadeável (.eq().single()) e "awaitable"
function createQueryBuilder() {
	const promise = stubResult([])
	return new Proxy(promise, {
		get(target, prop) {
			// Mantém o comportamento de Promise (await / .then)
			if (prop === 'then') return target.then.bind(target)
			if (prop === 'catch') return target.catch.bind(target)
			if (prop === 'finally') return target.finally.bind(target)

			// Métodos de query — todos retornam um novo query builder
			if (typeof prop === 'string' && !prop.startsWith('_')) {
				return () => createQueryBuilder()
			}

			return Reflect.get(target, prop as keyof typeof target)
		},
	}) as unknown as ReturnType<ReturnType<typeof createClient>['from']>
}

// Módulo auth
function createAuthStub() {
	return {
		getSession: () => stubResult({ session: null }),
		onAuthStateChange: () => ({
			data: { subscription: { unsubscribe: () => {} } },
		}),
		signOut: () => stubResult(),
		signUp: () => stubResult({ user: null, session: null }),
		signInWithPassword: () => stubResult({ user: null, session: null }),
		signInWithOAuth: () => stubResult({ provider: null }),
		resetPasswordForEmail: () => stubResult(),
		updateUser: () => stubResult({ user: null }),
		getUser: () => stubResult({ user: null }),
	}
}

// Módulo storage
function createStorageStub() {
	return {
		from: () => ({
			upload: () => stubResult({ path: null }),
			download: () => stubResult(null),
			list: () => stubResult([]),
			getPublicUrl: () => ({ data: { publicUrl: '' } }),
			remove: () => stubResult(),
			move: () => stubResult(),
			copy: () => stubResult(),
			createSignedUrl: () => stubResult({ signedUrl: null }),
		}),
	}
}

// Cliente stub completo
function createStubClient(): ReturnType<typeof createClient> {
	warnOnce()
	return {
		auth: createAuthStub(),
		storage: createStorageStub(),
		from: () => createQueryBuilder(),
		channel: () => ({
			on: () => ({ subscribe: () => 'stub' }),
			subscribe: () => 'stub',
			unsubscribe: () => {},
		}),
		realtime: { channel: () => ({ on: () => ({ subscribe: () => {} }) }) },
		rpc: () => stubResult(null),
		functions: { invoke: () => stubResult(null) },
	} as unknown as ReturnType<typeof createClient>
}

export const supabase =
	supabaseURL && supabaseKey
		? createClient(supabaseURL, supabaseKey)
		: createStubClient()
