import { useQuery } from '@tanstack/react-query'
import { getRepositoryFile } from '../services/github'

export const useRepoFileContent = ({
	owner,
	repo,
	path,
	enabled,
}: {
	owner: string
	repo: string
	path: string | null
	enabled: boolean
}) => {
	const query = useQuery({
		queryKey: ['repo', 'file', owner, repo, path],
		queryFn: () => getRepositoryFile(owner, repo, path || ''),
		enabled: enabled && !!path,
	})

	return query
}
