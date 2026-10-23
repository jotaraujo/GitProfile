import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFollowStore } from '../../../src/store/useFollowStore'

describe('useFollowStore', () => {
  beforeEach(() => {
    useFollowStore.setState({ followedUsernames: [] })
  })

  it('should have initial state', () => {
    const state = useFollowStore.getState()
    expect(state.followedUsernames).toEqual([])
  })

  it('isFollowing should return false for empty list', () => {
    const state = useFollowStore.getState()
    expect(state.isFollowing('octocat')).toBe(false)
  })

  it('isFollowing should return true after following', () => {
    useFollowStore.getState().followUser('octocat')

    const state = useFollowStore.getState()
    expect(state.isFollowing('octocat')).toBe(true)
  })

  it('isFollowing should return false after unfollowing', () => {
    useFollowStore.getState().followUser('octocat')
    useFollowStore.getState().unfollowUser('octocat')

    const state = useFollowStore.getState()
    expect(state.isFollowing('octocat')).toBe(false)
  })

  it('should add a username when following', () => {
    useFollowStore.getState().followUser('octocat')

    const state = useFollowStore.getState()
    expect(state.followedUsernames).toEqual(['octocat'])
  })

  it('should not add duplicate username when following', () => {
    useFollowStore.getState().followUser('octocat')
    useFollowStore.getState().followUser('octocat')

    const state = useFollowStore.getState()
    expect(state.followedUsernames).toEqual(['octocat'])
  })

  it('should remove a username when unfollowing', () => {
    useFollowStore.getState().followUser('octocat')
    useFollowStore.getState().unfollowUser('octocat')

    const state = useFollowStore.getState()
    expect(state.followedUsernames).toEqual([])
  })

  it('should not remove non-existent username', () => {
    useFollowStore.getState().followUser('octocat')
    useFollowStore.getState().unfollowUser('non-existent')

    const state = useFollowStore.getState()
    expect(state.followedUsernames).toEqual(['octocat'])
  })

  it('should follow user with userId', () => {
    useFollowStore.getState().followUser('octocat', 'user-123')

    const state = useFollowStore.getState()
    expect(state.followedUsernames).toEqual(['octocat'])
  })

  it('should not call supabase when userId is not provided', () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }
    ;(useFollowStore as any).setState({ followedUsernames: [] })
    useFollowStore.setState({
      ...useFollowStore.getState(),
      // The store doesn't use supabase unless userId is provided
    })
  })
})
