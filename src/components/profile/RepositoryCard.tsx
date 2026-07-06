import {
	GitFork,
	Star,
	X,
	Eye,
	Terminal,
	Folder,
	File,
	ExternalLink,
} from 'lucide-react'
import type { Repository } from '../../types/github'
import { languageColors } from '../../lib/Colors'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRepoContents } from '../../hooks/useRepoContents'

interface RepositoryCardProps {
	repository: Repository
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			document.documentElement.style.overflow = 'hidden'

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') setIsOpen(false)
			}
			window.addEventListener('keydown', handleKeyDown)

			return () => {
				document.body.style.overflow = 'unset'
				document.documentElement.style.overflow = 'unset'
				window.removeEventListener('keydown', handleKeyDown)
			}
		}
	}, [isOpen])

	// Busca dinâmica de arquivos da raiz do repositório usando o hook customizado (só roda se o modal estiver aberto)
	const {
		data: contents,
		isLoading,
		error,
	} = useRepoContents(repository.owner.login, repository.name, isOpen)

	// Ordena diretórios (dir) para o topo e arquivos (file) para a base
	const sortedContents = contents
		? [...contents].sort((a, b) => b.type.localeCompare(a.type))
		: []

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
					<span className="badge badge-outline border-outline-variant text-muted text-xs px-2 py-1 rounded-full">
						Público
					</span>
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

					{/* Stars - Ícone com cor do token e preenchimento correto */}
					<span className="flex items-center gap-1">
						<Star size={14} className="text-tertiary fill-current" />
						<span className="tabular-nums">
							{repository.stargazers_count}
						</span>{' '}
						stars
					</span>

					{/* Forks - Ícone linear correto */}
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

			{/* Modal de Detalhes - Renderizado via Portal na raiz do body para contornar Stacking Contexts */}
			{isOpen &&
				createPortal(
					<div
						onClick={() => setIsOpen(false)} // Fecha ao clicar no backdrop escuro
						className="modal modal-open backdrop-blur-sm bg-black/60 z-50 flex items-center justify-center"
						role="dialog"
						aria-modal="true"
					>
						{/* Parar propagação para cliques dentro do modal-box não fecharem o modal */}
						<div
							onClick={(e) => e.stopPropagation()}
							className="modal-box bg-surface border border-outline rounded-[10px] w-11/12 max-w-4xl relative p-6 flex flex-col gap-6 text-left max-h-[90vh] md:max-h-[600px] overflow-hidden"
						>
							{/* Botão de Fechar */}
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="absolute right-4 top-4 text-muted hover:text-main cursor-pointer z-10"
								aria-label="Fechar modal"
							>
								<X size={20} />
							</button>

							{/* Split Layout: Duas colunas lado a lado no desktop */}
							<div className="flex flex-col md:flex-row gap-6 min-h-0 flex-1 md:overflow-hidden">
								{/* COLUNA ESQUERDA: Metadados */}
								<div className="flex-grow flex-shrink flex flex-col gap-4 border-b border-outline md:border-b-0 md:border-r border-outline pb-6 md:pb-0 md:pr-6 justify-between md:max-w-md">
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between gap-4 pr-10">
											<h3
												className="text-main font-sans text-2xl font-bold truncate"
												title={repository.name}
											>
												{repository.name}
											</h3>
											<span className="badge badge-outline border-outline-variant text-muted text-xs px-2 py-1 rounded-full flex-shrink-0">
												Público
											</span>
										</div>
										{repository.description && (
											<p className="text-muted text-sm leading-relaxed max-h-[140px] overflow-y-auto pr-1">
												{repository.description}
											</p>
										)}
									</div>

									{/* Grid de Estatísticas */}
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
								</div>

								{/* COLUNA DIREITA: Explorador de Pastas */}
								<div className="flex-grow flex-shrink flex flex-col gap-2 min-h-0">
									<span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
										Estrutura do Projeto
									</span>

									{/* Loading State */}
									{isLoading && (
										<div className="flex flex-col gap-2 py-1">
											<div className="skeleton h-8 w-full" />
											<div className="skeleton h-8 w-full" />
											<div className="skeleton h-8 w-full" />
										</div>
									)}

									{/* Error State */}
									{error && (
										<p className="text-error text-xs py-1">
											Falha ao carregar arquivos da API.
										</p>
									)}

									{/* Lista de Pastas e Arquivos */}
									{!isLoading && sortedContents.length > 0 && (
										<div className="flex flex-col border border-outline rounded-lg divide-y divide-outline bg-base overflow-y-auto max-h-[220px] md:max-h-[320px] pr-1 no-scrollbar">
											{sortedContents.map((item) => (
												<div
													key={item.path}
													className="flex items-center gap-3 px-3 py-2 text-sm text-main hover:bg-surface-bright transition-colors font-mono"
												>
													{item.type === 'dir' ? (
														<Folder
															size={16}
															className="text-primary-variant fill-current"
														/>
													) : (
														<File size={16} className="text-muted" />
													)}
													<span className="truncate">{item.name}</span>
												</div>
											))}
										</div>
									)}

									{/* Lista Vazia */}
									{!isLoading && !error && sortedContents.length === 0 && (
										<p className="text-muted text-xs italic py-1">
											Repositório sem arquivos.
										</p>
									)}
								</div>
							</div>

							{/* Rodapé Fixo */}
							<div className="flex gap-3 border-t border-outline pt-4 flex-shrink-0">
								<a
									href={repository.html_url}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-primary flex-1 flex items-center justify-center gap-2 cursor-pointer"
								>
									<ExternalLink size={16} />
									Ver no GitHub
								</a>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	)
}

export default RepositoryCard
