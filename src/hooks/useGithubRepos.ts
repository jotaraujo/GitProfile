import { useInfiniteQuery } from '@tanstack/react-query'
import { getUserRepositories } from '../services/github'

// Hook customizado useGithubRepos: gerencia a paginação infinita dos repositórios do usuário
export const useGithubRepos = (username: string) => {
	return useInfiniteQuery({
		// Chave de cacheamento no React Query baseada no usuário
		queryKey: ['github', 'repos', username],
		// Função de requisição passando o parâmetro de página atual
		queryFn: ({ pageParam }) => getUserRepositories(username, pageParam),
		initialPageParam: 1,
		// Determina o índice da próxima página com base na quantidade retornada (limite por página = 12)
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === 12 ? allPages.length + 1 : undefined
		},
		// Apenas executa a query se um nome de usuário válido estiver presente
		enabled: !!username,
	})
}
