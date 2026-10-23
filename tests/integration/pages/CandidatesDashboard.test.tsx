import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CandidatesDashboard from '../../../src/pages/CandidatesDashboard'
import { MemoryRouter } from 'react-router-dom'

describe('CandidatesDashboard Page', () => {
	it('renders dashboard title', () => {
		render(
			<MemoryRouter>
				<CandidatesDashboard />
			</MemoryRouter>,
		)
		expect(screen.getByText(/Painel do Recrutador/i)).toBeInTheDocument()
	})
})
