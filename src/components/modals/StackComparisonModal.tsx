import { Zap } from 'lucide-react'
import { compareStacks, type LanguageStat } from '../../utils/stackComparison'
import { useGithubRepos } from '../../hooks/useGithubRepos'
import { useMemo } from 'react'
import { languageColors } from '../../lib/colors'
import Modal from '../ui/Modal'

interface StackComparisonProps {
	isOpen: boolean
	onClose: () => void
	myUsername: string
	targetUsername: string
	targetStats: LanguageStat[]
}

const StackComparisonModal = ({
	isOpen,
	onClose,
	myUsername,
	targetUsername,
	targetStats,
}: StackComparisonProps) => {
	// Busca os repositórios do usuário logado via React Query
	const { data: myRepoData } = useGithubRepos(myUsername)

	const myStats = useMemo(() => {
		const allRepos = myRepoData?.pages.flatMap((page) => page) || []
		const reposWithLang = allRepos.filter((r) => r.language)
		const total = reposWithLang.length

		if (total === 0) return []

		const counts: Record<string, number> = {}
		for (const r of reposWithLang) {
			if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
		}

		return Object.entries(counts).map(([name, count]) => ({
			name,
			percentage: (count / total) * 100,
			color: languageColors[name] || '#8b949c',
		}))
	}, [myRepoData])

	const comparison = useMemo(() => {
		return compareStacks(myStats, targetStats, targetUsername)
	}, [myStats, targetStats, targetUsername])

	const comparisonList = useMemo(() => {
		const myLangs = myStats.filter((s) => s.name !== 'Outras')
		const targetLangs = targetStats.filter((s) => s.name !== 'Outras')

		const allNames = Array.from(
			new Set([
				...myLangs.map((s) => s.name),
				...targetLangs.map((s) => s.name),
			]),
		)

		return allNames.map((name) => {
			const myItem = myLangs.find((s) => s.name === name)
			const targetItem = targetLangs.find((s) => s.name === name)

			return {
				name,
				color: myItem?.color || targetItem?.color || '#8b949e',
				myPercent: myItem ? myItem.percentage : 0,
				targetPercent: targetItem ? targetItem.percentage : 0,
			}
		})
	}, [myStats, targetStats])

	if (!isOpen) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`@${myUsername} vs @${targetUsername}`}
			icon={<Zap className="text-primary-variant" size={22} />}
		>
			<div className="flex flex-col gap-6 text-left max-h-[75vh] overflow-y-auto no-scrollbar">
				{/* Card de afinidade e resumo */}
				<div className="flex flex-col gap-3 bg-bright border border-outline p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<span className="text-sm font-mono text-main uppercase tracking-wider">
							Afinidade Técnica
						</span>
						<span className="badge badge-primary font-mono font-bold text-sm">
							{comparison.affinityPercentage}%
						</span>
					</div>
					<p className="text-sm text-muted leading-relaxed">
						{comparison.summaryText}
					</p>
				</div>
				{/* Linguagens em comum */}
				{comparison.commonLanguages.length > 0 && (
					<div className="flex flex-col gap-2">
						<span className="text-xs font-mono text-muted uppercase tracking-wider">
							Tecnologias Compartilhadas
						</span>
						<div className="flex flex-wrap gap-2">
							{comparison.commonLanguages.map((lang) => (
								<span
									key={lang}
									className="badge badge-outline border-primary-variant text-primary-variant text-xs"
								>
									{lang}
								</span>
							))}
						</div>
					</div>
				)}
				{/* Gráfico comparativo duplex (lado a lado) */}
				<div className="flex flex-col gap-4">
					<span className="text-xs font-mono text-muted uppercase tracking-wider">
						Comparativo por Linguagem
					</span>
					<div className="flex flex-col gap-3">
						{comparisonList.map((item) => (
							<div
								key={item.name}
								className="flex flex-col gap-2 p-3 rounded-lg border border-outline bg-surface"
							>
								{/* Nome da linguagem */}
								<div className="flex items-center gap-2">
									<span
										className="w-2.5 h-2.5 rounded-full"
										style={{ backgroundColor: item.color }}
									/>
									<span className="text-sm font-semibold text-main font-mono">
										{item.name}
									</span>
								</div>
								{/* Barra 1: @myUsername */}
								<div className="flex items-center gap-3 text-xs font-mono text-muted">
									<span className="w-24 truncate">@{myUsername}</span>
									<div className="flex-1 h-2 rounded-full bg-outline-variant overflow-hidden">
										<div
											className="h-full bg-primary-variant"
											style={{ width: `${item.myPercent}%` }}
										/>
									</div>
									<span className="w-12 text-right tabular-nums">
										{item.myPercent.toFixed(1)}%
									</span>
								</div>
								{/* Barra 2: Dev visitado (@targetUsername) */}
								<div className="flex items-center gap-3 text-xs font-mono text-muted">
									<span className="w-24 truncate">@{targetUsername}</span>
									<div className="flex-1 h-2 rounded-full bg-outline-variant overflow-hidden">
										<div
											className="h-full bg-tertiary"
											style={{ width: `${item.targetPercent}%` }}
										/>
									</div>
									<span className="w-12 text-right tabular-nums">
										{item.targetPercent.toFixed(1)}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default StackComparisonModal
