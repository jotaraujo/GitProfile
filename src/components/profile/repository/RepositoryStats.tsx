import { Eye, GitFork, Star, Terminal } from 'lucide-react'
import type { Repository } from '../../../types/github'

interface RepositoryStatsProps {
	repository: Repository
}

const RepositoryStats = ({ repository }: RepositoryStatsProps) => (
	<div className="grid grid-cols-2 gap-4 text-sm font-mono text-muted pt-4 border-t border-outline/50 mt-auto">
		<div className="flex items-center gap-2">
			<Star size={16} className="text-tertiary fill-current" />
			<span className="text-main font-semibold tabular-nums">
				{repository.stargazers_count}
			</span>{' '}
			stars
		</div>
		<div className="flex items-center gap-2">
			<GitFork size={16} className="text-muted" />
			<span className="text-main font-semibold tabular-nums">
				{repository.forks_count}
			</span>{' '}
			forks
		</div>
		<div className="flex items-center gap-2">
			<Eye size={16} className="text-muted" />
			<span className="text-main font-semibold tabular-nums">
				{repository.watchers_count}
			</span>{' '}
			watchers
		</div>
		<div className="flex items-center gap-2">
			<Terminal size={16} className="text-muted" />
			<span className="text-main font-semibold tabular-nums">
				{(repository.size / 1024).toFixed(1)}
			</span>{' '}
			&nbsp;MB
		</div>
	</div>
)

export default RepositoryStats
