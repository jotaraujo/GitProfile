import { useQuery } from "@tanstack/react-query"
import { userSearch } from "../services/github"

export const useGithubUser = (username: string) => {
  const query = useQuery({
    queryFn: () => userSearch(username),
    queryKey:  ['github','user', username],
    enabled: !!username
  })

  return query
}