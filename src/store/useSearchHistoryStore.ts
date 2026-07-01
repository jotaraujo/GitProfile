import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SearchHistoryState } from '../types/github'

export const useSearchHistoryStore = create<SearchHistoryState>()(
	persist(
		(set) => ({
			history: [],

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

			removeSearch: (username) =>
				set((state) => {
					const renewHistory = state.history.filter(
						(h) => h.username !== username,
					)
					return { history: renewHistory }
				}),

			clearHistory: () => set({ history: [] }),
		}),
		{
			name: 'gitprofile-seacrh-history',
		},
	),
)
