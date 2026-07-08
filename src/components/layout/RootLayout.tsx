import Header from './Header'
import { Outlet } from 'react-router-dom'

// Layout Raiz (RootLayout): Serve como template estrutural contendo o Header fixo
// e renderizando a página correspondente à rota através do <Outlet />
const RootLayout = () => {
	return (
		<div className="min-h-screen flex flex-col bg-base">
			{/* Cabeçalho global fixado no topo */}
			<Header />

			{/* Área principal do conteúdo que renderiza as sub-rotas */}
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	)
}

export default RootLayout
