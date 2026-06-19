import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import Profile from './pages/Profile'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/profile/:username',
		element: <Profile />,
		errorElement: <ErrorPage />,
	},
])

const App = () => {
	return <RouterProvider router={router} />
}

export default App
