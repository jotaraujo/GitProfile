import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRepoContents } from '../../../hooks/useRepoContents'
import { useRepoFileContent } from '../../../hooks/useRepoFileContent'
import type { Repository } from '../../../types/github'
import Modal from '../../ui/Modal'
import CodeViewerModal from './CodeViewerModal'
import FileExplorer from './FileExplorer'
import RepositoryStats from './RepositoryStats'

interface RepositoryDetailModalProps {
	repository: Repository
	onClose: () => void
}

// Lista de extensões comuns que indicam arquivos de mídia ou binários
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

/**
 * Decodifica o conteúdo retornado pela API do GitHub (que vem em formato Base64).
 * O método convencional 'atob()' falha ou gera caracteres corrompidos ao encontrar
 * caracteres multibyte UTF-8 (como acentos em português ou emojis).
 * Para solucionar isso, convertemos os bytes em sequências de escape percentual (escape URI)
 * e então decodificamos de forma segura com decodeURIComponent.
 */
const decodeBase64 = (base64Str: string) => {
	try {
		const cleanedStr = base64Str.replace(/\s/g, '')
		return decodeURIComponent(
			atob(cleanedStr)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join(''),
		)
	} catch {
		return atob(base64Str)
	}
}

const RepositoryDetailModal = ({
	repository,
	onClose,
}: RepositoryDetailModalProps) => {
	// Caminho atual dentro do explorador de arquivos
	const [currentPath, setCurrentPath] = useState<string>('')
	// Caminho do arquivo selecionado para visualização
	const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)

	// Bloqueia a rolagem da página enquanto o modal está aberto
	useEffect(() => {
		document.body.style.overflow = 'hidden'
		document.documentElement.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = 'unset'
			document.documentElement.style.overflow = 'unset'
		}
	}, [])

	// Reseta navegação quando o modal fecha
	useEffect(() => {
		return () => {
			setCurrentPath('')
			setSelectedFilePath(null)
		}
	}, [])

	// Busca dinâmica da lista de arquivos da pasta atual
	const {
		data: contents,
		isLoading,
		error,
	} = useRepoContents({
		owner: repository.owner.login,
		repo: repository.name,
		path: currentPath,
		isOpen: true,
	})

	// Busca dinâmica do conteúdo do arquivo selecionado
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

	// Navega um diretório acima
	const handleBackClick = () => {
		const parts = currentPath.split('/').filter(Boolean)
		parts.pop()
		setCurrentPath(parts.join('/'))
	}

	// Array de segmentos de diretório para o breadcrumb
	const pathParts = currentPath.split('/').filter(Boolean)

	// Ordena colocando pastas sempre acima de arquivos
	const sortedContents = contents
		? [...contents].sort((a, b) => b.type.localeCompare(a.type))
		: []

	// Verifica se o arquivo selecionado é binário
	const isBinary = selectedFilePath
		? binaryExtensions.some((ext) =>
				selectedFilePath.toLowerCase().endsWith(ext),
			)
		: false

	// Limite de tamanho: arquivos com mais de 1MB são marcados como grandes demais
	const isTooLarge = fileData ? fileData.size > 1024 * 1024 : false

	// Conteúdo de código pronto para exibição
	const codeContent =
		fileData?.content && !isBinary && !isTooLarge
			? decodeBase64(fileData.content)
			: ''

	return (
		<>
			<Modal
				isOpen
				onClose={onClose}
				maxWidth="4xl"
				className="max-h-[90vh] md:max-h-[600px] overflow-hidden flex flex-col"
				onEscape={() => {
					if (selectedFilePath) {
						setSelectedFilePath(null)
					} else {
						onClose()
					}
				}}
			>
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
						<RepositoryStats repository={repository} />
					</div>

					{/* COLUNA DIREITA: Explorador de Pastas */}
					<FileExplorer
						pathParts={pathParts}
						currentPath={currentPath}
						setCurrentPath={setCurrentPath}
						handleBackClick={handleBackClick}
						sortedContents={sortedContents}
						isLoading={isLoading}
						error={error}
						setSelectedFilePath={setSelectedFilePath}
					/>
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
			</Modal>

			{/* Modal Secundário: Visualizador de Código */}
			{selectedFilePath && (
				<CodeViewerModal
					filePath={selectedFilePath}
					fileData={fileData}
					isLoading={isFileLoading}
					error={fileError}
					repository={repository}
					isBinary={isBinary}
					isTooLarge={isTooLarge}
					codeContent={codeContent}
					onClose={() => setSelectedFilePath(null)}
				/>
			)}
		</>
	)
}

export default RepositoryDetailModal
