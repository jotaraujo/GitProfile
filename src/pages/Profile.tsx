import { AlertCircle, Compass } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StackComparisonModal from '../components/modals/StackComparisonModal'
import EngagementSummaryCard from '../components/profile/EngagementSummaryCard'
import ProfileCard from '../components/profile/ProfileCard'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import { RepositoryCard } from '../components/profile/repository'
import StackDistributionCard from '../components/profile/StackDistributionCard'
import { useGithubRepos } from '../hooks/useGithubRepos'
import { useGithubUser } from '../hooks/useGithubUser'
import { languageColors } from '../lib/colors'
import { useAuthStore } from '../store/useAuthStore'
import { useSearchHistoryStore } from '../store/useSearchHistoryStore'

const Profile = () => {
	// =========================================================
	// 1. CONFIGURAÇÕES & ESTADOS (Hooks e Stores)
	// =========================================================
	const navigate = useNavigate()
	const { username } = useParams<{ username: string }>()
	const { profile, user } = useAuthStore()

	const isRecruiter = profile?.user_type === 'recruiter'

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
	// 3. EFEITOS COLATERAIS (useState, useEffect)
	// =========================================================

	const [isComparisonOpen, setIsComparisonOpen] = useState(false)

	const canCompare =
		Boolean(data?.login) &&
		profile?.user_type === 'developer' &&
		Boolean(profile?.github_username) &&
		profile?.github_username?.toLowerCase() !== data?.login?.toLowerCase()

	// Salva a pesquisa atual no histórico global e padroniza a rota se necessário
	useEffect(() => {
		if (!data) return

		addSearch(data.login, data.avatar_url, user?.id)

		if (username !== data.login)
			navigate(`/profile/${data.login}`, { replace: true })
	}, [data, username, addSearch, navigate, user])

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
		return <ProfileSkeleton />
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
			inColor = 'text-error'
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
					<ProfileCard user={data} isRecruiter={isRecruiter} />
				</div>

				{/* 6.2 Cabeçalho de Métricas (Direita Superior) */}
				<div className="lg:col-start-2 lg:col-span-2 lg:row-start-1 border-b border-t border-outline lg:border-t-0 py-6 px-8 flex flex-col lg:flex-row gap-8 lg:items-stretch lg:justify-around">
					<StackDistributionCard
						languageStats={languageStats}
						repoCount={allRepos.length}
						canCompare={canCompare}
						onCompare={() => setIsComparisonOpen(true)}
					/>

					<EngagementSummaryCard
						stars={totalStats.stars}
						forks={totalStats.forks}
						repoCount={allRepos.length}
					/>
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

				{canCompare && profile?.github_username && (
					<StackComparisonModal
						isOpen={isComparisonOpen}
						onClose={() => setIsComparisonOpen(false)}
						myUsername={profile.github_username}
						targetUsername={data.login}
						targetStats={languageStats}
					/>
				)}
			</main>
		)
	}
}

export default Profile
