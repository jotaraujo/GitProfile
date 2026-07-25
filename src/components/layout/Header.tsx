import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
	Bell,
	Plus,
	Search,
	AlertCircle,
	X,
	User,
	Settings,
	Keyboard,
	LogOut,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useShortcutsStore } from '../../store/useShortcutsStore'
import AccountSettingsModal from '../modals/AccountSettingsModal'
import ShortcutsModal from '../modals/ShortcutsModal'
import { z } from 'zod'
import Logo from '../../assets/logo.svg?react'

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
	const { searchShortcut } = useShortcutsStore()
	const navigate = useNavigate()

	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchError, setSearchError] = useState<string | null>(null)
	const [isSettingOpen, setIsSettingOpen] = useState(false)
	const [isShortcutOpen, setIsShortcutOpen] = useState(false)

	const dropdownRef = useRef<HTMLDetailsElement>(null)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const hasModifier = searchShortcut.ctrlKey ? e.ctrlKey || e.metaKey : true

			if (hasModifier && e.key.toLowerCase() === searchShortcut.key) {
				e.preventDefault()
				setIsSearchOpen(true)
			}
		}

		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				dropdownRef.current.removeAttribute('open')
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		document.addEventListener('click', handleClickOutside)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('click', handleClickOutside)
		}
	}, [searchShortcut])

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
						<details ref={dropdownRef} className="dropdown dropdown-end">
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
							<ul className="menu dropdown-content bg-surface border border-outline rounded-box z-10 w-64 p-2 shadow-xl">
								{/* Cabeçalho de Identificação (E-mail + Badge do Perfil) */}
								<li className="px-3 py-2 border-b border-outline/50 flex flex-col gap-0.5 pointer-events-none">
									<span className="text-xs font-mono text-muted truncate">
										{user.email}
									</span>
									<span className="badge badge-primary badge-outline text-[10px] uppercase font-mono w-fit mt-1">
										{profile?.user_type === 'developer'
											? 'Desenvolvedor'
											: 'Recrutador'}
									</span>
								</li>

								{/* Meu Perfil GitHub (visível se for Desenvolvedor e tiver github_username) */}
								{profile?.user_type === 'developer' &&
									profile?.github_username && (
										<li>
											<Link
												to={`/profile/${profile.github_username}`}
												className="text-sm text-main hover:bg-bright flex items-center gap-2 cursor-pointer"
											>
												<User size={16} className="text-primary-variant" />
												<span>Meu Perfil</span>
											</Link>
										</li>
									)}

								{/* Configurações da conta */}
								<li>
									<button
										type="button"
										onClick={() => setIsSettingOpen(true)}
										className="text-sm text-main hover:bg-bright flex items-center gap-2 w-full text-left cursor-pointer"
									>
										<Settings size={16} className="text-primary-variant" />
										<span>Configurações da conta</span>
									</button>
								</li>

								{/* Atalhos do Teclado */}
								<li>
									<button
										type="button"
										onClick={() => setIsShortcutOpen(true)}
										className="text-sm text-main hover:bg-bright flex items-center gap-2 w-full text-left cursor-pointer"
									>
										<Keyboard size={16} className="text-muted" />
										<span>Atalhos do Teclado</span>
									</button>
								</li>

								{/* Logout */}
								<li className="border-t border-outline/50 mt-1 pt-1">
									<button
										type="button"
										onClick={signOut}
										className="text-sm text-error hover:bg-error/10 flex items-center gap-2 w-full text-left cursor-pointer"
									>
										<LogOut size={16} />
										<span>Sair</span>
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
			<AccountSettingsModal
				isOpen={isSettingOpen}
				onClose={() => setIsSettingOpen(false)}
			/>
			<ShortcutsModal
				isOpen={isShortcutOpen}
				onClose={() => setIsShortcutOpen(false)}
			/>
		</header>
	)
}

export default Header
