import { GitFork, Star } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ProfileCard from '../components/profile/ProfileCard'
import RepositoryCard from '../components/profile/RepositoryCard'
import { useGithubRepos } from '../hooks/useGithubRepos'
import { useGithubUser } from '../hooks/useGithubUser'
import { languageColors } from '../lib/Colors'
import { useSearchHistoryStore } from '../store/useSearchHistoryStore'

const Profile = () => {
	const { username } = useParams<{ username: string }>()

	const { data, isLoading, isError, error } = useGithubUser(username || '')
	const {
		data: repo,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGithubRepos(username || '')
	const observerRef = useRef<HTMLDivElement | null>(null)
	const { addSearch } = useSearchHistoryStore()

	const allRepos = useMemo(() => {
		return repo?.pages.flatMap((page) => page) || []
	}, [repo])

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

	const totalStats = useMemo(() => {
		const stars = allRepos.reduce((acc, r) => acc + r.stargazers_count, 0)
		const forks = allRepos.reduce((acc, r) => acc + r.forks_count, 0)

		return { stars, forks }
	}, [allRepos])

	useEffect(() => {
		if (data) {
			addSearch(data.login, data.avatar_url)
		}
	}, [data, addSearch])

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

	if (isLoading) {
		return <p>Carregando profile...</p>
	}

	if (isError) {
		return <p>Erro: {error?.message}</p>
	}

	if (data) {
		return (
			<div className='bg-base grid h-[calc(100svh-64px)] grid-cols-[400px_1fr_1fr] grid-rows-[auto_1fr] overflow-hidden'>
				<div className='bg-base col-start-1 row-span-2 border-r border-outline flex flex-col items-center'>
					<ProfileCard user={data} />
				</div>

				<div className='col-start-2 col-span-2 row-start-1 border-b border-outline py-4 px-8 flex items-center justify-around'>
					<div className='bg-surface border border-outline p-5 rounded-lg flex flex-col justify-between gap-3'>
						<span className='text-main font-semibold text-sm'>
							Distribuição de Stacks ({allRepos.length} repositórios)
						</span>

						<div className='w-full h-3 rounded-full flex overflow-hidden bg-outline-variant'>
							{languageStats.map((lang) => (
								<div
									key={lang.name}
									style={{
										width: `${lang.percentage}%`,
										backgroundColor: lang.color,
									}}
									className='h-full'
									title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
								/>
							))}
						</div>

						<div className='flex flex-wrap gap-x-4 gap-y-2 mt-1'>
							{languageStats.map((lang) => (
								<span
									key={lang.name}
									className='flex items-center gap-1.5 text-xs text-[#c0c7d4] font-mono'
								>
									<span
										className='px-2 rounded-full'
										style={{ backgroundColor: lang.color }}
									>
										{lang.name}
										<span className='text-surface'>
											({lang.percentage.toFixed(1)}%)
										</span>
									</span>
								</span>
							))}
						</div>
					</div>

					<div className='bg-surface border border-outline rounded-lg p-5 flex flex-col justify-between gap-3'>
						<span className='text-main font-semibold text-sm'>
							Resumo de Engajamento ({allRepos.length} repositórios)
						</span>

						<div className='flex gap-8 items-center h-full'>
							{/* Bloco de Stars */}
							<div className='flex items-center gap-3'>
								<Star size={24} fill='#f0d60c' stroke='none' />
								<div>
									<p className='text-main text-xl font-bold font-mono leading-none'>
										{totalStats.stars}
									</p>
									<p className='text-muted text-xs mt-1'>Total Stars</p>
								</div>
							</div>

							{/* Bloco de Forks */}
							<div className='flex items-center gap-3'>
								<GitFork size={24} fill='#f05f0c' stroke='none' />

								<div>
									<p className='text-main text-xl font-bold font-mono leading-none'>
										{totalStats.forks}
									</p>
									<p className='text-muted text-xs mt-1'>Total Forks</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='col-start-2 col-span-2 row-start-2 grid grid-cols-3 overflow-y-auto no-scrollbar p-8 gap-4'>
					{repo?.pages.map((page) =>
						page.map((repo) => (
							<RepositoryCard key={repo.id} repository={repo} />
						)),
					)}
					<div
						ref={observerRef}
						className='col-span-full h-16 flex items-center justify-center'
					>
						{isFetchingNextPage && (
							<span className='loading loading-spinner text-primary-variant'></span>
						)}
					</div>
				</div>
			</div>
		)
	}
}

export default Profile
