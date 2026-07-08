import { useQuery } from '@tanstack/react-query'
import { getRepositoryFile } from '../services/github'

/**
 * Hook customizado para carregar o conteúdo de um arquivo específico do repositório
 * Utiliza TanStack Query para gerenciar cache.
 */
export const useRepoFileContent = ({
	owner,
	repo,
	path,
	enabled,
}: {
	owner: string
	repo: string
	path: string | null // Caminho do arquivo selecionado
	enabled: boolean // Indica se a busca deve ser executada (ex: visualizador aberto)
}) => {
	const query = useQuery({
		// A chave de cache isola cada arquivo pelo seu caminho específico (path)
		queryKey: ['repo', 'file', owner, repo, path],
		queryFn: () => getRepositoryFile(owner, repo, path || ''),
		// Executa apenas se estiver habilitado e houver um caminho válido selecionado
		enabled: enabled && !!path,
	})

	return query
}
