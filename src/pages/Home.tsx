/* ============================================================
   Hallmark · genre: modern-minimal · macrostructure: Workbench (Home overview)
   design-system: design.md · designed-as-app · mood: generoso
   pre-emit critique: P5 H4 E5 S4 R5 V5
   Estado anônimo: Index-First (console de busca) — a Home *é* a busca.
   Estado autenticado: account-overview workbench (rail · visão geral · atividade).
   ============================================================ */

import { zodResolver } from '@hookform/resolvers/zod'
import {
	Briefcase,
	History,
	Search,
	Star,
	Trash2,
	User as UserIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import Logo from '../assets/logo.svg?react'
import { useAuthStore, type UserProfile } from '../store/useAuthStore'
import { useCandidateStore } from '../store/useCandidateStore'
import { usePinnedProfileStore } from '../store/usePinnedProfileStore'
import { useSearchHistoryStore } from '../store/useSearchHistoryStore'
import type { PinnedProfile, SearchHistoryItem } from '../types/github'
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

// Resolve o casing canônico de um username antes de navegar, dando
// prioridade a perfis já conhecidos (fixados → histórico → sugestões).
const resolveUsername = (
	raw: string,
	pinned: PinnedProfile[],
	history: SearchHistoryItem[],
) => {
	const target = raw.trim()
	if (!target) return ''

	const pinnedMatch = pinned.find(
		(p) => p.login.toLowerCase() === target.toLowerCase(),
	)
	const historyMatch = history.find(
		(h) => h.username.toLowerCase() === target.toLowerCase(),
	)
	const suggestionMatch = suggestions.find(
		(s) => s.login.toLowerCase() === target.toLowerCase(),
	)

	return (
		pinnedMatch?.login ||
		historyMatch?.username ||
		suggestionMatch?.login ||
		target
	)
}

const Home = () => {
	const { user, profile } = useAuthStore()

	// Visitante → console de busca. Autenticado → dashboard.
	// O profile chega junto com a sessão; o guard só cobre a fração de segundo
	// em que a sessão já resolveu e o profile ainda está carregando.
	if (!user) return <AnonymousConsole />
	if (!profile) return <DashboardLoading />

	return <Dashboard user={user} profile={profile} />
}

const DashboardLoading = () => (
	<div className="bg-base min-h-[calc(100svh-64px)] flex items-center justify-center">
		<span className="loading loading-spinner text-primary-variant" />
	</div>
)

/* ============================================================
   ESTADO ANÔNIMO — Index-First (console de busca)
   A página é a busca: esquerda-biasada, índice de perfis abaixo.
   ⌘K pertence ao Header (N13) — nenhum listener global aqui.
   ============================================================ */
const AnonymousConsole = () => {
	const navigate = useNavigate()
	const { history, clearHistory, removeSearch } = useSearchHistoryStore()
	const pinned = usePinnedProfileStore((s) => s.pinned)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const hasPinned = pinned.length > 0
	const displayTitle = hasPinned ? 'Perfis Fixados' : 'Perfis Recomendados'
	const displayList = hasPinned ? pinned : suggestions

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UsernameInput>({ resolver: zodResolver(userSchema) })

	// Em telas pequenas, o foco abre o overlay de busca; no desktop, apenas o campo
	const handleInputFocus = ({ target }: React.FocusEvent<HTMLInputElement>) => {
		if (window.innerWidth < 768) {
			target.blur()
			setIsSearchOpen(true)
		}
	}

	const onSubmit = (data: UsernameInput) => {
		const finalUser = resolveUsername(data.username, pinned, history)
		if (!finalUser) return
		navigate(`/profile/${finalUser}`)
	}

	const renderIndexRow = (
		login: string,
		avatarUrl: string,
		onClick: () => void,
	) => (
		<li key={login}>
			<button
				type="button"
				onClick={onClick}
				className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bright transition-colors duration-200 group"
			>
				<img
					src={avatarUrl}
					alt={`Avatar de ${login}`}
					width={32}
					height={32}
					className="w-8 h-8 rounded-full border border-outline-variant object-cover flex-shrink-0"
				/>
				<span className="text-sm font-mono text-primary group-hover:text-main transition-colors duration-200">
					@{login}
				</span>
			</button>
		</li>
	)

	return (
		<div className="bg-base min-h-[calc(100svh-64px)] w-full flex flex-col overflow-hidden">
			<div className="w-full max-w-3xl mx-auto px-6 pt-12 md:pt-16 pb-16 flex flex-col gap-10">
				{/* Introdução — left-biased */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Logo className="w-8 h-8" aria-hidden="true" />
						<span className="micro-label text-primary-variant">GitProfile</span>
					</div>
					<h1 className="text-3xl md:text-5xl font-bold tracking-tight text-main leading-[1.05]">
						Explore perfis do GitHub
					</h1>
					<p className="text-muted text-sm md:text-base leading-relaxed max-w-lg">
						Busque desenvolvedores, compare stacks em tempo real e documente
						triagens de forma rápida.
					</p>
				</div>

				{/* Busca — o elemento dominante */}
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
					<div className="relative">
						<div className="join w-full border border-outline rounded-lg overflow-hidden focus-within:border-primary-variant transition-colors duration-200">
							<div className="relative join-item flex-1 flex items-center h-12">
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
									className="input w-full bg-surface text-main border-none pl-12 focus:outline-none rounded-none h-12"
								/>
								<span className="absolute left-4 text-muted pointer-events-none">
									<Search size={18} aria-hidden="true" />
								</span>
								<div className="absolute right-4 items-center gap-1 pointer-events-none select-none hidden sm:flex">
									<kbd className="kbd kbd-sm bg-base border border-outline-variant text-muted text-xs font-mono px-1.5 py-0.5 rounded">
										Ctrl
									</kbd>
									<kbd className="kbd kbd-sm bg-base border border-outline-variant text-muted text-xs font-mono px-1.5 py-0.5 rounded">
										K
									</kbd>
								</div>
							</div>

							<button
								type="submit"
								className="btn btn-primary join-item px-8 rounded-none border-none h-12 transition-colors duration-200 cursor-pointer"
							>
								Buscar
							</button>
						</div>
					</div>

					{errors.username && (
						<span className="text-error text-xs ml-2" role="alert">
							{errors.username.message}
						</span>
					)}
				</form>

				{/* Índice de perfis — recents + recomendados/fixados */}
				<div className="flex flex-col gap-8">
					{history.length > 0 && (
						<section aria-label="Buscas recentes">
							<div className="flex items-center justify-between mb-3">
								<h2 className="micro-label text-muted">Buscas Recentes</h2>
								<button
									type="button"
									onClick={() => clearHistory()}
									className="text-xs font-medium text-muted hover:text-error transition-colors duration-200 cursor-pointer"
								>
									Limpar histórico
								</button>
							</div>
							<ul className="flex flex-col bg-surface border border-outline rounded-lg overflow-hidden divide-y divide-outline">
								{history.map((item) => (
									<li key={item.username} className="flex items-center">
										<button
											type="button"
											onClick={() => navigate(`/profile/${item.username}`)}
											className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-bright transition-colors duration-200 group"
										>
											<img
												src={item.avatarUrl}
												alt={`Avatar de ${item.username}`}
												width={32}
												height={32}
												className="w-8 h-8 rounded-full border border-outline-variant object-cover flex-shrink-0"
											/>
											<span className="text-sm font-mono text-main group-hover:text-primary transition-colors duration-200">
												@{item.username}
											</span>
										</button>
										<button
											type="button"
											onClick={() => removeSearch(item.username)}
											className="px-3 py-3 text-muted hover:text-error transition-colors duration-200 cursor-pointer"
											aria-label={`Remover ${item.username} do histórico`}
										>
											<Trash2 size={14} />
										</button>
									</li>
								))}
							</ul>
						</section>
					)}

					<section aria-label={displayTitle}>
						<h2 className="micro-label text-muted mb-3">{displayTitle}</h2>
						<ul className="flex flex-col bg-surface border border-outline rounded-lg overflow-hidden divide-y divide-outline">
							{displayList.map((pin) =>
								renderIndexRow(pin.login, pin.avatar_url, () =>
									navigate(`/profile/${pin.login}`),
								),
							)}
						</ul>
						{hasPinned && (
							<div className="flex items-center gap-2 mt-3">
								<button
									type="button"
									className="text-xs font-mono text-muted hover:text-main transition-colors duration-200 cursor-pointer"
									onClick={() => navigate('/saved')}
								>
									Ver todos os favoritos →
								</button>
							</div>
						)}
					</section>
				</div>
			</div>

			{/* Overlay de busca mobile */}
			{isSearchOpen && (
				<div className="fixed inset-0 z-50 bg-base flex flex-col pt-16 px-6 pb-6 gap-6 md:hidden overflow-hidden">
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
							className="btn btn-ghost btn-sm text-main h-12 hover:bg-primary transition-colors duration-200 cursor-pointer"
						>
							Voltar
						</button>
					</div>

					{/* Ações de limpeza rápidas no overlay */}
					<div className="flex items-center gap-2 text-xs font-mono text-muted">
						{history.length > 0 && (
							<button
								type="button"
								onClick={() => clearHistory()}
								className="flex items-center gap-1 hover:text-error transition-colors duration-200 cursor-pointer"
							>
								<Trash2 size={12} />
								Limpar histórico
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

/* ============================================================
   ESTADO AUTENTICADO — Workbench (account overview · generoso)
   Rail de identidade à esquerda + coluna de atividade à direita.
   Dados reais das stores — nenhuma métrica inventada.
   ============================================================ */
const Dashboard = ({ user, profile }: { user: User; profile: UserProfile }) => {
	const navigate = useNavigate()
	const pinned = usePinnedProfileStore((s) => s.pinned)
	const { history, removeSearch, fetchHistory } = useSearchHistoryStore()
	const candidates = useCandidateStore((s) => s.candidates)

	const isRecruiter = profile.user_type === 'recruiter'
	const searchInputRef = useRef<HTMLInputElement | null>(null)
	const [searchQuery, setSearchQuery] = useState('')

	// Sincroniza o histórico com o Supabase ao montar o painel
	useEffect(() => {
		if (user.id) fetchHistory(user.id)
	}, [user.id, fetchHistory])

	const avatarUrl =
		user.user_metadata?.avatar_url || 'https://github.com/github.png'
	const displayLabel = isRecruiter ? 'Recrutador' : 'Desenvolvedor'

	const focusSearch = () => searchInputRef.current?.focus()

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		const target = resolveUsername(searchQuery, pinned, history)
		if (!target) return
		setSearchQuery('')
		navigate(`/profile/${target}`)
	}

	const statusCounts = {
		pendente: candidates.filter((c) => c.status === 'pendente').length,
		triagem: candidates.filter((c) => c.status === 'triagem').length,
		aprovado: candidates.filter((c) => c.status === 'aprovado').length,
		recusado: candidates.filter((c) => c.status === 'recusado').length,
	}

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${
			isActive
				? 'text-primary bg-bright'
				: 'text-muted hover:text-main hover:bg-bright'
		}`

	return (
		<main className="bg-base min-h-[calc(100svh-64px)] w-full">
			<div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
				{/* ——— Rail de identidade (sticky no desktop) ——— */}
				<aside className="lg:sticky lg:top-16 lg:self-start lg:h-[calc(100svh-64px)] lg:border-r border-outline flex flex-col gap-7 px-6 py-8 lg:px-10">
					<div className="flex items-center gap-4">
						<img
							src={avatarUrl}
							alt=""
							width={64}
							height={64}
							className="w-16 h-16 rounded-full border-2 border-outline-variant object-cover flex-shrink-0"
						/>
						<div className="min-w-0 flex flex-col gap-1">
							<span className="badge badge-primary badge-outline text-[10px] uppercase font-mono w-fit">
								{displayLabel}
							</span>
							<span className="text-sm font-mono text-muted truncate">
								{user.email}
							</span>
						</div>
					</div>

					<div className="hidden lg:block h-px bg-outline" />

					{/* Busca secundária — uma ação no rail */}
					<form onSubmit={handleSearch} className="relative">
						<label htmlFor="dashboard-search" className="sr-only">
							Nova busca no GitHub
						</label>
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
							aria-hidden="true"
						/>
						<input
							id="dashboard-search"
							ref={searchInputRef}
							type="text"
							value={searchQuery}
							onChange={({ target }) => setSearchQuery(target.value)}
							placeholder="Nova busca…"
							spellCheck={false}
							autoComplete="off"
							className="input w-full bg-surface border border-outline text-main pl-9 pr-3 focus:border-primary-variant rounded-lg h-11 text-sm"
						/>
					</form>

					{/* Navegação do painel — apenas desktop (o drawer do Header cobre mobile) */}
					<nav className="hidden lg:flex flex-col gap-1" aria-label="Painel">
						{isRecruiter ? (
							<>
								<NavLink to="/candidates" className={navLinkClass}>
									<Briefcase size={16} aria-hidden="true" />
									Triagem
								</NavLink>
								<NavLink to="/history" className={navLinkClass}>
									<History size={16} aria-hidden="true" />
									Histórico
								</NavLink>
							</>
						) : (
							<>
								{profile.github_username && (
									<NavLink
										to={`/profile/${profile.github_username}`}
										className={navLinkClass}
									>
										<UserIcon size={16} aria-hidden="true" />
										Meu perfil
									</NavLink>
								)}
								<NavLink to="/saved" className={navLinkClass}>
									<Star size={16} aria-hidden="true" />
									Favoritos
								</NavLink>
								<NavLink to="/history" className={navLinkClass}>
									<History size={16} aria-hidden="true" />
									Histórico
								</NavLink>
							</>
						)}
					</nav>
				</aside>

				{/* ——— Coluna de atividade (generosa) ——— */}
				<div className="min-w-0 px-6 py-10 md:px-10 lg:px-16 lg:py-16">
					<div className="max-w-2xl mx-auto flex flex-col gap-12 lg:gap-16">
						<header className="flex flex-col gap-3">
							<span className="micro-label text-primary-variant">
								Visão geral
							</span>
							<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-main leading-[1.1]">
								{isRecruiter ? 'Sua triagem em foco' : 'Continue de onde parou'}
							</h1>
							<p className="text-muted text-sm md:text-muted leading-relaxed max-w-lg">
								{isRecruiter
									? 'Um retrato dos candidatos salvos e das últimas buscas.'
									: 'Seus perfis fixados e buscas recentes, prontos para retomar.'}
							</p>
						</header>

						{/* Triagem — recrutador */}
						{isRecruiter && (
							<section aria-label="Triagem">
								<SectionHead
									label="Triagem"
									action={
										candidates.length > 0
											? { to: '/candidates', text: 'Ver triagem completa' }
											: undefined
									}
								/>
								{candidates.length === 0 ? (
									<EmptyState
										title="Nenhum candidato em triagem"
										body="Quando você salvar um perfil, ele aparece aqui com o status da avaliação de requisitos."
										action={{
											to: '/candidates',
											label: 'Ir para a triagem',
										}}
									/>
								) : (
									<div className="grid grid-cols-2 md:grid-cols-[repeat(4,minmax(0,1fr))] gap-4">
										<StatTile label="Pendentes" value={statusCounts.pendente} />
										<StatTile label="Em triagem" value={statusCounts.triagem} />
										<StatTile label="Aprovados" value={statusCounts.aprovado} />
										<StatTile label="Recusados" value={statusCounts.recusado} />
									</div>
								)}
							</section>
						)}

						{/* Perfis fixados — desenvolvedor */}
						{!isRecruiter && (
							<section aria-label="Perfis fixados">
								<SectionHead
									label="Perfis Fixados"
									action={
										pinned.length > 0
											? { to: '/saved', text: 'Gerenciar' }
											: undefined
									}
								/>
								{pinned.length === 0 ? (
									<EmptyState
										title="Nenhum perfil fixado ainda"
										body="Explore perfis do GitHub e fixe os que quiser revisitar. Eles ficam ancorados aqui."
										action={{ onClick: focusSearch, label: 'Buscar perfis' }}
									/>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-[repeat(2,minmax(0,1fr))] gap-5">
										{pinned.map((p) => (
											<PinnedCard key={p.login} profile={p} />
										))}
									</div>
								)}
							</section>
						)}

						{/* Buscas recentes — ambos os perfis */}
						<section aria-label="Buscas recentes">
							<SectionHead
								label="Buscas Recentes"
								action={
									history.length > 0
										? { to: '/history', text: 'Ver histórico' }
										: undefined
								}
							/>
							{history.length === 0 ? (
								<EmptyState
									title="Nenhuma busca ainda"
									body="Comece buscando um perfil do GitHub e ele aparece aqui para retomar rápido."
									action={{ onClick: focusSearch, label: 'Nova busca' }}
								/>
							) : (
								<ul className="flex flex-col bg-surface border border-outline rounded-lg overflow-hidden divide-y divide-outline">
									{history.slice(0, 5).map((item) => (
										<li key={item.username} className="flex items-center">
											<button
												type="button"
												onClick={() => navigate(`/profile/${item.username}`)}
												className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-bright transition-colors duration-200 group"
											>
												<img
													src={item.avatarUrl}
													alt={`Avatar de ${item.username}`}
													width={32}
													height={32}
													className="w-8 h-8 rounded-full border border-outline-variant object-cover flex-shrink-0"
												/>
												<span className="text-sm font-mono text-main group-hover:text-primary transition-colors duration-200">
													@{item.username}
												</span>
											</button>
											<button
												type="button"
												onClick={() => removeSearch(item.username, user.id)}
												className="px-3 py-3 text-muted hover:text-error transition-colors duration-200 cursor-pointer"
												aria-label={`Remover ${item.username} do histórico`}
											>
												<Trash2 size={14} />
											</button>
										</li>
									))}
								</ul>
							)}
						</section>
					</div>
				</div>
			</div>
		</main>
	)
}

/* ——— Sub-componentes do workbench ——— */

const SectionHead = ({
	label,
	action,
}: {
	label: string
	action?: { to: string; text: string }
}) => (
	<div className="flex items-center justify-between mb-5">
		<h2 className="micro-label text-muted">{label}</h2>
		{action && (
			<Link
				to={action.to}
				className="text-xs font-medium text-primary hover:text-primary-variant transition-colors duration-200"
			>
				{action.text} →
			</Link>
		)}
	</div>
)

const StatTile = ({ label, value }: { label: string; value: number }) => (
	<div className="bg-surface border border-outline rounded-lg p-6 flex flex-col gap-2">
		<span className="text-3xl font-bold tabular-nums text-main">{value}</span>
		<span className="micro-label text-muted">{label}</span>
	</div>
)

const PinnedCard = ({ profile }: { profile: PinnedProfile }) => (
	<Link
		to={`/profile/${profile.login}`}
		className="group bg-surface border border-outline rounded-lg p-6 flex flex-col gap-4 hover:border-outline-variant transition-colors duration-200"
	>
		<div className="flex items-center gap-3">
			<img
				src={profile.avatar_url}
				alt={`Avatar de ${profile.login}`}
				width={48}
				height={48}
				className="w-12 h-12 rounded-full border border-outline-variant object-cover flex-shrink-0"
			/>
			<div className="min-w-0 flex flex-col">
				<span className="text-sm font-mono text-primary group-hover:text-main transition-colors duration-200 truncate">
					@{profile.login}
				</span>
				{profile.name && (
					<span className="text-sm text-main font-medium truncate">
						{profile.name}
					</span>
				)}
			</div>
		</div>
		{profile.bio && (
			<p className="text-sm text-muted leading-relaxed line-clamp-2">
				{profile.bio}
			</p>
		)}
		<span className="text-sm text-primary">Ver perfil →</span>
	</Link>
)

const EmptyState = ({
	title,
	body,
	action,
}: {
	title: string
	body: string
	action?: { to?: string; onClick?: () => void; label: string }
}) => (
	<div className="bg-surface border border-dashed border-outline rounded-lg p-8 md:p-10 flex flex-col items-start gap-5">
		<div className="flex flex-col gap-1.5">
			<span className="text-main font-medium text-base">{title}</span>
			<p className="text-sm text-muted leading-relaxed max-w-md">{body}</p>
		</div>
		{action &&
			(action.to ? (
				<Link
					to={action.to}
					className="btn btn-primary btn-sm rounded-full transition-colors duration-200"
				>
					{action.label}
				</Link>
			) : (
				<button
					type="button"
					onClick={action.onClick}
					className="btn btn-primary btn-sm rounded-full transition-colors duration-200"
				>
					{action.label}
				</button>
			))}
	</div>
)

export default Home
