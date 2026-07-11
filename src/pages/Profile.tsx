import { AlertCircle, Compass, GitFork, Star } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ProfileCard from '../components/profile/ProfileCard'
import RepositoryCard from '../components/profile/RepositoryCard'
import { useGithubRepos } from '../hooks/useGithubRepos'
import { useGithubUser } from '../hooks/useGithubUser'
import { languageColors } from '../lib/Colors'
import { useSearchHistoryStore } from '../store/useSearchHistoryStore'

const Profile = () => {
	// =========================================================
	// 1. CONFIGURAÇÕES & ESTADOS (Hooks e Stores)
	// =========================================================
	const navigate = useNavigate()
	const { username } = useParams<{ username: string }>()

	// Requisições para a API do GitHub via react-query
	const { data, isLoading, isError, error } = useGithubUser(username || '')
	const {
		data: repo,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGithubRepos(username || '')

	// Referências e estado de histórico de busca
	const observerRef = useRef<HTMLDivElement | null>(null)
	const { addSearch } = useSearchHistoryStore()

	// =========================================================
	// 2. MÉTRICAS & PROCESSAMENTO (useMemo)
	// =========================================================

	// Combina todas as páginas de repositórios em uma lista única
	const allRepos = useMemo(() => {
		return repo?.pages.flatMap((page) => page) || []
	}, [repo])

	// Calcula a porcentagem e a cor correspondente de cada linguagem usada
	const languageStats = useMemo(() => {
		const reposWithLang = allRepos.filter((r) => r.language)
		const total = reposWithLang.length

		if (total === 0) return []

		const counts: Record<string, number> = {}

		for (const r of reposWithLang) {
			if (r.language) {
				counts[r.language] = (counts[r.language] || 0) + 1
			}
		}

		const stats = Object.entries(counts).map(([name, count]) => ({
			name,
			percentage: (count / total) * 100,
			color: languageColors[name] || '#8b949e',
		}))

		stats.sort((a, b) => b.percentage - a.percentage)

		if (stats.length > 6) {
			const top5 = stats.slice(0, 5)
			const remaining = stats.slice(5)
			const otherPercent = remaining.reduce(
				(acc, curr) => acc + curr.percentage,
				0,
			)

			return [
				...top5,
				{ name: 'Outras', percentage: otherPercent, color: '#8b949e' },
			]
		}

		return stats
	}, [allRepos])

	// Consolida estatísticas de engajamento acumulado
	const totalStats = useMemo(() => {
		const stars = allRepos.reduce((acc, r) => acc + r.stargazers_count, 0)
		const forks = allRepos.reduce((acc, r) => acc + r.forks_count, 0)

		return { stars, forks }
	}, [allRepos])

	// =========================================================
	// 3. EFEITOS COLATERAIS (useEffect)
	// =========================================================

	// Salva a pesquisa atual no histórico global e padroniza a rota se necessário
	useEffect(() => {
		if (!data) return

		addSearch(data.login, data.avatar_url)

		if (username !== data.login)
			navigate(`/profile/${data.login}`, { replace: true })
	}, [data, username, addSearch, navigate])

	// Gerencia o scroll infinito observando um divisor marcador de fim de página
	useEffect(() => {
		const sentinel = observerRef.current
		if (!sentinel) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{ rootMargin: '200px' },
		)

		observer.observe(sentinel)

		return () => {
			observer.unobserve(sentinel)
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	// =========================================================
	// 4. RETORNO: ESTADO DE LOADING (Skeleton Loader)
	// =========================================================
	if (isLoading) {
		return (
			<main className="bg-base grid grid-cols-1 lg:grid-cols-[400px_1fr_1fr] lg:grid-rows-[auto_1fr] lg:h-[calc(100svh-64px)] lg:overflow-hidden">
				{/* 4.1 Barra lateral esquerda - Skeleton do perfil */}
				<div className="bg-base lg:col-start-1 lg:row-span-2 lg:border-r border-outline flex flex-col items-center p-6 w-full gap-4">
					{/* Avatar em esqueleto */}
					<div className="skeleton w-32 h-32 rounded-md" />

					{/* Nome do Desenvolvedor */}
					<div className="skeleton h-6 w-48 mt-4" />

					{/* Username do GitHub */}
					<div className="skeleton h-4 w-32 text-primary" />

					{/* Biografia do usuário */}
					<div className="skeleton h-4 w-full mt-2" />
					<div className="skeleton h-4 w-3/4" />

					{/* Botão seguir */}
					<div className="skeleton h-6 w-full rounded-md mt-4" />

					{/* Seguidores e Seguindo */}
					<div className="flex gap-3 border-b-2 border-outline mb-4 py-4 w-full justify-center">
						<div className="skeleton h-4 w-12" />
						<span className="text-sm px-3">•</span>
						<div className="skeleton h-4 w-12" />
					</div>

					{/* Localização e Empresa */}
					<div className="flex gap-3 py-2 w-full justify-center">
						<div className="skeleton h-4 w-16" />
						<span className="text-sm px-3">|</span>
						<div className="skeleton h-4 w-16" />
					</div>

					{/* Ações de Recrutador */}
					<div className="skeleton h-6 w-full rounded-md" />
				</div>

				{/* 4.2 Cabeçalho de Métricas (Direita Superior) */}
				<div className="lg:col-start-2 lg:col-span-2 lg:row-start-1 border-b border-t border-outline lg:border-t-0 py-6 px-8 flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-around">
					{/* Card Distribuição de Stacks */}
					<div className="skeleton h-24 w-full lg:w-96 bg-surface border border-outline p-5 rounded-lg" />

					{/* Card Resumo de Engajamento */}
					<div className="skeleton h-24 w-full lg:w-96 bg-surface border border-outline rounded-lg p-5" />
				</div>

				{/* 4.3 Grade de Repositórios (Direita Inferior) */}
				<div className="lg:col-start-2 lg:col-span-2 lg:row-start-2 grid grid-cols-1 lg:grid-cols-3 p-8 gap-8 overflow-y-auto no-scrollbar">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="bg-surface border border-outline rounded-lg p-5 flex flex-col gap-3"
						>
							<div className="skeleton h-5 w-32" />
							<div className="skeleton h-4 w-full" />
							<div className="skeleton h-4 w-2/3" />
							<div className="flex gap-4 mt-2">
								<div className="skeleton h-3 w-12" />
								<div className="skeleton h-3 w-12" />
							</div>
						</div>
					))}
				</div>
			</main>
		)
	}

	// =========================================================
	// 5. RETORNO: ESTADO DE ERRO (isError)
	// =========================================================
	if (isError) {
		let title = 'Erro na busca'
		let message = 'Não foi possível carregar as informações do usuário'
		let Icon = AlertCircle
		let inColor = 'text-error'

		if (error?.message === 'Usuário não encontrado.') {
			title = `Erro ao buscar usuário.`
			message = `O usuário ${username} não foi encontrado.`
			Icon = Compass
			inColor = 'text-muted'
		} else if (error?.message === 'Limite de requisições do GitHub atingido.') {
			title = 'Limite de Requisições atingida.'
			message = `O Github disponibiliza apenas 60 requisições por hora para usuários não autenticados. Tente novamente mais tarde ou utilize um token de acesso pessoal para aumentar o limite de requisições.`
			Icon = AlertCircle
			inColor = 'text-tertiary'
		}

		return (
			<div className="flex h-[calc(100svh-64px)] w-full items-center justify-center bg-base p-6">
				<div className="bg-surface border border-outline rounded-lg p-8 max-w-md w-full text-center flex flex-col items-center gap-6">
					<Icon size={48} className={inColor} aria-hidden="true" />
					<h1 className="text-main font-sans font-bold text-2xl tracking-tight">
						{title}
					</h1>
					<p className="text-muted font-sans text-sm leading-relaxed">
						{message}
					</p>
					<Link
						to="/"
						className="btn btn-outline border-outline text-main hover:border-primary-variant hover:text-primary-variant transition-all duration-200 motion-safe:hover:scale-[1.01] w-full mt-2"
					>
						Voltar para a Página Incial
					</Link>
				</div>
			</div>
		)
	}

	// =========================================================
	// 6. RETORNO: ESTADO DE SUCESSO (data)
	// =========================================================
	if (data) {
		return (
			<main className="bg-base grid grid-cols-1 lg:grid-cols-[400px_1fr_1fr] lg:grid-rows-[auto_1fr] lg:h-[calc(100svh-64px)] lg:overflow-hidden">
				{/* 6.1 Barra lateral esquerda - Informações do perfil */}
				<div className="bg-base lg:col-start-1 lg:row-span-2 lg:border-r border-outline flex flex-col items-center">
					<ProfileCard user={data} />
				</div>

				{/* 6.2 Cabeçalho de Métricas (Direita Superior) */}
				<div className="lg:col-start-2 lg:col-span-2 lg:row-start-1 border-b border-t border-outline lg:border-t-0 py-6 px-8 flex flex-col lg:flex-row gap-8 lg:items-stretch lg:justify-around">
					{/* Bloco 6.2.1: Distribuição de Stacks */}
					<div className="flex flex-1 flex-col w-full bg-surface border border-outline p-5 rounded-lg  justify-between gap-3 hover:border-primary-variant transition-colors duration-200">
						<span className="text-main font-semibold text-base">
							Distribuição de Stacks ({allRepos.length} repositórios)
						</span>

						<div className="w-full h-3 rounded-full flex overflow-hidden bg-outline-variant">
							{languageStats.map((lang) => (
								<div
									key={lang.name}
									style={{
										width: `${lang.percentage}%`,
										backgroundColor: lang.color,
									}}
									className="h-full"
									title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
								/>
							))}
						</div>

						<div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
							{languageStats.map((lang) => (
								<span
									key={lang.name}
									className="flex items-center gap-1.5 text-xs text-main font-mono border rounded-lg px-2"
									style={{ borderColor: lang.color }}
								>
									{lang.name}
									<span className="text-muted tabular-nums">
										({lang.percentage.toFixed(1)}%)
									</span>
								</span>
							))}
						</div>
					</div>

					{/* Bloco 6.2.2: Resumo de Engajamento */}
					<div className="flex flex-1 flex-col w-full items-center bg-surface border border-outline rounded-lg p-5 gap-3 hover:border-primary-variant transition-colors duration-200">
						<span className="text-main font-semibold text-base">
							Resumo de Engajamento ({allRepos.length} repositórios)
						</span>

						<div className="flex gap-8 items-center h-full py-2">
							{/* Bloco de Stars */}
							<div className="flex items-center gap-3">
								<Star size={24} className="text-tertiary fill-current" />
								<div>
									<p className="text-main text-xl font-bold font-mono leading-none tabular-nums">
										{totalStats.stars}
									</p>
									<p className="text-muted text-xs mt-1">Total Stars</p>
								</div>
							</div>

							{/* Bloco de Forks */}
							<div className="flex items-center gap-3">
								<GitFork size={24} className="text-muted" />

								<div>
									<p className="text-main text-xl font-bold font-mono leading-none tabular-nums">
										{totalStats.forks}
									</p>
									<p className="text-muted text-xs mt-1">Total Forks</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 6.3 Grade de Repositórios (Direita Inferior) */}
				<div className="lg:col-start-2 lg:col-span-2 lg:row-start-2 grid grid-cols-1 lg:grid-cols-3 lg:overflow-y-auto no-scrollbar p-8 gap-8">
					{repo?.pages.map((page) =>
						page.map((repo) => (
							<RepositoryCard key={repo.id} repository={repo} />
						)),
					)}
					<div
						ref={observerRef}
						className="col-span-full h-16 flex items-center justify-center"
					>
						{isFetchingNextPage && (
							<span className="loading loading-spinner text-primary-variant"></span>
						)}
					</div>
				</div>
			</main>
		)
	}
}

export default Profile
