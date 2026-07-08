import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PinnedProfilesState } from '../types/github'

// Store usePinnedProfileStore: Gerencia os perfis que o usuário marcou como favoritos/fixados
// Limita a exibição a no máximo 4 perfis fixados e salva no localStorage
export const usePinnedProfileStore = create<PinnedProfilesState>()(
	persist(
		(set, get) => ({
			pinned: [],

			// Adiciona um perfil à lista de fixados, limitando a lista aos 4 mais recentes
			pinProfile: (profile) =>
				set((state) => {
					const filtered = state.pinned.filter((p) => p.login !== profile.login)

					return {
						pinned: [profile, ...filtered].slice(0, 4),
					}
				}),

			// Remove um perfil da lista de fixados
			unpinProfile: (login) =>
				set((state) => {
					const filtered = state.pinned.filter((p) => p.login !== login)

					return {
						pinned: filtered,
					}
				}),

			// Verifica se um perfil específico com o login indicado está fixado
			isPinned: (login) => get().pinned.some((p) => p.login === login),
		}),
		{
			name: 'gitprofile-pinned-profile', // Nome da chave do localStorage
		},
	),
)
