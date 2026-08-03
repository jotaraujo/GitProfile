import {
	AlertCircle,
	Bell,
	Keyboard,
	LogOut,
	Menu,
	Search,
	Settings,
	User,
	X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Logo from '../../assets/logo.svg?react'
import { useAuthStore } from '../../store/useAuthStore'
import { useNotificationStore } from '../../store/useNotificationStore'
import { useShortcutsStore } from '../../store/useShortcutsStore'
import AccountSettingsModal from '../modals/AccountSettingsModal'
import ShortcutsModal from '../modals/ShortcutsModal'
import IconButton from '../ui/IconButton'
import NotificationPopover from './NotificationPopover'

const searchSchema = z
	.string()
	.min(1, 'Username não pode ser vazio.')
	.max(39, 'Username não pode exceder 39 caracteres.')
	.regex(
		/^[a-zA-Z0-9]+$/,
		'Username deve conter apenas letras, números e hífens.',
	)

const isMac =
	typeof navigator !== 'undefined' &&
	/Mac|iPhone|iPad/.test(navigator.userAgent)

// Header: barra de navegação global. Nav N13 — search pill ⌘K inline.
const Header = () => {
	const { user, profile, signOut } = useAuthStore()
	const { searchShortcut } = useShortcutsStore()
	const { unreadCount, fetchNotifications } = useNotificationStore()
	const navigate = useNavigate()

	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchError, setSearchError] = useState<string | null>(null)
	const [isSettingOpen, setIsSettingOpen] = useState(false)
	const [isShortcutOpen, setIsShortcutOpen] = useState(false)
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const dropdownRef = useRef<HTMLDetailsElement>(null)
	const mobileMenuRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (user?.id) {
			fetchNotifications(user.id)
		}
	}, [user?.id, fetchNotifications])

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
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(e.target as Node)
			) {
				setIsMobileMenuOpen(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		document.addEventListener('click', handleClickOutside)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('click', handleClickOutside)
		}
	}, [searchShortcut])

	// Trava o scroll do body quando o menu mobile ou a busca estão abertos
	useEffect(() => {
		document.body.style.overflow =
			isMobileMenuOpen || isSearchOpen ? 'hidden' : ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [isMobileMenuOpen, isSearchOpen])

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

	const navLinks = (
		<>
			{profile?.user_type === 'developer' && (
				<>
					<NavLink
						to="/history"
						className={({ isActive }) =>
							`text-sm font-medium transition-colors duration-200 ${
								isActive ? 'text-primary' : 'text-main hover:text-primary'
							}`
						}
					>
						Histórico
					</NavLink>
					<NavLink
						to="/saved"
						className={({ isActive }) =>
							`text-sm font-medium transition-colors duration-200 ${
								isActive ? 'text-primary' : 'text-main hover:text-primary'
							}`
						}
					>
						Favoritos
					</NavLink>
				</>
			)}
			{profile?.user_type === 'recruiter' && (
				<>
					<NavLink
						to="/history"
						className={({ isActive }) =>
							`text-sm font-medium transition-colors duration-200 ${
								isActive ? 'text-primary' : 'text-main hover:text-primary'
							}`
						}
					>
						Histórico
					</NavLink>
					<NavLink
						to="/candidates"
						className={({ isActive }) =>
							`text-sm font-medium transition-colors duration-200 ${
								isActive ? 'text-primary' : 'text-main hover:text-primary'
							}`
						}
					>
						Candidatos Salvos
					</NavLink>
				</>
			)}
		</>
	)

	const userMenuItems = (
		<>
			{/* Meu Perfil GitHub (visível se for Desenvolvedor e tiver github_username) */}
			{profile?.user_type === 'developer' && profile?.github_username && (
				<li>
					<NavLink
						to={`/profile/${profile.github_username}`}
						className="text-sm text-main hover:bg-bright flex items-center gap-2 cursor-pointer"
					>
						<User size={16} className="text-primary-variant" />
						<span>Meu Perfil</span>
					</NavLink>
				</li>
			)}

			{/* Configurações da conta */}
			<li>
				<button
					type="button"
					onClick={() => {
						setIsSettingOpen(true)
						setIsMobileMenuOpen(false)
					}}
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
					onClick={() => {
						setIsShortcutOpen(true)
						setIsMobileMenuOpen(false)
					}}
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
		</>
	)

	return (
		<header className="navbar bg-surface border-b border-outline sticky top-0 z-50">
			{/* LOGO: Link de retorno para a Home */}
			<div className="navbar-start px-6">
				<Link to="/" className="flex items-center gap-2">
					<Logo className="w-8 h-12 rounded-full" />
					<span className="text-xl font-sans font-bold text-main tracking-tight">
						GitProfile
					</span>
				</Link>
			</div>

			{/* SEARCH PILL (N13) — visível em telas lg+ */}
			<div className="navbar-center hidden lg:flex justify-center">
				<button
					type="button"
					onClick={() => setIsSearchOpen(true)}
					className="searchpill w-full max-w-sm text-left"
					aria-label="Buscar usuário no GitHub"
				>
					<Search size={16} aria-hidden="true" />
					<span className="text-sm">Buscar usuário no GitHub…</span>
					<span className="ml-auto">
						{isMac ? <kbd>⌘K</kbd> : <kbd>Ctrl K</kbd>}
					</span>
				</button>
			</div>

			{/* PAINEL DO USUÁRIO / AUTENTICAÇÃO */}
			<div className="navbar-end gap-1 md:gap-3 px-6">
				{/* Navegação — desktop */}
				{user && profile && (
					<div className="hidden lg:flex items-center gap-6 mr-2">
						{navLinks}
					</div>
				)}

				{/* Botão de busca — mobile */}
				<IconButton
					icon={<Search size={20} />}
					onClick={() => setIsSearchOpen(true)}
					tooltip="Abrir busca rápida"
					aria-label="Abrir busca rápida"
					className="lg:hidden"
				/>

				{user ? (
					<>
						{/* Notificações */}
						<div className="relative hidden sm:block">
							<IconButton
								icon={<Bell size={20} />}
								badge={unreadCount}
								onClick={() => setIsNotificationsOpen((prev) => !prev)}
								tooltip="Notificações"
							/>
							<NotificationPopover
								isOpen={isNotificationsOpen}
								onClose={() => setIsNotificationsOpen(false)}
							/>
						</div>

						{/* Menu Dropdown de Opções e Logout */}
						<details
							ref={dropdownRef}
							className="dropdown dropdown-end hidden sm:block"
						>
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
								{userMenuItems}
							</ul>
						</details>

						{/* Hamburger — menu mobile */}
						<IconButton
							icon={<Menu size={20} />}
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							tooltip="Menu"
							aria-label="Abrir menu"
							className="lg:hidden"
						/>
					</>
				) : (
					<>
						{/* Links para Visitantes (Entrar / Cadastrar-se) */}
						<Link
							to="/login"
							className="btn btn-ghost btn-sm text-main rounded-full hover:bg-primary transition-colors duration-200"
						>
							Entrar
						</Link>
						<Link
							to="/login?mode=register"
							className="btn btn-secondary btn-sm rounded-full transition-colors duration-200"
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
						<button
							type="button"
							onClick={() => {
								setIsSearchOpen(false)
								setSearchError(null)
							}}
							className="btn btn-sm btn-circle absolute right-3 top-2 border-none bg-transparent hover:bg-surface text-muted hover:text-main transition-colors duration-200 cursor-pointer"
						>
							<X size={16} />
						</button>

						<h2
							id="search-modal-title"
							className="text-lg font-semibold text-main font-sans pb-5"
						>
							Busca Rápida
						</h2>

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

							{searchError && (
								<span className="text-xs text-error font-sans flex items-center gap-1">
									<AlertCircle size={14} />
									{searchError}
								</span>
							)}

							<button
								type="submit"
								className="btn btn-primary w-full text-sm font-sans rounded-lg mt-2 transition-colors duration-200 cursor-pointer"
							>
								Pesquisar Perfil
							</button>
						</form>
					</div>

					<div
						onClick={() => {
							setIsSearchOpen(false)
							setSearchError(null)
						}}
						className="modal-backdrop bg-black/60 backdrop-blur-sm"
					/>
				</div>
			)}

			{/* Drawer mobile */}
			{isMobileMenuOpen && (
				<div
					ref={mobileMenuRef}
					className="fixed inset-y-0 right-0 z-[100] w-72 max-w-[85vw] bg-surface border-l border-outline shadow-2xl flex flex-col"
				>
					<div className="flex items-center justify-between px-5 py-4 border-b border-outline">
						<span className="text-sm font-semibold text-main">Menu</span>
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(false)}
							className="btn btn-ghost btn-circle btn-sm text-muted hover:text-main transition-colors duration-200 cursor-pointer"
							aria-label="Fechar menu"
						>
							<X size={18} />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1">
						{user && (
							<div className="flex items-center gap-3 pb-4 mb-2 border-b border-outline">
								<div className="w-9 rounded-full border border-outline-variant">
									<img
										src={
											user.user_metadata?.avatar_url ||
											'https://github.com/github.png'
										}
										alt=""
										className="rounded-full"
									/>
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium text-main truncate">
										{user.email}
									</p>
									<span className="badge badge-primary badge-outline text-[10px] uppercase font-mono mt-0.5">
										{profile?.user_type === 'developer'
											? 'Desenvolvedor'
											: 'Recrutador'}
									</span>
								</div>
							</div>
						)}

						{user && profile ? (
							<>
								<span className="micro-label text-muted mb-1">Navegação</span>
								<div className="flex flex-col gap-1">{navLinks}</div>

								<span className="micro-label text-muted mt-5 mb-1">Conta</span>
								<ul className="menu bg-transparent p-0">{userMenuItems}</ul>
							</>
						) : (
							<div className="flex flex-col gap-3 mt-2">
								<Link
									to="/login"
									onClick={() => setIsMobileMenuOpen(false)}
									className="btn btn-primary btn-sm rounded-full transition-colors duration-200"
								>
									Entrar
								</Link>
								<Link
									to="/login?mode=register"
									onClick={() => setIsMobileMenuOpen(false)}
									className="btn btn-outline btn-sm border-outline rounded-full transition-colors duration-200"
								>
									Cadastre-se
								</Link>
							</div>
						)}
					</div>
				</div>
			)}

			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
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
