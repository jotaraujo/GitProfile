import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FollowState } from '../types/github'
import { supabase } from '../lib/supabase'

export const useFollowStore = create<FollowState>()(
	persist(
		(set, get) => ({
			followedUsernames: [],
			loading: false,

			isFollowing: (targetUsername: string) => {
				return get().followedUsernames.some(
					(username) => username.toLowerCase() === targetUsername.toLowerCase(),
				)
			},

			followUser: async (targetUsername: string, userId?: string) => {
				const cleanName = targetUsername.trim()

				if (!cleanName) return

				set((state) => {
					if (
						state.followedUsernames.some(
							(u) => u.toLowerCase() === cleanName.toLowerCase(),
						)
					) {
						return state
					}
					return { followedUsernames: [...state.followedUsernames, cleanName] }
				})

				if (userId) {
					try {
						await supabase.from('followed_profiles').insert({
							user_id: userId,
							followed_username: cleanName,
						})
					} catch (err) {
						console.error('Erro ao salvar perfil seguido no Supabase:', err)
					}
				}
			},

			unfollowUser: async (targetUsername: string, userId?: string) => {
				const cleanName = targetUsername.trim()

				set((state) => ({
					followedUsernames: state.followedUsernames.filter(
						(u) => u.toLowerCase() !== cleanName.toLowerCase(),
					),
				}))

				if (userId) {
					try {
						await supabase
							.from('followed_profiles')
							.delete()
							.eq('user_id', userId)
							.eq('followed_username', cleanName)
					} catch (err) {
						console.error('Erro ao remover perfil seguido no Supabase:', err)
					}
				}
			},

			fetchFollowedUsernames: async (userId?: string) => {
				if (!userId) return

				set({ loading: true })

				try {
					const { data, error } = await supabase
						.from('followed_profiles')
						.select('followed_username')
						.eq('user_id', userId)

					if (error) throw error

					if (data) {
						const usernames = data.map((item) => item.followed_username)
						set({ followedUsernames: usernames })
					}
				} catch (err) {
					console.error('Erro ao buscar perfis seguidos:', err)
				} finally {
					set({ loading: false })
				}
			},
		}),
		{
			name: 'follow-store',
		},
	),
)
