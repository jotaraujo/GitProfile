import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
	email: string
  avatar_url?: string
}

interface AuthState {
	user: User | null
	login: (user: User) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set): AuthState => ({
			user: null,
			login: (user) => set({ user }),
			logout: () => set({ user: null }),
		}),
		{
			name: 'gitprofile-auth',
		},
	),
)
