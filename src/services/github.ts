import type {
	RepoContentItem,
	RepoFileContent,
	Repository,
	User,
} from '../types/github'

const API_URL = 'https://api.github.com/users'
// Token de acesso do GitHub carregado das variáveis de ambiente (Vite)
const token = import.meta.env.VITE_GITHUB_TOKEN

// Configuração dos headers de autorização se o token estiver disponível
const getHeaders = (): HeadersInit => {
	return token ? { Authorization: `token ${token}` } : {}
}

// Helper com Fallback resiliente contra erros 401 (token expirado)
const fetchWithFallback = async (url: string): Promise<Response> => {
	let response = await fetch(url, { headers: getHeaders() })

	// Se o token no .env tiver expirado/revogado (401), tenta via requisição pública
	if (response.status === 401 && token) {
		console.warn(
			'VITE_GITHUB_TOKEN expirado/inválido. Usando acesso público...',
		)
		response = await fetch(url)
	}

	return response
}

// Busca o perfil público de um usuário no GitHub pelo username
export const userSearch = async (username: string): Promise<User> => {
	const response = await fetchWithFallback(`${API_URL}/${username}`)

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error('Usuário não encontrado.')
		}
		if (response.status === 403) {
			throw new Error('Limite de requisições do GitHub atingido.')
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
	const response = await fetchWithFallback(
		`${API_URL}/${username}/repos?sort=created&direction=desc&per_page=12&page=${page}`,
	)

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`Erro ao buscar os repositórios de ${username}.`)
		}
		if (response.status === 403) {
			throw new Error('Limite de requisições do GitHub atingido.')
		}
		throw new Error('Erro ao buscar os repositórios.')
	}

	const data = await response.json()

	return data
}

// Busca a estrutura de arquivos e diretórios de um repositório em um caminho específico (path)
export const getRepositoryContent = async (
	owner: string,
	repo: string,
	path: string = '',
): Promise<RepoContentItem[]> => {
	const response = await fetchWithFallback(
		`https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`,
	)

	// Tratamento detalhado de erros HTTP para feedback do usuário
	if (response.status === 404) {
		throw new Error(`Erro ao buscar o conteúdo de ${repo}`)
	}
	if (response.status === 403) {
		throw new Error(
			`Limite de requisições do GitHub atingido ao buscar o conteúdo de ${repo}`,
		)
	}

	const data = await response.json()

	return data
}

// Busca os metadados e o conteúdo de um arquivo específico em um repositório
export const getRepositoryFile = async (
	owner: string,
	repo: string,
	path: string,
): Promise<RepoFileContent> => {
	const response = await fetchWithFallback(
		`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
	)

	// Tratamento detalhado de erros HTTP
	if (response.status === 404) {
		throw new Error(`Erro ao buscar o conteúdo de ${repo}`)
	}
	if (response.status === 403) {
		throw new Error(
			`Limite de requisições do GitHub atingido ao buscar o conteúdo de ${repo}`,
		)
	}

	const data = await response.json()

	return data
}
