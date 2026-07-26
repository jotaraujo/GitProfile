import { ExternalLink } from 'lucide-react'
import type { Repository } from '../../../types/github'
import Modal from '../../ui/Modal'

interface CodeViewerModalProps {
	filePath: string
	fileData: { content: string; size: number } | null | undefined
	isLoading: boolean
	error: Error | null
	repository: Repository
	isBinary: boolean
	isTooLarge: boolean
	codeContent: string
	onClose: () => void
}

const CodeViewerModal = ({
	filePath,
	fileData,
	isLoading,
	error,
	repository,
	isBinary,
	isTooLarge,
	codeContent,
	onClose,
}: CodeViewerModalProps) => (
	<Modal isOpen onClose={onClose} maxWidth="4xl" className="p-0">
		{/* Cabeçalho Fixo */}
		<div className="flex items-center justify-between gap-4 p-4 md:p-6 border-b border-outline flex-shrink-0">
			<div className="flex flex-col gap-1 min-w-0">
				<h4 className="text-main font-mono text-sm truncate" title={filePath}>
					{filePath}
				</h4>
				{fileData && (
					<span className="text-xs text-muted font-mono">
						{(fileData.size / 1024).toFixed(1)} KB
					</span>
				)}
			</div>
		</div>

		{/* Conteúdo Rolável com os Estados do Arquivo */}
		<div className="flex-1 overflow-auto min-h-0 flex flex-col">
			{/* Loading State */}
			{isLoading && (
				<div className="flex-1 flex flex-col items-center justify-center p-12 text-muted gap-3">
					<span className="loading loading-spinner loading-lg text-primary" />
					<span className="text-sm font-mono">
						Buscando conteúdo do arquivo...
					</span>
				</div>
			)}
			{/* Error State */}
			{error && (
				<div className="flex-1 flex flex-col items-center justify-center p-12 text-error gap-2">
					<span className="text-sm font-mono font-semibold">
						Falha ao carregar o código.
					</span>
					<span className="text-xs text-muted">
						Verifique se o arquivo existe ou tente novamente.
					</span>
				</div>
			)}
			{/* Binary State */}
			{!isLoading && !error && isBinary && (
				<div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
					<span className="text-muted text-sm font-mono max-w-md">
						Este arquivo é binário ou mídia (como imagens, fontes ou PDFs) e não
						pode ser exibido como texto.
					</span>
					<a
						href={`${repository.html_url}/blob/${repository.default_branch || 'main'}/${filePath}`}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-primary btn-sm flex items-center gap-2 cursor-pointer"
					>
						<ExternalLink size={14} />
						Ver no GitHub
					</a>
				</div>
			)}
			{/* Code Content */}
			{!isLoading && !error && !isBinary && !isTooLarge && (
				<pre className="flex-1 overflow-auto p-4 md:p-6 rounded-b-xl text-xs md:text-sm font-mono bg-base text-main leading-relaxed select-text touch-auto overscroll-contain">
					<code>{codeContent}</code>
				</pre>
			)}
			{/* Too Large State */}
			{!isLoading && !error && !isBinary && isTooLarge && (
				<div className="flex-1 flex flex-col items-center justify-center p-12 text-error gap-2">
					<span className="text-xs text-error">
						Este arquivo é muito grande para ser exibido.
					</span>
					<a
						href={`${repository.html_url}/blob/${repository.default_branch || 'main'}/${filePath}`}
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
	</Modal>
)

export default CodeViewerModal
