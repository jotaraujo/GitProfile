import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { SearchHistoryItem, SearchHistoryState } from '../types/github'

// Store useSearchHistoryStore: Registra os perfis buscados pelo usuário recentemente
// Limita a lista de buscas mais recentes a 10 itens e as persiste no localStorage
export const useSearchHistoryStore = create<SearchHistoryState>()(
	persist(
		(set) => ({
			history: [],

			// Adiciona um username ao histórico, trazendo-o para o topo e limitando o tamanho a 10
			addSearch: async (username, avatarUrl, userId) => {
				if (userId) {
					await supabase.from('search_history').upsert({
						user_id: userId,
						github_username: username,
						searched_at: new Date().toISOString(),
					})
				}
				//Atualiza a memória local da store
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
				})
			},

			// Remove uma busca específica do histórico com base no username
			removeSearch: async (username, userId) => {
				if (userId) {
					await supabase
						.from('search_history')
						.delete()
						.eq('user_id', userId)
						.eq('github_username', username)
				}
				//Remove a memória local
				set((state) => {
					const renewHistory = state.history.filter(
						(h) => h.username !== username,
					)

					return { history: renewHistory }
				})
			},

			// Remove todas as buscas do histórico de uma vez só
			clearHistory: async (userId) => {
				if (userId) {
					await supabase.from('search_history').delete().eq('user_id', userId)
				}

				set({ history: [] })
			},

			fetchHistory: async (userId) => {
				if (!userId) return

				const { data, error } = await supabase
					.from('search_history')
					.select('*')
					.eq('user_id', userId)
					.order('searched_at', { ascending: false })

				if (error) throw error

				const mappedHistory: SearchHistoryItem[] = (data || []).map((item) => ({
					username: item.github_username,
					avatarUrl: `https://github.com/${item.github_username}.png`,
					searchedAt: item.searched_at,
				}))

				set(() => ({ history: mappedHistory }))
			},
		}),
		{
			name: 'gitprofile-seacrh-history', // Nome da chave no localStorage
		},
	),
)
