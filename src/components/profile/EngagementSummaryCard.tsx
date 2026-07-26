import { GitFork, Star } from 'lucide-react'

interface EngagementSummaryCardProps {
	stars: number
	forks: number
	repoCount: number
}

const EngagementSummaryCard = ({
	stars,
	forks,
	repoCount,
}: EngagementSummaryCardProps) => {
	return (
		<div className="flex flex-1 flex-col w-full items-center bg-surface border border-outline rounded-lg p-5 gap-3 hover:border-primary-variant transition-colors duration-200">
			<span className="text-main font-semibold text-base">
				Resumo de Engajamento ({repoCount} repositórios)
			</span>

			<div className="flex gap-8 items-center h-full py-2">
				{/* Bloco de Stars */}
				<div className="flex items-center gap-3">
					<Star size={24} className="text-tertiary fill-current" />
					<div>
						<p className="text-main text-xl font-bold font-mono leading-none tabular-nums">
							{stars}
						</p>
						<p className="text-muted text-xs mt-1">Total Stars</p>
					</div>
				</div>

				{/* Bloco de Forks */}
				<div className="flex items-center gap-3">
					<GitFork size={24} className="text-muted" />
					<div>
						<p className="text-main text-xl font-bold font-mono leading-none tabular-nums">
							{forks}
						</p>
						<p className="text-muted text-xs mt-1">Total Forks</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EngagementSummaryCard
