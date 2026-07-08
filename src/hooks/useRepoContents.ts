import { useQuery } from '@tanstack/react-query'
import { getRepositoryContent } from '../services/github'

/**
 * Hook customizado para carregar a estrutura de arquivos/diretórios de um repositório
 * Utiliza TanStack Query para gerenciar cache, carregamento e re-tentativas automaticamente.
 */
export const useRepoContents = ({
	owner,
	repo,
	path = '',
	isOpen,
}: {
	owner: string
	repo: string
	path?: string
	isOpen: boolean // Define se o modal está aberto para economizar requisições
}) => {
	const query = useQuery({
		// A chave de cache inclui o path para isolar a estrutura de subpastas no cache
		queryKey: ['repo', 'content', owner, repo, path],
		queryFn: () => getRepositoryContent(owner, repo, path),
		// Só executa a requisição se o modal estiver ativo e tivermos os dados do repositório
		enabled: isOpen && !!owner && !!repo,
	})

	return query
}
