import { useQuery } from '@tanstack/react-query'
import { getRepositoryContent } from '../services/github'

export const useRepoContents = (
	owner: string,
	repo: string,
	isOpen: boolean,
) => {
	const query = useQuery({
		queryKey: ['repo', 'content', owner, repo],
		queryFn: () => getRepositoryContent(owner, repo),
		enabled: isOpen && !!owner && !!repo,
	})

	return query
}
