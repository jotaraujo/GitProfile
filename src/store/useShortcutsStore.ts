import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Shortcut {
	key: string
	ctrlKey: boolean
}

export interface ShortcutState {
	searchShortcut: Shortcut
	setSearchShortcut: (shortcut: Shortcut) => void
	resetShortcuts: () => void
}

const DEFAULT_SHORTCUT: Shortcut = {
	key: 'k',
	ctrlKey: true,
}

export const useShortcutsStore = create<ShortcutState>()(
	persist(
		(set) => ({
			searchShortcut: DEFAULT_SHORTCUT,
			setSearchShortcut: (shortcut) => set({ searchShortcut: shortcut }),

			resetShortcuts: () => set({ searchShortcut: DEFAULT_SHORTCUT }),
		}),
		{
			name: 'gitprofile-shortcuts',
		},
	),
)
