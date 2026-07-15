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
import { languageColors } from '../../lib/colors'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRepoContents } from '../../hooks/useRepoContents'
import { useRepoFileContent } from '../../hooks/useRepoFileContent'

interface RepositoryCardProps {
	repository: Repository
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
	// Controle de abertura do modal principal de detalhes do repositório
	const [isOpen, setIsOpen] = useState(false)
	// Caminho atual dentro do explorador de arquivos (vazio '' indica a raiz do projeto)
	const [currentPath, setCurrentPath] = useState<string>('')
	// Caminho do arquivo selecionado para visualização no modal de código (null indica que o visualizador está fechado)
	const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)

	useEffect(() => {
		if (isOpen) {
			// Bloqueia a rolagem da página principal de fundo enquanto o modal está ativo
			document.body.style.overflow = 'hidden'
			document.documentElement.style.overflow = 'hidden'

			// Captura o atalho de teclado 'Escape' para fechamento intuitivo em cascata
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					if (selectedFilePath) {
						// Se o visualizador de código estiver aberto, fecha apenas ele (volta para a estrutura de pastas)
						setSelectedFilePath(null)
					} else {
						// Se estiver na estrutura de pastas, fecha o modal principal
						setIsOpen(false)
					}
				}
			}
			window.addEventListener('keydown', handleKeyDown)

			// Cleanup: restaura a rolagem e remove o listener de eventos de teclado
			return () => {
				document.body.style.overflow = 'unset'
				document.documentElement.style.overflow = 'unset'
				window.removeEventListener('keydown', handleKeyDown)
			}
		} else {
			// Reseta a navegação de pastas e arquivos quando o modal principal é fechado
			setCurrentPath('')
			setSelectedFilePath(null)
		}
	}, [selectedFilePath, isOpen])

	// Busca dinâmica da lista de arquivos da pasta atual (currentPath) do repositório
	const {
		data: contents,
		isLoading,
		error,
	} = useRepoContents({
		owner: repository.owner.login,
		repo: repository.name,
		path: currentPath,
		isOpen,
	})

	// Busca dinâmica do conteúdo do arquivo selecionado (selectedFilePath)
	const {
		data: fileData,
		isLoading: isFileLoading,
		error: fileError,
	} = useRepoFileContent({
		owner: repository.owner.login,
		repo: repository.name,
		path: selectedFilePath,
		enabled: !!selectedFilePath,
	})

	// Remove o último segmento do path atual para navegar um diretório acima ("voltar")
	const handleBackClick = () => {
		const parts = currentPath.split('/').filter(Boolean)
		parts.pop()
		setCurrentPath(parts.join('/'))
	}

	// Array de segmentos de diretório para renderizar o breadcrumb rolável
	const pathParts = currentPath.split('/').filter(Boolean)

	// Ordena a lista de conteúdos do GitHub colocando pastas (dir) sempre acima de arquivos (file)
	const sortedContents = contents
		? [...contents].sort((a, b) => b.type.localeCompare(a.type))
		: []

	// Lista de extensões comuns que indicam arquivos de mídia ou binários que não devem ser lidos como texto plano
	const binaryExtensions = [
		'.png',
		'.jpg',
		'.jpeg',
		'.gif',
		'.webp',
		'.ico',
		'.pdf',
		'.woff',
		'.woff2',
		'.ttf',
		'.otf',
		'.zip',
		'.tar',
		'.gz',
		'.mp4',
	]

	// Verifica se o arquivo selecionado é binário com base na sua extensão
	const isBinary = selectedFilePath
		? binaryExtensions.some((ext) =>
				selectedFilePath.toLowerCase().endsWith(ext),
			)
		: false

	// Limite de segurança de tamanho do arquivo: arquivos com mais de 1MB são marcados como muito grandes
	const isTooLarge = fileData ? fileData.size > 1024 * 1024 : false

	/**
	 * Decodifica o conteúdo retornado pela API do GitHub (que vem em formato Base64).
	 * O método convencional 'atob()' falha ou gera caracteres corrompidos ao encontrar
	 * caracteres multibyte UTF-8 (como acentos em português ou emojis).
	 * Para solucionar isso, convertemos os bytes em sequências de escape percentual (escape URI)
	 * e então decodificamos de forma segura com decodeURIComponent.
	 */
	const decodeBase64 = (base64Str: string) => {
		try {
			const cleanedStr = base64Str.replace(/\s/g, '') // Remove quebras de linha/espaços em branco gerados pela resposta da API
			return decodeURIComponent(
				atob(cleanedStr)
					.split('')
					.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join(''),
			)
		} catch (error) {
			return atob(base64Str) // Fallback seguro caso a string decodificada não possua caracteres UTF-8 complexos
		}
	}

	// Conteúdo de código final pronto para exibição
	const codeContent =
		fileData?.content && !isBinary && !isTooLarge
			? decodeBase64(fileData.content)
			: ''

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
								className="absolute right-4 top-4 text-muted hover:text-main focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2 focus:ring-offset-surface cursor-pointer z-10"
								aria-label="Fechar modal"
							>
								<X size={20} />
							</button>

							{/* Split Layout: Duas colunas lado a lado no desktop */}
							<div className="flex flex-col md:flex-row gap-6 min-h-0 flex-1 overflow-y-auto md:overflow-hidden touch-pan-y">
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
								<div className="flex flex-col flex-grow gap-2 flex-shrink-0 min-h-0">
									<span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
										Estrutura do Projeto
									</span>

									<div className="relative overflow-hidden w-full">
										{/* Fade Gradiente Esquerdo */}
										<div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-surface to-transparent pointer-events-none z-10" />
										<div className="flex items-center gap-1.5 text-xs text-muted font-mono overflow-x-auto whitespace-nowrap px-4 py-1 flex-nowrap no-scrollbar">
											<button
												type="button"
												onClick={() => setCurrentPath('')}
												className="hover:text-main hover:underline cursor-pointer flex-shrink-0"
											>
												Root
											</button>

											{pathParts.map((part, index) => {
												const partPath = pathParts.slice(0, index + 1).join('/')

												return (
													<span
														key={partPath}
														className="flex items-center gap-1.5 flex-shrink-0"
													>
														<span className="text-outline-variant">/</span>
														<button
															type="button"
															onClick={() => setCurrentPath(partPath)}
															className="hover:text-main hover:underline cursor-pointer"
														>
															{part}
														</button>
													</span>
												)
											})}
										</div>

										{/* Fade Grandiente Direito */}
										<div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-surface to-transparent pointer-events-none z-10" />
									</div>

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
										<div className="flex flex-col border border-outline rounded-lg divide-y divide-outline bg-base overflow-y-auto max-h-[220px] md:max-h-[320px] pr-1 no-scrollbar flex-1 touch-pan-y overscroll-contain">
											{currentPath && (
												<div
													onClick={handleBackClick}
													className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-main hover:bg-surface-bright transition-colors font-mono cursor-pointer"
												>
													<Folder size={16} className="text-muted" />
													<span>.. (voltar)</span>
												</div>
											)}
											{sortedContents.map((item) => (
												<div
													key={item.path}
													onClick={() => {
														if (item.type === 'dir') {
															setCurrentPath(item.path)
														}
														if (item.type === 'file') {
															setSelectedFilePath(item.path)
														}
													}}
													className="flex items-center gap-3 px-3 py-2 text-sm text-main hover:bg-surface-bright transition-colors font-mono cursor-pointer"
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

			{/* Modal Secundário: Visualizador de Código */}
			{selectedFilePath &&
				createPortal(
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 transition-all duration-300"
						onClick={() => setSelectedFilePath(null)}
					>
						<div
							className="bg-[#0d1117] border border-outline rounded-xl w-full max-w-4xl max-h-[85vh] relative flex flex-col text-left ovwerflow-hidden shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Cabeçalho Fixo */}
							<div className="flex items-center justify-between gap-4 p-4 md:p-6 border-b border-outline flex-shrink-0">
								<div className="flex flex-col gap-1 min-w-0">
									<h4
										className="text-main font-mono text-sm truncate"
										title={selectedFilePath}
									>
										{selectedFilePath}
									</h4>
									{fileData && (
										<span className="text-xs text-muted font-mono">
											{(fileData.size / 1024).toFixed(1)} KB
										</span>
									)}
								</div>
								<button
									type="button"
									onClick={() => setSelectedFilePath(null)}
									className="text-muted hover:tex-main p-2 rounded-lg hover:bg-surface-bright flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2 focus:ring-offset-surface cursor-pointer"
									aria-label="Fechar vizualizador de código"
								>
									<X size={20} />
								</button>
							</div>

							{/* Conteúdo Rolável com os Estados do Arquivo */}
							<div className="flex-1 overflow-auto min-h-0 flex flex-col">
								{/* Loading State */}
								{isFileLoading && (
									<div className="flex-1 flex flex-col items-center justify-center p-12 text-muted gap-3">
										<span className="loading loading-spinner loading-lg text-primary" />
										<span className="text-sm font-mono">
											Buscando conteúdo do arquivo...
										</span>
									</div>
								)}
								{/* Error State */}
								{fileError && (
									<div className="flex-1 flex flex-col items-center justify-center p-12 text-error gap-2">
										<span className="text-sm font-mono font-semibold">
											Falha ao carregar o código.
										</span>
										<span className="text-xs text-muted">
											Verifique se o arquivo existe ou tente novamente.
										</span>
									</div>
								)}
								{/* isBinary included State */}
								{!isFileLoading && !fileError && isBinary && (
									<div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
										<span className="text-muted text-sm font-mono max-w-md">
											Este arquivo é binário ou mídia (como imagens, fontes ou
											PDFs) e não pode ser exibido como texto.
										</span>
										<a
											href={`${repository.html_url}/blob/${repository.default_branch || 'main'}/${selectedFilePath}`}
											target="_blank"
											rel="noopener noreferrer"
											className="btn btn-primary btn-sm flex items-center gap-2 cursor-pointer"
										>
											<ExternalLink size={14} />
											Ver no GitHub
										</a>
									</div>
								)}
								{!isFileLoading && !fileError && !isBinary && !isTooLarge && (
									<pre className="flex-1 overflow-auto p-4 md:p-6 rounded-b-xl text-xs md:text-sm font-mono bg-base text-main leading-relaxed select-text touch-auto overscroll-contain">
										<code>{codeContent}</code>
									</pre>
								)}
								{!isFileLoading && !fileError && !isBinary && isTooLarge && (
									<div className="flex-1 flex flex-col items-center justify-center p-12 text-error gap-2">
										<span className="text-xs text-error">
											Este arquivo é muito grande para ser exibido.
										</span>
										<a
											href={`${repository.html_url}/blob/${repository.default_branch || 'main'}/${selectedFilePath}`}
											target="_blank"
											rel="noopener noreferrer"
											className="btn btn-primary btn-sm flex items-center gap-2 cursor-pointer"
										>
											<ExternalLink size={14} />
											Ver no GitHub
										</a>
									</div>
								)}
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	)
}

export default RepositoryCard
