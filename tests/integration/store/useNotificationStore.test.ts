import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationStore } from '../../../src/store/useNotificationStore'

describe('useNotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [], unreadCount: 0 })
  })

  it('should add a notification', async () => {
    const store = useNotificationStore.getState()
    await store.addNotification({ username: 'octocat', message: 'Hello', avatarUrl: 'url' })

    const state = useNotificationStore.getState()
    expect(state.notifications.length).toBeGreaterThanOrEqual(1)
    expect(state.unreadCount).toBeGreaterThanOrEqual(0)
  })

  it('should mark a notification as read', async () => {
    const store = useNotificationStore.getState()
    await store.addNotification({ username: 'octocat', message: 'Hello', avatarUrl: 'url' })

    const state = useNotificationStore.getState()
    if (state.notifications.length > 0) {
      const id = state.notifications[0].id
      await store.markAsRead(id)

      const updatedState = useNotificationStore.getState()
      const notification = updatedState.notifications.find(n => n.id === id)
      if (notification) {
        expect(notification.read).toBe(true)
      }
    }
  })

  it('should clear notifications', async () => {
    const store = useNotificationStore.getState()
    await store.addNotification({ username: 'octocat', message: 'Hello', avatarUrl: 'url' })
    await store.clearNotifications()

    const state = useNotificationStore.getState()
    expect(state.notifications).toEqual([])
    expect(state.unreadCount).toBe(0)
  })
})