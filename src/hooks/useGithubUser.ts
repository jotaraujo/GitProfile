import { useQuery } from '@tanstack/react-query'
import { userSearch } from '../services/github'

// Hook customizado useGithubUser: gerencia a busca das informações de perfil do usuário
export const useGithubUser = (username: string) => {
	const query = useQuery({
		// Função de requisição para buscar o usuário
		queryFn: () => userSearch(username),
		// Chave de cacheamento no React Query
		queryKey: ['github', 'user', username],
		// Habilita a query apenas se o username estiver preenchido
		enabled: !!username,
	})

	return query
}
