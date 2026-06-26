import { useInfiniteQuery } from '@tanstack/react-query'
import { getUserRepositories } from '../services/github'

export const useGithubRepos = (username: string) => {
	return useInfiniteQuery({
		queryKey: ['github', 'repos', username],
		queryFn: ({ pageParam }) => getUserRepositories(username, pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === 12 ? allPages.length + 1 : undefined
		},
		enabled: !!username,
	})
}
