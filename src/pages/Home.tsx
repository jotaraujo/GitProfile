import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg?react'
import { usePinnedProfileStore } from '../store/usePinnedProfileStore'
import { useSearchHistoryStore } from '../store/useSearchHistoryStore'
import type { UsernameInput } from '../validations/userSchema'
import { userSchema } from '../validations/userSchema'

const suggestions = [
	{ login: 'torvalds', avatar_url: 'https://github.com/torvalds.png' },
	{ login: 'gaeron', avatar_url: 'https://github.com/gaeron.png' },
	{ login: 'sindresorhus', avatar_url: 'https://github.com/sindresorhus.png' },
	{
		login: 'Fernanda-Kipper',
		avatar_url: 'https://github.com/Fernanda-Kipper.png',
	},
]

const Home = () => {
	// =========================================================
	// 1. CONFIGURAÇÕES & ESTADOS
	// =========================================================
	const { history, clearHistory, removeSearch } = useSearchHistoryStore() // Histórico de buscas recentes (Zustand)
	const [isFocused, setIsFocused] = useState(false) // Controla a exibição do dropdown de buscas recentes
	const [isSearchOpen, setIsSearchOpen] = useState(false) // Abre o modal de pesquisa mobile
	const navigate = useNavigate()
	const pinned = usePinnedProfileStore((state) => state.pinned) // Perfis fixados pelo usuário (Zustand)

	// Define se a seção de sugestões mostrará perfis fixados ou perfis recomendados estáticos
	const hasPinned = pinned.length > 0
	const displayTitle = hasPinned ? 'Perfis Fixados' : 'Perfis Recomendados'
	const displayList = hasPinned ? pinned : suggestions

	const inputRef = useRef<HTMLInputElement | null>(null)

	// =========================================================
	// 2. ATALHOS DE TECLADO & FORMULÁRIO (React Hook Form)
	// =========================================================

	// Atalho Ctrl+K / Cmd+K para focar automaticamente o campo de texto da busca
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()

				inputRef.current?.focus()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	// Configuração do formulário com validação Zod
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UsernameInput>({
		resolver: zodResolver(userSchema),
	})

	// =========================================================
	// 3. HANDLERS (Manipulação de Eventos)
	// =========================================================

	// Gerencia o foco do input, abrindo modal completo em telas pequenas ou apenas dropdown no desktop
	const handleInputFocus = ({ target }: React.FocusEvent<HTMLInputElement>) => {
		if (window.innerWidth < 768) {
			target.blur()
			setIsSearchOpen(true)
		} else {
			setIsFocused(true)
		}
	}

	// Executa a busca: valida o usuário digitado cruzando com histórico/sugestões e redireciona
	const onSubmit = (data: UsernameInput) => {
		if (!data.username) return
		const targetUser = data.username.trim()
		const matchedPinned = pinned.find(
			(p) => p.login.toLowerCase() === targetUser.toLowerCase(),
		)
		const matchedHistory = history.find(
			(h) => h.username.toLowerCase() === targetUser.toLowerCase(),
		)
		const matchedSuggestion = suggestions.find(
			(s) => s.login.toLowerCase() === targetUser.toLowerCase(),
		)
		const finalUser =
			matchedPinned?.login ||
			matchedHistory?.username ||
			matchedSuggestion?.login ||
			targetUser

		navigate(`/profile/${finalUser}`)
	}
	// =========================================================
	// 4. RETORNO DE RENDERIZAÇÃO
	// =========================================================
	return (
		<div className="bg-base relative min-h-[calc(100svh-64px)] w-full flex flex-col items-center justify-center p-6 gap-12 overflow-hidden">
			{/* Efeito visual de fundo: Brilho de neon radial azul */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-primary-variant/3 blur-[120px]" />
			</div>

			{/* BLOCO PRINCIPAL CENTRALIZADO */}
			<div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10">
				{/* SEÇÃO HERO */}
				<div className="text-center max-w-lg flex flex-col gap-4">
					<div className="flex flex-col md:flex-row items-center justify-center gap-3">
						<Logo className="w-16 h-16" />
						<h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-main">
							Explore Perfis do GitHub
						</h1>
					</div>
					<p className="text-muted text-sm leading-relaxed">
						Busque desenvolvedores, compare stacks tecnológicas em tempo real e
						documente triagens de forma rápida e estéticamente agradável.
					</p>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-2xl flex flex-col gap-2"
				>
					<div className="relative">
						<div className="join w-full border border-outline rounded-lg overflow-hidden focus-within:border-primary-variant transition-colors duration-200">
							<div className="relative join-item flex-1 flex items-center h-12">
								{/* sr-only: apenas para leitores de tela, ou seja, fica escondido visualmente mas é lido por leitores de tela */}
								<label htmlFor="username" className="sr-only">
									Username do GitHub
								</label>
								<input
									{...register('username')}
									ref={(e) => {
										register('username').ref(e)
										inputRef.current = e
									}}
									id="username"
									type="text"
									placeholder="Digite o usuário"
									spellCheck={false}
									autoComplete="off"
									onFocus={handleInputFocus}
									onBlur={() => setTimeout(() => setIsFocused(false), 200)}
									className="input w-full bg-surface text-main border-none pl-12 focus:outline-none rounded-none h-12"
								/>
								<span className="absolute left-4 text-muted pointer-events-none">
									<Search size={18} aria-hidden="true" />
								</span>
								<div className="absolute right-4 flex items-center gap-1 pointer-events-none select-none hidden sm:flex">
									<kbd className="kbd kbd-sm bg-bright border border-outline-variant text-muted text-xs font-mono px-1.5 py-0.5 rounded">
										Ctrl
									</kbd>
									<kbd className="kbd kbd-sm bg-bright border border-outline-variant text-muted text-xs font-mono px-1.5 py-0.5 rounded">
										K
									</kbd>
								</div>
							</div>

							<button
								type="submit"
								className="btn btn-primary join-item px-8 rounded-none border-none h-12"
							>
								Buscar
							</button>
						</div>
						{/* Dropdown de histórico de buscas */}
						{isFocused && history.length > 0 && (
							<div className="absolute top-full left-0 w-full mt-2 bg-surface border border-outline rounded-lg shadow-xl z-20 overflow-hidden flex flex-col">
								{/* Cabeçalho do Dropdown */}
								<div className="flex items-center justify-between px-4 py-2 border-b border-outline bg-base/50">
									<span className="text-[10px] font-mono text-muted uppercase tracking-wider">
										Buscas Recentes
									</span>
									<button
										type="button"
										className="text-[10px] font-mono text-primary hover: text-main transition-colors cursor-pointer"
										onClick={() => clearHistory()}
									>
										Limpar Histórico
									</button>
								</div>
								{/* Aqui renderiza a lista do hitórico */}
								<div>
									{history.map((item) => (
										<div
											key={item.username}
											className="flex items-center justify-between px-4 py-2.5 hover:bg-bright transition-colors cursor-pointer group"
											onClick={() => navigate(`/profile/${item.username}`)}
										>
											<div className="flex items-center gap-3">
												<img
													src={item.avatarUrl}
													alt={`Avatar de ${item.username}`}
													className="w-6 h-6 rounded border border-outline-variant"
												/>
												<span className="text-sm text-main font-mono">
													@{item.username}
												</span>
											</div>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation()
													removeSearch(item.username)
												}}
												className="text-muted hover:text-error p-1 rounded transition-colors"
											>
												<Trash2 size={12} className="cursor-pointer" />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{errors.username && (
						<span className="text-error text-xs ml-2" role="alert">
							{errors.username.message}
						</span>
					)}

					{/* SEÇÃO DE RECOMENDAÇÕES */}
					<div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-3 mt-5 md:mt-3">
						<span className="text-muted font-mono text-xs tracking_wider uppercase">
							{displayTitle}:
						</span>
						<div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-2">
							{displayList.map((pin) => (
								<button
									key={pin.login}
									type="button"
									onClick={() => navigate(`/profile/${pin.login}`)}
									className="group flex items-center gap-2 px-1 md:px-2 py-1 md:py-2 rounded-full bg-primary-variant/10 border border-primary-variant/20 hover:bg-primary-variant/20 transition-all duration-200 cursor-pointer"
								>
									<img
										src={pin.avatar_url}
										alt={`Avatar de ${pin.login}`}
										className="w-6 h-6 rounded-full object-cover border border-outline-variant"
									/>
									<span className="text-xs font-sans text-primary group-hover:text-main transition-colors">
										@{pin.login}
									</span>
								</button>
							))}
						</div>
					</div>
				</form>
			</div>
			{/* =========================================================
			// SEÇÃO 5: SOBREPOSIÇÃO DE BUSCA MOBILE (Exibida sob foco no celular)
			// ========================================================= */}
			{isSearchOpen && (
				<div className="fixed inset-0 z-50 bg-base flex flex-col pt-16 px-6 pb-6 gap-6 md:hidden overflow-hidden">
					{/* Cabeçalho da busca */}
					<div className="flex items-center gap-2 w-full">
						<form onSubmit={handleSubmit(onSubmit)} className="flex-1">
							<div className="relative w-full">
								<input
									{...register('username')}
									type="text"
									placeholder="Digite o usuário"
									autoFocus
									spellCheck={false}
									autoComplete="off"
									className="input w-full bg-surface text-main border border-outline pl-12 pr-4 focus:outline-none focus:border-primary-variant rounded-lg h-12"
								/>
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
									<Search size={18} aria-hidden="true" />
								</span>
							</div>
						</form>
						<button
							type="button"
							onClick={() => setIsSearchOpen(false)}
							className="btn btn-ghost btn-sm text-main h-12 hover:bg-primary"
						>
							Voltar
						</button>
					</div>
					<div className="flex flex-col gap-6 mt-4 w-full">
						{/* SEÇÃO HISTÓRICO MOBILE */}
						{history.length > 0 && (
							<div className="w-full flex flex-col gap-3">
								<div className="flex items-center justify-between">
									<span className="text-muted font-mono text-xs tracking-wider uppercase">
										Buscas Recentes
									</span>
									<button
										type="button"
										onClick={() => clearHistory()}
										className="text-[10px] font-mono text-primary"
									>
										Limpar Histórico
									</button>
								</div>
								<div className="flex flex-col border border-outline rounded-lg bg-surface overflow-hidden">
									{history.map((item) => (
										<div
											key={item.username}
											className="flex items-center justify-between px-4 py-2.5"
											onClick={() => navigate(`/profile/${item.username}`)}
										>
											<div className="flex items-center gap-3">
												<img
													src={item.avatarUrl}
													alt={`Avatar de ${item.username}`}
													className="w-6 h-6 rounded border border-outline-variant"
													width={24}
													height={24}
												/>
												<span className="text-sm text-main font-mono">
													@{item.username}
												</span>
											</div>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation()
													removeSearch(item.username)
												}}
												className="text-muted hover:text-error p-1 rounded transition-colors"
											>
												<Trash2 size={12} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
						<div className="w-full flex flex-col md:flex-row items-center gap-3 md:mt-3">
							<span className="text-muted font-mono text-xs tracking_wider uppercase">
								{displayTitle}:
							</span>
							<div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-2">
								{displayList.map((pin) => (
									<button
										key={pin.login}
										type="button"
										onClick={() => navigate(`/profile/${pin.login}`)}
										className="group flex items-center gap-2 px-1 md:px-2 py-1 md:py-2 rounded-full bg-primary-variant/10 border border-primary-variant/20 hover:bg-primary-variant/20 transition-all duration-200 cursor-pointer"
									>
										<img
											src={pin.avatar_url}
											alt={`Avatar de ${pin.login}`}
											className="w-6 h-6 rounded-full object-cover border border-outline-variant"
										/>
										<span className="text-xs font-sans text-primary group-hover:text-main transition-colors">
											@{pin.login}
										</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Home
