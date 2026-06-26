import { GitFork, Star } from 'lucide-react'
import type { Repository } from '../../types/github'
import { languageColors } from '../../lib/Colors'

interface RepositoryCardProps {
	repository: Repository
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
	return (
		<div className='bg-surface border border-outline rounded-lg p-5 flex flex-col gap-3 transition-all duration-200 hover:border-primary-variant hover:bg-[#1b252f] motion-safe:hover:scale-[1.01]'>
			<div className='flex items-center justify-between'>
				<a
					href={repository.html_url}
					target='_blank'
					rel='noopener noreferrer'
					className='text-main hover:text-primary-variant font-sans font-semibold text-base transition-colors'
				>
					{repository.name}
				</a>
				<span className='badge badge-outline border-outline-variant text-muted text-xs px-2 py-1 rounded-full'>
					Público
				</span>
			</div>
			<p className='text-muted text-sm leading-relaxed line-clamp-2'>
				{repository.description || <em>Nenhuma descrição fornecida.</em>}
			</p>
			<div className='flex flex-wrap items-center gap-4 text-xs text-muted font-mono mt-2'>
				{/* Linguagem */}
				{repository.language && (
					<span className='flex items-center gap-1.5'>
						<span className={`w-3 h-3 rounded-full`} style={{backgroundColor: languageColors[repository.language] || '#8b949e'}}></span>
						{repository.language}
					</span>
				)}

				{/* Stars */}
				<span className='flex items-center gap-1'>
					<Star size={14} fill='#f0d60c' stroke='none' />
					{repository.stargazers_count} stars
				</span>

				{/* Forks */}
				<span className='flex items-center gap-1'>
					<GitFork size={14} fill='#f05f0c' stroke='none'/>
					{repository.forks_count} forks
				</span>

				{/* Atualização */}
				<span className='ml-auto'>
					Atualizado em{' '}
					{new Date(repository.updated_at).toLocaleDateString('pt-BR', {
						day: 'numeric',
						month: 'short',
					})}
				</span>
			</div>
		</div>
	)
}

export default RepositoryCard
