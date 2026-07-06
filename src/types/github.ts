// Interface representando o perfil do usuário retornado pela API do GitHub
export interface User {
	login: string
	name: string | null
	avatar_url: string
	bio: string | null
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

export interface Job {
	id: string
	title: string
	requirements: string[]
	createdAt: number
}

export interface Candidate {
	login: string
	name: string | null
	avatar_url: string
	bio: string | null
	html_url: string

	//Detalhes da Triagem (Apenas para o Recrutador)
	jobRole: string //Cargo/Vaga alvo (ex: "Frontend React Jr")
	contactUrl: string //URL do LinkedIn ou e-mail de contato
	notes: string //Anotações textuais adicionais
	status: 'pendente' | 'triagem' | 'aprovado' | 'recusado'
	//Avaliação Dinâmica: Mapeia o requisito da vaga para true/false
	//Ex: { "React.js": true, "Zustand": false, "Inglês Avançado": true }
	requirementsEvaluation: Record<string, boolean>
	savedAt: number //Timestamp de quando o perfil foi salvo na fila
}

export interface CandidateStoreState {
	jobs: Job[]
	candidates: Candidate[]

	addJob: (job: Job) => void
	removeJob: (id: string) => void

	addCandidate: (candidate: Candidate) => void
	removeCandidate: (login: string) => void

	//Métodos de Triagem (Recrutamento)
	updateCandidateStatus: (login: string, status: Candidate['status']) => void
	evaluateRequirement: (
		candidateLogin: string,
		requirementKey: string,
		value: boolean,
	) => void
}

export interface RepoFileContent {
	name: string
	path: string
	size: number
	content: string
	encoding: string
}
