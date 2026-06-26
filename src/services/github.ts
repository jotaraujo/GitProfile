import type { Repository, User } from '../types/github'

const API_URL = 'https://api.github.com/users'
const token = import.meta.env.VITE_GITHUB_TOKEN

const headers: HeadersInit = token ? { Authorization: `token ${token}` } : {}

export const userSearch = async (username: string): Promise<User> => {
	const response = await fetch(`${API_URL}/${username}`, {
		headers,
	})

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

export const getUserRepositories = async (
	username: string,
	page: number,
): Promise<Repository[]> => {
	const response = await fetch(
		`${API_URL}/${username}/repos?sort=created&direction=desc&per_page=12&page=${page}`,
		{
			headers,
		},
	)

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`Erro ao buscar os repositórios de ${username}.`)
		}
		if (response.status === 403) {
			throw new Error('Limite de requisição do GitHub atingido.')
		}
		throw new Error('Erro ao buscar os repositórios.')
	}

	const data = await response.json()

	return data
}
