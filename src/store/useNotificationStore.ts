import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NotificationState, AppNotification } from '../types/github'
import { supabase } from '../lib/supabase'

export const useNotificationStore = create<NotificationState>()(
	persist(
		(set) => ({
			notifications: [],
			unreadCount: 0,

			fetchNotifications: async (userId?: string) => {
				if (!userId) return

				try {
					const { data, error } = await supabase
						.from('user_notifications')
						.select('*')
						.eq('user_id', userId)
						.order('created_at', { ascending: false })

					if (error) throw error

					if (data) {
						const formatted: AppNotification[] = data.map((n) => ({
							id: n.id,
							username: n.username,
							avatarUrl: n.avatar_url,
							message: n.message,
							repoName: n.repo_name,
							createdAt: n.created_at,
							read: n.read,
						}))

						set({
							notifications: formatted,
							unreadCount: formatted.filter((n) => !n.read).length,
						})
					}
				} catch (err) {
					console.error('Erro ao buscar notificações:', err)
				}
			},

			addNotification: async (item, userId?: string) => {
				const newNotification: AppNotification = {
					...item,
					id: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
					read: false,
				}

				set((state) => {
					const updated = [newNotification, ...state.notifications]

					return {
						notifications: updated,
						unreadCount: updated.filter((n) => !n.read).length,
					}
				})

				if (userId) {
					try {
						await supabase.from('user_notifications').insert({
							user_id: userId,
							username: item.username,
							avatar_url: item.avatarUrl,
							message: item.message,
							repo_name: item.repoName || null,
							read: false,
						})
					} catch (err) {
						console.error('Erro ao salvar notificação:', err)
					}
				}
			},

			markAsRead: async (id: string) => {
				set((state) => {
					const updated = state.notifications.map((n) =>
						n.id === id ? { ...n, read: true } : n,
					)

					return {
						notifications: updated,
						unreadCount: updated.filter((n) => !n.read).length,
					}
				})

				try {
					await supabase
						.from('user_notifications')
						.update({ read: true })
						.eq('id', id)
				} catch (err) {
					console.error('Erro ao marcar notificação como lida:', err)
				}
			},

			markAllAsRead: async (userId?: string) => {
				set((state) => ({
					notifications: state.notifications.map((n) => ({ ...n, read: true })),
					unreadCount: 0,
				}))

				if (userId) {
					try {
						await supabase
							.from('user_notifications')
							.update({ read: true })
							.eq('user_id', userId)
					} catch (err) {
						console.error(
							'Erro ao marcar todas as notificações como lidas:',
							err,
						)
					}
				}
			},

			clearNotifications: async (userId?: string) => {
				set({ notifications: [], unreadCount: 0 })

				if (userId) {
					try {
						await supabase
							.from('user_notifications')
							.delete()
							.eq('user_id', userId)
					} catch (err) {
						console.error('Erro ao apagar notificações no Supabase:', err)
					}
				}
			},
		}),
		{
			name: 'gitprofile-notifications',
		},
	),
)
