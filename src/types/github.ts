// Interface representando o perfil do usuário retornado pela API do GitHub
export interface User {
	login: string
	name: string | null
	avatar_url: string
	bio: string | null
	html_url: string
	location: string | null
	followers: number
	following: number
	public_gists: number
	company: string | null
	created_at: string
}

// Interface representando os repositórios públicos retornados pela API do GitHub
export interface Repository {
	id: number
	name: string
	private: boolean
	owner: User
	html_url: string
	description: string | null
	created_at: string
	updated_at: string
	size: number
	stargazers_count: number
	watchers_count: number
	language: string | null
	forks_count: number
	default_branch?: string
}

// Interface representando um item (arquivo ou diretório) retornado pela listagem de conteúdo do GitHub API
export interface RepoContentItem {
	name: string
	type: 'file' | 'dir'
	path: string
}

// Representa um item salvo na lista de histórico de pesquisas
export interface SearchHistoryItem {
	username: string
	avatarUrl: string
	searchedAt: string // Data de busca usada para ordenação cronológica
}

// Tipagem de estado e ações da store useSearchHistoryStore (Zustand)
export interface SearchHistoryState {
	history: SearchHistoryItem[]
	addSearch(username: string, avatarUrl: string): void
	removeSearch(username: string): void
	clearHistory(): void
}

// Informações básicas mantidas para um desenvolvedor fixado (Pinned)
export interface PinnedProfile {
	login: string
	name: string | null
	avatar_url: string
	bio: string | null
	pinnedAt: string
}

// Tipagem de estado e ações da store usePinnedProfileStore (Zustand)
export interface PinnedProfilesState {
	pinned: PinnedProfile[]
	pinProfile(profile: PinnedProfile): void
	unpinProfile(login: string): void
	isPinned(login: string): boolean
}

// Interface representando uma vaga de recrutamento criada pelo recrutador
export interface Job {
	id: string // Identificador único da vaga (UUID ou random ID)
	title: string // Título da vaga (ex: "Frontend Developer React")
	requirements: string[] // Lista de requisitos da vaga (ex: ["React", "CSS", "TypeScript"])
	createdAt: number // Timestamp de criação
}

// Interface representando um candidato na fila de triagem
export interface Candidate {
	login: string // Username do GitHub do candidato (chave primária)
	name: string | null // Nome do candidato
	avatar_url: string // URL da imagem de perfil
	bio: string | null // Biografia do GitHub
	html_url: string // Link do perfil do GitHub

	// Detalhes da Triagem (Apenas para o Recrutador)
	jobRole: string // Cargo/Vaga alvo (ex: "Frontend React Jr")
	contactUrl: string // URL do LinkedIn ou e-mail de contato
	notes: string // Anotações textuais adicionais de triagem
	status: 'pendente' | 'triagem' | 'aprovado' | 'recusado' // Status na fila
	// Avaliação Dinâmica: Mapeia cada requisito da vaga para um booleano
	// Ex: { "React": true, "Zustand": false }
	requirementsEvaluation: Record<string, boolean>
	savedAt: number // Timestamp de quando o perfil foi salvo na fila
}

// Interface definindo o estado e as ações da store global de recrutamento (Zustand)
export interface CandidateStoreState {
	jobs: Job[] // Lista de todas as vagas cadastradas
	candidates: Candidate[] // Lista de todos os candidatos em triagem

	// Ações para gerenciamento de vagas
	addJob: (job: Job) => void
	updateJob: (id: string, updatedFields: Partial<Job>) => void
	removeJob: (id: string) => void

	// Ações para gerenciamento de candidatos
	addCandidate: (candidate: Candidate) => void
	removeCandidate: (login: string) => void

	// Métodos auxiliares para triagem em tempo real
	updateCandidateStatus: (login: string, status: Candidate['status']) => void
	evaluateRequirement: (
		candidateLogin: string,
		requirementKey: string,
		value: boolean,
	) => void
}

// Interface representando os metadados e conteúdo base64 retornado ao buscar um arquivo do GitHub
export interface RepoFileContent {
	name: string
	path: string
	size: number
	content: string // Conteúdo codificado em base64 retornado pela API
	encoding: string // Tipo de codificação (geralmente "base64")
}
