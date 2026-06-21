interface User {
  login: string,
  name: string | null,
  avatar_url: string,
  bio: string | null,
  location: string | null,
  followers: number,
  following: number,
  public_gists: number,
  company: string | null,
  html_url: string,
  created_at: string
}

export const userSearch = async (username: string): Promise<User> => {
	const response = await fetch(`https://api.github.com/users/${username}`)

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error('Usuário não encontrado.')
		}
		if (response.status === 403) {
			throw new Error('Limite de requisição do Github atingido.')
		}
		throw new Error('Erro ao buscar usuário.')
	}

	const data = await response.json()

	return data
}
