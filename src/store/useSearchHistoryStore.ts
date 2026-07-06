import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SearchHistoryState } from '../types/github'

// Store useSearchHistoryStore: Registra os perfis buscados pelo usuário recentemente
// Limita a lista de buscas mais recentes a 10 itens e as persiste no localStorage
export const useSearchHistoryStore = create<SearchHistoryState>()(
	persist(
		(set) => ({
			history: [],

			// Adiciona um username ao histórico, trazendo-o para o topo e limitando o tamanho a 10
			addSearch: (username, avatarUrl) =>
				set((state) => {
					const newHistory = state.history.filter(
						(h) => h.username !== username,
					)

					return {
						history: [
							{
								username,
								avatarUrl,
								searchedAt: new Date().toISOString(),
							},
							...newHistory,
						].slice(0, 10),
					}
				}),

			// Remove uma busca específica do histórico com base no username
			removeSearch: (username) =>
				set((state) => {
					const renewHistory = state.history.filter(
						(h) => h.username !== username,
					)
					return { history: renewHistory }
				}),

			// Remove todas as buscas do histórico de uma vez só
			clearHistory: () => set({ history: [] }),
		}),
		{
			name: 'gitprofile-seacrh-history', // Nome da chave no localStorage
		},
	),
)
