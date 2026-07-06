import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Bell, Plus } from 'lucide-react'
import Logo from '../../assets/logo.svg?react'

// Componente Header: Barra de navegação global exibida no topo da aplicação
const Header = () => {
	const { user, logout } = useAuthStore()

	return (
		<header className="navbar bg-surface border-b border-outline sticky top-0 z-50">
			{/* LOGO: Link de retorno para a Home */}
			<div className="navbar-start px-6">
				<Link to="/" className="flex items-center gap-2">
					<Logo className="w-8 h-12 rounded-full" />
					<span className="text-xl font-sans font-bold text-main">
						GitProfile
					</span>
				</Link>
			</div>

			{/* MENU DE NAVEGAÇÃO: Links auxiliares (ocultos em dispositivos móveis) */}
			<div className="navbar-center hidden lg:flex">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link
							to=""
							className="border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main"
						>
							Explore
						</Link>
					</li>
					<li>
						<Link
							to=""
							className="border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main"
						>
							Repositories
						</Link>
					</li>
					<li>
						<Link
							to=""
							className="border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main"
						>
							Pull Requests
						</Link>
					</li>
					<li>
						<Link
							to=""
							className="border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main"
						>
							Issues
						</Link>
					</li>
				</ul>
			</div>

			{/* PAINEL DO USUÁRIO / AUTENTICAÇÃO */}
			<div className="navbar-end gap-3 px-6">
				{user ? (
					<>
						{/* Botões de Ações Rápidas (Apenas Usuário Logado) */}
						<button className="btn btn-ghost btn-circle btn-sm text-main">
							<Bell size={20}></Bell>
						</button>
						<button className="btn btn-ghost btn-circle btn-sm text-main">
							<Plus size={20}></Plus>
						</button>

						{/* Menu Dropdown de Opções e Logout */}
						<details className="dropdown dropdown-end">
							<summary className="btn btn-ghost btn-circle avatar">
								<div className="w-8 rounded-full border border-outline-variant">
									<img
										src={user.avatar_url || 'https://github.com/github.png'}
										alt={`${user ? `avatar de ${user.email}` : ''}`}
									/>
								</div>
							</summary>
							<ul className="menu dropdown-content bg-surface border border-outline rounded-box z-10 w-52 p-2 shadow-xl">
								<li>
									<button
										className="btn btn-outline btn-secondary btn-sm"
										onClick={logout}
									>
										Sair
									</button>
								</li>
							</ul>
						</details>
					</>
				) : (
					<>
						{/* Links para Visitantes (Entrar / Cadastrar-se) */}
						<Link
							to="/login"
							className="btn btn-ghost btn-sm text-main rounded-full hover:bg-primary"
						>
							Entrar
						</Link>
						<Link
							to="/register"
							className="btn btn-secondary btn-sm rounded-full"
						>
							Cadastre-se
						</Link>
					</>
				)}
			</div>
		</header>
	)
}

export default Header
