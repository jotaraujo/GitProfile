import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import Profile from './pages/Profile'
import RootLayout from './components/layout/RootLayout'
import CandidatesDashboard from './pages/CandidatesDashboard'
import useAuthListener from './hooks/useAuthListener'
import Login from './pages/Login'
import CompleteProfile from './pages/CompleteProfile'
import History from './pages/History'
import Saved from './pages/Saved'

// Definição das rotas da aplicação usando o createBrowserRouter
const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />, // Layout pai que envelopa todas as páginas (contém o Header)
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/', // Rota inicial (página de busca de usuários)
				element: <Home />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/profile/:username', // Rota de perfil dinâmico com base no login do GitHub
				element: <Profile />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/candidates',
				element: <CandidatesDashboard />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/login',
				element: <Login />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/complete-profile',
				element: <CompleteProfile />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/history',
				element: <History />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/saved',
				element: <Saved />,
				errorElement: <ErrorPage />,
			},
		],
	},
])

const App = () => {
	useAuthListener()

	// Provedor de rotas que expõe a estrutura definida para toda a aplicação
	return <RouterProvider router={router} />
}

export default App
