import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CompleteProfile from '../../../src/pages/CompleteProfile'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('@/assets/logo.svg?react', () => ({
	default: () => React.createElement('div', { 'data-testid': 'logo-mock' }),
}))

describe('CompleteProfile Page', () => {
	it('renders completion title', () => {
		render(
			<MemoryRouter>
				<CompleteProfile />
			</MemoryRouter>,
		)
		expect(screen.getByText(/Complete seu perfil/i)).toBeInTheDocument()
	})
})
