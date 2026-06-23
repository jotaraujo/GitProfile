import type { User } from '../types/github'

const API_URL = 'https://api.github.com/users'

export const userSearch = async (username: string): Promise<User> => {
	const response = await fetch(`${API_URL}/${username}`)

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
