import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Bell, Plus, Search, AlertCircle, X } from 'lucide-react'
import Logo from '../../assets/logo.svg?react'
import { z } from 'zod'
import { useState } from 'react'

const searchSchema = z
	.string()
	.min(1, 'Username não pode ser vazio.')
	.max(39, 'Username não pode exceder 39 caracteres.')
	.regex(
		/^[a-zA-Z0-9]+$/,
		'Username deve conter apenas letras, números e hífens.',
	)

// Componente Header: Barra de navegação global exibida no topo da aplicação
const Header = () => {
	const { user, profile, signOut } = useAuthStore()
	const navigate = useNavigate()

	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchError, setSearchError] = useState<string | null>(null)

	const handleSearchSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		setSearchError(null)

		const result = searchSchema.safeParse(searchQuery.trim())

		if (!result.success) {
			setSearchError(result.error.issues[0].message)
			return
		}

		const username = result.data
		setSearchQuery('')
		setIsSearchOpen(false)

		navigate(`/profile/${username}`)
	}

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
				{user && profile && (
					<ul className="menu menu-horizontal px-1">
						{profile.user_type === 'developer' && (
							<>
								<li>
									<Link
										to="/history"
										className="text-main font-semibold border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200"
									>
										Histórico
									</Link>
								</li>
								<li>
									<Link
										to="/saved"
										className="text-main font-semibold border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200"
									>
										Favoritos
									</Link>
								</li>
							</>
						)}

						{profile.user_type === 'recruiter' && (
							<>
								<li>
									<Link
										to="/history"
										className="text-main font-semibold border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200"
									>
										Histórico
									</Link>
								</li>
								<li>
									<Link
										to="/candidates"
										className="text-main font-semibold border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200"
									>
										Candidatos Salvos
									</Link>
								</li>
							</>
						)}
					</ul>
				)}
			</div>

			{/* PAINEL DO USUÁRIO / AUTENTICAÇÃO */}
			<div className="navbar-end gap-3 px-6">
				{/* Botão de busca rápida */}
				<button
					type="button"
					onClick={() => setIsSearchOpen(true)}
					className="btn btn-ghost btn-circle btn-sm text-sm hover:bg-bright"
					aria-label="Abrir busca rápida"
				>
					<Search size={20} />
				</button>

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
										src={
											user.user_metadata?.avatar_url ||
											'https://github.com/github.png'
										}
										alt={`${user ? `avatar de ${user.email}` : ''}`}
									/>
								</div>
							</summary>
							<ul className="menu dropdown-content bg-surface border border-outline rounded-box z-10 w-52 p-2 shadow-xl">
								<li>
									<button
										className="btn btn-outline btn-secondary btn-sm"
										onClick={signOut}
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
							to="/login?mode=register"
							className="btn btn-secondary btn-sm rounded-full"
						>
							Cadastre-se
						</Link>
					</>
				)}
			</div>

			{/* Modal suspenso de busca rápida */}
			{isSearchOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="search-modal-title"
					className="modal modal-open"
				>
					<div className="modal-box bg-surface border border-outline rounded-lg max-w-md relative p-6 flex-col gap-4 shadow-2xl">
						{/* Botão de fechar */}
						<button
							type="button"
							onClick={() => {
								setIsSearchOpen(false)
								setSearchError(null)
							}}
							className="btn btn-sm btn-circle absolute right-3 top-2 border-none bg-transparent hover:bg-surface text-muted hover:text-main cursor-pointer"
						>
							<X size={16} />
						</button>

						<h2
							id="search-modal-title"
							className="text-lg font-semibold text-main font-sans pb-5"
						>
							Busca Rápida
						</h2>

						{/* Formulário de busca */}
						<form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
							<div className="form-control w-full">
								<div className="relative flex items-center">
									<Search
										size={18}
										className="absolute left-3 text-muted pointer-events-none z-10"
									/>
									<input
										type="text"
										onChange={({ target }) => setSearchQuery(target.value)}
										placeholder="Digite o username"
										className="input input-bordered text-sm font-sans w-full bg-base text-main border-outline focus-visible:border-primary focus:outline-none rounded-lg pl-10 pr-4"
										value={searchQuery}
										spellCheck={false}
										required
										autoFocus
									/>
								</div>
							</div>

							{/* Alerta de erro de validação */}
							{searchError && (
								<span className="text-xs text-error font-sans flex items-center gap-1">
									<AlertCircle size={14} />
									{searchError}
								</span>
							)}

							<button
								type="submit"
								className="btn btn-primary w-full text-sm font-sans rounded-lg mt-2 cursor-pointer"
							>
								Pesquisar Perfil
							</button>
						</form>
					</div>

					{/* Fundo escuro desfocado */}
					<div
						onClick={() => {
							setIsSearchOpen(false)
							setSearchError(null)
						}}
						className="modal-backdrop bg-black/60 backdrop-blur-sm"
					/>
				</div>
			)}
		</header>
	)
}

export default Header
