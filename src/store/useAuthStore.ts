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

// Store useAuthStore: Gerencia o estado de login e autenticação do recrutador/usuário
// Utiliza persistência automática para guardar a sessão no localStorage do navegador
export const useAuthStore = create<AuthState>()(
	persist(
		(set): AuthState => ({
			user: null,
			login: (user) => set({ user }), // Define o usuário logado
			logout: () => set({ user: null }), // Remove o usuário (limpa a sessão)
		}),
		{
			name: 'gitprofile-auth', // Chave utilizada no localStorage
		},
	),
)
