import { Zap } from 'lucide-react'

interface LanguageStat {
	name: string
	percentage: number
	color: string
}

interface StackDistributionCardProps {
	languageStats: LanguageStat[]
	repoCount: number
	canCompare: boolean
	onCompare: () => void
}

const StackDistributionCard = ({
	languageStats,
	repoCount,
	canCompare,
	onCompare,
}: StackDistributionCardProps) => {
	return (
		<div className="flex flex-1 flex-col w-full bg-surface border border-outline p-5 rounded-lg justify-between gap-3 hover:border-primary-variant transition-colors duration-200">
			<span className="text-main font-semibold text-base">
				Distribuição de Stacks ({repoCount} repositórios)
			</span>

			{/* Barra de proporção colorida */}
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

			{/* Tags de linguagem com porcentagem */}
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

			{/* Botão de Comparar Stacks */}
			{canCompare && (
				<button
					type="button"
					onClick={onCompare}
					className="btn btn-primary btn-xs flex items-center gap-1.5 cursor-pointer"
				>
					<Zap size={14} />
					Comparar Stacks
				</button>
			)}
		</div>
	)
}

export default StackDistributionCard
