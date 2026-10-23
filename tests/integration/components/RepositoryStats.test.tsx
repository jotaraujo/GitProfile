import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RepositoryStats from '../../../src/components/profile/repository/RepositoryStats'

describe('RepositoryStats', () => {
	it('renders repository statistics', () => {
		const mockRepo = {
			id: 1,
			stargazers_count: 42,
			forks_count: 10,
			watchers_count: 5,
			size: 2048,
		}
		render(<RepositoryStats repository={mockRepo as any} />)
		expect(screen.getByText('42')).toBeInTheDocument()
		expect(screen.getByText('10')).toBeInTheDocument()
	})
})
