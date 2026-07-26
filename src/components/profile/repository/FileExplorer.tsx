import { File, Folder } from 'lucide-react'

interface FileExplorerProps {
	pathParts: string[]
	currentPath: string
	setCurrentPath: (path: string) => void
	handleBackClick: () => void
	sortedContents: Array<{ path: string; name: string; type: string }>
	isLoading: boolean
	error: Error | null
	setSelectedFilePath: (path: string) => void
}

const FileExplorer = ({
	pathParts,
	currentPath,
	setCurrentPath,
	handleBackClick,
	sortedContents,
	isLoading,
	error,
	setSelectedFilePath,
}: FileExplorerProps) => (
	<div className="flex flex-col flex-grow gap-2 flex-shrink-0 min-h-0">
		<span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
			Estrutura do Projeto
		</span>

		{/* Breadcrumb rolável */}
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

			{/* Fade Gradiente Direito */}
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
							<Folder size={16} className="text-primary-variant fill-current" />
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
)

export default FileExplorer
