import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Criação da instância global do QueryClient para gerenciar o cache das requisições da API
const client = new QueryClient()

// Inicialização do React na tag root e injeção dos provedores globais (StrictMode e QueryClientProvider)
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<App />
		</QueryClientProvider>
	</StrictMode>,
)
