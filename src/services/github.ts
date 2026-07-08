import type {
	RepoContentItem,
	RepoFileContent,
	Repository,
	User,
} from '../types/github'

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

// Busca a estrutura de arquivos e diretórios de um repositório em um caminho específico (path)
// Retorna um array com metadados dos itens contidos na pasta
export const getRepositoryContent = async (
	owner: string,
	repo: string,
	path: string = '',
): Promise<RepoContentItem[]> => {
	const response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`,
		{
			headers,
		},
	)

	// Tratamento detalhado de erros HTTP para feedback do usuário
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

// Busca os metadados e o conteúdo de um arquivo específico em um repositório
// O conteúdo textual do arquivo é retornado pela API codificado em Base64
export const getRepositoryFile = async (
	owner: string,
	repo: string,
	path: string,
): Promise<RepoFileContent> => {
	const response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
		{
			headers,
		},
	)

	// Tratamento detalhado de erros HTTP
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
