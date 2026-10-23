import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Header from '../../../src/components/layout/Header'
import React from 'react'

vi.mock('@/assets/logo.svg?react', () => ({
	default: () => React.createElement('div', { 'data-testid': 'logo-mock' }),
}))

describe('Header', () => {
	it('renders navigation header', () => {
		render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		)
		expect(screen.getByRole('banner')).toBeInTheDocument()
	})
})
