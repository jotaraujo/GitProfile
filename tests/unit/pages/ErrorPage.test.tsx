// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import ErrorPage from '../../../src/pages/ErrorPage'

vi.mock('react-router-dom', async () => {
	const actual =
		await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
	return {
		...actual,
		useRouteError: vi.fn(),
		isRouteErrorResponse: vi.fn(),
	}
})

import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

describe('ErrorPage Component', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	afterEach(() => {
		cleanup()
	})
	it('deve renderizar o erro 404 de página não encontrada corretamente', () => {
		vi.mocked(isRouteErrorResponse).mockReturnValue(true)
		vi.mocked(useRouteError).mockReturnValue({
			status: 404,
			statusText: 'Not Found',
			data: 'No route matches URL "/rota-invalida"',
		})

		render(
			<BrowserRouter>
				<ErrorPage />
			</BrowserRouter>,
		)

		expect(screen.getByText('Página não encontrada')).toBeTruthy()
		expect(
			screen.getByText('A página que você procura não existe.'),
		).toBeTruthy()
		expect(screen.getByText('Voltar para Página Inicial')).toBeTruthy()
	})

	it('deve renderizar o erro 403 de acesso negado corretamente', () => {
		vi.mocked(isRouteErrorResponse).mockReturnValue(true)
		vi.mocked(useRouteError).mockReturnValue({
			status: 403,
			statusText: 'Forbidden',
			data: 'Forbidden',
		})

		render(
			<BrowserRouter>
				<ErrorPage />
			</BrowserRouter>,
		)

		expect(screen.getByText('Acesso negado')).toBeTruthy()
		expect(
			screen.getByText('Você não tem permissão para acessar esta página.'),
		).toBeTruthy()
		expect(screen.getByText('Voltar para Página Inicial')).toBeTruthy()
	})

	it('deve renderizar erro convencional de JavaScript corretamente', () => {
		// 1. Configuramos os mocks para simular um erro JS nativo
		vi.mocked(isRouteErrorResponse).mockReturnValue(false)
		vi.mocked(useRouteError).mockReturnValue(
			new Error('Erro de teste catastrófico'),
		)
		render(
			<BrowserRouter>
				<ErrorPage />
			</BrowserRouter>,
		)
		// 2. Verificamos se o nome do erro (Error) e a mensagem aparecem na tela
		expect(screen.getByText(/error/i)).toBeTruthy()
		expect(screen.getByText(/erro de teste catastrófico/i)).toBeTruthy()
		expect(screen.getByText(/voltar para página inicial/i)).toBeTruthy()
	})
})
