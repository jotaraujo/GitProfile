import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../../../src/store/useAuthStore'

// Mock do módulo de supabase
vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
    })
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.profile).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(false)
  })

  it('should set profile', () => {
    const profile = {
      id: '123',
      user_type: 'developer' as const,
      github_username: 'octocat',
    }

    useAuthStore.getState().setProfile(profile)

    const state = useAuthStore.getState()
    expect(state.profile).toEqual(profile)
  })

  it('should set null profile', () => {
    const profile = {
      id: '123',
      user_type: 'developer' as const,
      github_username: 'octocat',
    }

    useAuthStore.getState().setProfile(profile)
    useAuthStore.getState().setProfile(null)

    const state = useAuthStore.getState()
    expect(state.profile).toBeNull()
  })

  it('should set session', () => {
    const session = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'token',
    } as any

    useAuthStore.getState().setSession(session)

    const state = useAuthStore.getState()
    expect(state.session).toEqual(session)
    expect(state.user).toEqual(session.user)
  })

  it('should set null session and user', () => {
    const session = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'token',
    } as any

    useAuthStore.getState().setSession(session)
    useAuthStore.getState().setSession(null)

    const state = useAuthStore.getState()
    expect(state.session).toBeNull()
    expect(state.user).toBeNull()
  })

  it('should set loading state', () => {
    useAuthStore.getState().setLoading(true)

    let state = useAuthStore.getState()
    expect(state.loading).toBe(true)

    useAuthStore.getState().setLoading(false)

    state = useAuthStore.getState()
    expect(state.loading).toBe(false)
  })

  it('should sign out successfully', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ data: null, error: null })
    const { supabase } = await import('../../../src/lib/supabase')
    vi.mocked(supabase.auth.signOut).mockImplementation(mockSignOut)

    useAuthStore.setState({
      user: { id: '123' } as any,
      profile: { id: '123', user_type: 'developer' },
      session: { user: { id: '123' } } as any,
    })

    await useAuthStore.getState().signOut()

    expect(mockSignOut).toHaveBeenCalledTimes(1)
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.profile).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(false)
  })

  it('should throw error when signOut fails', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Sign out failed' },
    })
    const { supabase } = await import('../../../src/lib/supabase')
    vi.mocked(supabase.auth.signOut).mockImplementation(mockSignOut)

    await expect(useAuthStore.getState().signOut()).rejects.toThrow('Sign out failed')
  })
})
