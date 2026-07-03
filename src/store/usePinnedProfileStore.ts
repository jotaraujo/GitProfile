import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PinnedProfilesState } from '../types/github'

export const usePinnedProfileStore = create<PinnedProfilesState>()(
	persist(
		(set, get) => ({
			pinned: [],

			pinProfile: (profile) =>
				set((state) => {
					const filtered = state.pinned.filter((p) => p.login !== profile.login)

					return {
						pinned: [profile, ...filtered].slice(0, 3),
					}
				}),

			unpinProfile: (login) =>
				set((state) => {
					const filtered = state.pinned.filter((p) => p.login !== login)

					return {
						pinned: filtered,
					}
				}),

			isPinned: (login) => get().pinned.some((p) => p.login === login),
		}),
		{
			name: 'gitprofile-pinned-profile',
		},
	),
)
