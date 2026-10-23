import { describe, it, expect, beforeEach } from 'vitest'
import { useShortcutsStore } from '../../../src/store/useShortcutsStore'

describe('useShortcutsStore', () => {
  beforeEach(() => {
    useShortcutsStore.getState().resetShortcuts()
  })

  it('should set a new shortcut', () => {
    const store = useShortcutsStore.getState()
    store.setSearchShortcut({ key: 'f', ctrlKey: false })

    const state = useShortcutsStore.getState()
    expect(state.searchShortcut.key).toBe('f')
    expect(state.searchShortcut.ctrlKey).toBe(false)
  })

  it('should reset shortcuts', () => {
    const store = useShortcutsStore.getState()
    store.setSearchShortcut({ key: 'f', ctrlKey: false })
    store.resetShortcuts()

    const state = useShortcutsStore.getState()
    expect(state.searchShortcut.key).toBe('k')
    expect(state.searchShortcut.ctrlKey).toBe(true)
  })
})