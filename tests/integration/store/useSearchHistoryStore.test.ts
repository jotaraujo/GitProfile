import { describe, it, expect, beforeEach } from 'vitest'
import { useSearchHistoryStore } from '../../../src/store/useSearchHistoryStore'

describe('useSearchHistoryStore', () => {
  beforeEach(() => {
    const store = useSearchHistoryStore.getState()
    store.history.forEach(h => store.removeSearch(h.username))
  })

  it('should add a search', async () => {
    const store = useSearchHistoryStore.getState()
    await store.addSearch('octocat', 'https://github.com/octocat.png')

    const state = useSearchHistoryStore.getState()
    expect(state.history.length).toBeGreaterThanOrEqual(1)
  })

  it('should remove a search', async () => {
    const store = useSearchHistoryStore.getState()
    await store.addSearch('octocat', 'https://github.com/octocat.png')
    await store.removeSearch('octocat')

    const state = useSearchHistoryStore.getState()
    expect(state.history.find(h => h.username === 'octocat')).toBeUndefined()
  })

  it('should clear history', async () => {
    const store = useSearchHistoryStore.getState()
    await store.addSearch('octocat', 'https://github.com/octocat.png')
    await store.clearHistory()

    const state = useSearchHistoryStore.getState()
    expect(state.history).toEqual([])
  })
})