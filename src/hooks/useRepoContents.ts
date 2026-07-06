import { useQuery } from '@tanstack/react-query'
import { getRepositoryContent } from '../services/github'

export const useRepoContents = ({
	owner,
	repo,
	path = '',
	isOpen,
}: {
	owner: string
	repo: string
	path?: string
	isOpen: boolean
}) => {
	const query = useQuery({
		queryKey: ['repo', 'content', owner, repo, path],
		queryFn: () => getRepositoryContent(owner, repo, path),
		enabled: isOpen && !!owner && !!repo,
	})

	return query
}
