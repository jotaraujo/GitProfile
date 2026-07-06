import type { RepoContentItem, Repository, User } from '../types/github'

const API_URL = 'https://api.github.com/users'
// Token de acesso do GitHub carregado das variáveis de ambiente (Vite)
const token = import.meta.env.VITE_GITHUB_TOKEN

// Configuração dos headers de autorização se o token estiver disponível para aumentar limite de chamadas
const headers: HeadersInit = token ? { Authorization: `token ${token}` } : {}

// Busca o perfil público de um usuário no GitHub pelo username
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

// Busca a lista de repositórios de um usuário de forma paginada (12 itens por página)
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

export const getRepositoryContent = async (
	owner: string,
	repo: string,
): Promise<RepoContentItem[]> => {
	const response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/contents`,
		{
			headers,
		},
	)

	if (response.status === 404) {
		throw new Error(`Erro ao buscar o conteúdo de ${repo}`)
	}
	if (response.status === 403) {
		throw new Error(
			`Limite de requisição do Github atingido ao buscar o conteúdo de ${repo}`,
		)
	}
	if (response.status === 401) {
		throw new Error(
			`Token de acesso do Github expirado ao buscar o conteúdo de ${repo}`,
		)
	}

	const data = await response.json()

	return data
}
