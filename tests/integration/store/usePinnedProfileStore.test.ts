import { describe, it, expect, beforeEach } from 'vitest'
import { usePinnedProfileStore } from '../../../src/store/usePinnedProfileStore'

describe('usePinnedProfileStore', () => {
  beforeEach(() => {
    const state = usePinnedProfileStore.getState()
    state.pinned.forEach(p => state.unpinProfile(p.login))
  })

  it('should pin a profile', () => {
    const store = usePinnedProfileStore.getState()
    store.pinProfile({
      login: 'octocat',
      name: 'Octocat',
      avatar_url: 'https://github.com/octocat.png',
      bio: 'Mascot',
      pinnedAt: '2024-01-01',
    })

    const state = usePinnedProfileStore.getState()
    expect(state.pinned.length).toBeGreaterThanOrEqual(1)
    expect(state.isPinned('octocat')).toBe(true)
  })

  it('should unpin a profile', () => {
    const store = usePinnedProfileStore.getState()
    store.pinProfile({
      login: 'octocat',
      name: 'Octocat',
      avatar_url: 'https://github.com/octocat.png',
      bio: 'Mascot',
      pinnedAt: '2024-01-01',
    })
    store.unpinProfile('octocat')

    const state = usePinnedProfileStore.getState()
    expect(state.isPinned('octocat')).toBe(false)
  })

  it('should check if profile is pinned', () => {
    const store = usePinnedProfileStore.getState()
    expect(store.isPinned('octocat')).toBe(false)

    store.pinProfile({
      login: 'octocat',
      name: 'Octocat',
      avatar_url: 'https://github.com/octocat.png',
      bio: 'Mascot',
      pinnedAt: '2024-01-01',
    })

    expect(usePinnedProfileStore.getState().isPinned('octocat')).toBe(true)
  })

  it('should limit pinned profiles to 4', () => {
    const store = usePinnedProfileStore.getState()
    for (let i = 1; i <= 5; i++) {
      store.pinProfile({
        login: `user${i}`,
        name: `User ${i}`,
        avatar_url: `https://github.com/user${i}.png`,
        bio: '',
        pinnedAt: '2024-01-01',
      })
    }

    const state = usePinnedProfileStore.getState()
    expect(state.pinned.length).toBeLessThanOrEqual(4)
  })
})