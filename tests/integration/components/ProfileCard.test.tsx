import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProfileCard from '../../../src/components/profile/ProfileCard'
import { MemoryRouter } from 'react-router-dom'

describe('ProfileCard', () => {
	it('renders profile information', () => {
		const mockUser = {
			login: 'testuser',
			name: 'Test User',
			avatar_url: 'https://example.com/avatar.png',
			bio: 'Bio text',
			html_url: 'https://example.com',
			followers: 5,
			following: 3,
			public_gists: 2,
			company: 'Test Inc',
			created_at: '2023-01-01',
		}
		render(
			<MemoryRouter>
				<ProfileCard user={mockUser as any} />
			</MemoryRouter>,
		)
		expect(screen.getByText(/Test User/i)).toBeInTheDocument()
	})
})
