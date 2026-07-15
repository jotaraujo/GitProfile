import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
	id: string
	user_type: 'recruiter' | 'developer'
	github_username?: string
}

interface AuthState {
	user: User | null
	profile: UserProfile | null
	session: Session | null
	loading: boolean
	setProfile: (profile: UserProfile | null) => void
	setSession: (session: Session | null) => void
	setLoading: (loading: boolean) => void
	signOut: () => Promise<void>
}

// Store useAuthStore: Gerencia o estado de login e autenticação do recrutador/usuário
// Utiliza persistência automática para guardar a sessão no localStorage do navegador
export const useAuthStore = create<AuthState>()((set): AuthState => ({
	user: null,
	profile: null,
	session: null,
	loading: true,
	setProfile: (profile) => set({ profile }),
	setSession: (session) => set({ session, user: session?.user ?? null }),
	setLoading: (loading) => set({ loading }),
	signOut: async () =>
		await supabase.auth.signOut().then((res) => {
			if (res.error) throw new Error(res.error.message)
			set({ user: null, profile: null, session: null, loading: false })
		}),
}))
