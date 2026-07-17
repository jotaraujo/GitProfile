import { useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import Header from './Header'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

// Layout Raiz (RootLayout): Serve como template estrutural contendo o Header fixo
// e renderizando a página correspondente à rota através do <Outlet />
const RootLayout = () => {
	const { user, profile, loading } = useAuthStore()
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (
			!loading &&
			user &&
			!profile &&
			location.pathname !== '/complete-profile'
		) {
			navigate('/complete-profile')
		}
	}, [user, profile, loading, navigate, location.pathname])

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
