import { GitFork, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { languageColors } from '../../../lib/colors'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../../store/useAuthStore'
import type { Repository } from '../../../types/github'
import RepositoryDetailModal from './RepositoryDetailModal'

interface RepositoryCardProps {
	repository: Repository
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
	const { user } = useAuthStore()

	// Controle de abertura do modal principal
	const [isOpen, setIsOpen] = useState(false)
	// Verifica se o repositório está salvo
	const [isSaved, setIsSaved] = useState(false)

	useEffect(() => {
		const checkSaved = async () => {
			if (!user?.id) return

			const { data, error } = await supabase
				.from('saved_repositories')
				.select('id')
				.eq('user_id', user?.id)
				.eq('repo_id', repository.id)
				.maybeSingle()

			setIsSaved(Boolean(data))

			if (error) throw error
		}
		checkSaved()
	}, [user, repository.id])

	const handleToggleSave = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (!user) return

		if (isSaved) {
			const { error } = await supabase
				.from('saved_repositories')
				.delete()
				.eq('user_id', user.id)
				.eq('repo_id', repository.id)
			if (error) throw error
			setIsSaved(false)
		} else {
			const { error } = await supabase.from('saved_repositories').insert({
				user_id: user.id,
				repo_id: repository.id,
				repo_name: repository.name,
				owner_login: repository.owner.login,
				description: repository.description,
				language: repository.language,
				stars_count: repository.stargazers_count,
			})
			if (error) throw error
			setIsSaved(true)
		}
	}

	return (
		<>
			{/* Card do repositório interativo (abre o modal ao clicar) */}
			<div
				onClick={() => setIsOpen(true)}
				className="bg-surface border border-outline rounded-lg p-5 flex flex-col gap-3 transition-all duration-200 hover:border-primary-variant hover:bg-[#1b252f] motion-safe:hover:scale-[1.01] cursor-pointer"
			>
				{/* 1. CABEÇALHO: Título inerte e selo de visibilidade */}
				<div className="flex items-center justify-between">
					<h4 className="text-main hover:text-primary-variant font-sans font-semibold text-base transition-colors">
						{repository.name}
					</h4>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handleToggleSave}
							title={isSaved ? 'Remover dos favoritos' : 'Salvar repositório'}
							className={`p-1.5 rounded-md transition-colors hover:bg-surface cursor-pointer ${isSaved ? 'text-tertiary' : 'text-muted hover:text-main'}`}
						>
							<Star size={14} className={isSaved ? 'fill-current' : ''} />
						</button>
						<span className="badge badge-outline border-outline-variant text-muted text-xs px-2 py-1 rounded-full">
							Público
						</span>
					</div>
				</div>

				{/* 2. DESCRIÇÃO: Breve resumo do projeto */}
				<p className="text-muted text-sm leading-relaxed line-clamp-2">
					{repository.description || <em>Nenhuma descrição fornecida.</em>}
				</p>

				{/* 3. METADADOS: Linguagem, estrelas, forks e última atualização */}
				<div className="flex flex-wrap items-center gap-4 text-xs text-muted font-mono mt-2">
					{/* Linguagem */}
					{repository.language && (
						<span className="flex items-center gap-1.5">
							<span
								className="w-3 h-3 rounded-full"
								style={{
									backgroundColor:
										languageColors[repository.language] || '#8b949e',
								}}
							></span>
							{repository.language}
						</span>
					)}

					{/* Stars */}
					<span className="flex items-center gap-1">
						<Star size={14} className="text-tertiary fill-current" />
						<span className="tabular-nums">
							{repository.stargazers_count}
						</span>{' '}
						stars
					</span>

					{/* Forks */}
					<span className="flex items-center gap-1">
						<GitFork size={14} className="text-muted" />
						<span className="tabular-nums">{repository.forks_count}</span> forks
					</span>

					{/* Atualização */}
					<span className="ml-auto">
						Atualizado em{' '}
						{new Date(repository.updated_at).toLocaleDateString('pt-BR', {
							day: 'numeric',
							month: 'short',
						})}
					</span>
				</div>
			</div>

			{/* Modal de Detalhes do Repositório */}
			{isOpen && (
				<RepositoryDetailModal
					repository={repository}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	)
}

export default RepositoryCard
