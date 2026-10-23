import { http } from 'msw'
import type { Repository, RepoContentItem, RepoFileContent, User } from '../../src/types/github'

const API_URL = 'https://api.github.com'

// --- Fixtures ---

export const mockUser = (overrides: Partial<User> = {}): User => ({
	login: 'octocat',
	name: 'The Octocat',
	avatar_url: 'https://github.com/octocat.png',
	bio: 'GitHub mascot',
	html_url: 'https://github.com/octocat',
	location: 'San Francisco',
	followers: 5832,
	following: 9,
	public_gists: 8,
	company: 'GitHub',
	created_at: '2011-01-25T18:44:36Z',
	...overrides,
})

export const mockRepository = (overrides: Partial<Repository> = {}): Repository => ({
	id: 1,
	name: 'Hello-World',
	private: false,
	owner: { login: 'octocat', name: 'The Octocat', avatar_url: 'https://github.com/octocat.png' },
	html_url: 'https://github.com/octocat/Hello-World',
	description: 'My first repository on GitHub.',
	created_at: '2011-01-26T18:44:36Z',
	updated_at: '2011-01-26T18:44:36Z',
	size: 12,
	stargazers_count: 42,
	watchers_count: 100,
	language: 'C#',
	forks_count: 8,
	default_branch: 'master',
	...overrides,
})

export const mockRepoContent = (overrides: Partial<RepoContentItem> = {}): RepoContentItem => ({
	name: 'README.md',
	type: 'file',
	path: 'README.md',
	...overrides,
})

export const mockRepoFileContent = (overrides: Partial<RepoFileContent> = {}): RepoFileContent => ({
	name: 'README.md',
	path: 'README.md',
	size: 1024,
	content: 'IyMgSGVsbG8gV29ybGQK',
	encoding: 'base64',
	...overrides,
})

// --- Handlers ---

export const githubHandlers = [
	// 1. GET /users/:username — perfil do usuário
	http.get(`${API_URL}/users/:username`, ({ params }) => {
		const username = String(params.username)

		if (username === 'not-found') {
			return new Response(
				JSON.stringify({ message: 'Not Found', documentation_url: 'https://docs.github.com/rest/users/users#get-a-user' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			)
		}

		if (username === 'rate-limited') {
			return new Response(
				JSON.stringify({ message: 'API rate limit exceeded' }),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			)
		}

		return new Response(JSON.stringify(mockUser({ login: username })), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	}),

	// 2. GET /users/:username/repos — repositórios paginados
	http.get(`${API_URL}/users/:username/repos`, ({ request }) => {
		const url = new URL(request.url)
		const username = url.pathname.split('/')[3]
		const page = Number(url.searchParams.get('page') ?? '1')

		if (username === 'not-found') {
			return new Response(
				JSON.stringify({ message: 'Not Found' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			)
		}

		if (username === 'rate-limited') {
			return new Response(
				JSON.stringify({ message: 'API rate limit exceeded' }),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			)
		}

		const perPage = 12
		const repos = Array.from({ length: perPage }, (_, i) =>
			mockRepository({
				id: (page - 1) * perPage + i + 1,
				name: `repo-${page}-${i + 1}`,
				language: i % 2 === 0 ? 'TypeScript' : 'Python',
			}),
		)

		return new Response(JSON.stringify(repos), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	}),

	// 3. GET /repos/:owner/:repo/contents — conteúdo de diretório
	http.get(`${API_URL}/repos/:owner/:repo/contents/:path?`, ({ params }) => {
		const owner = String(params.owner)
		const repo = String(params.repo)

		if (owner === 'ghost' || repo === 'ghost') {
			return new Response(
				JSON.stringify({ message: 'Not Found' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			)
		}

		if (owner === 'rate-limited' || repo === 'rate-limited') {
			return new Response(
				JSON.stringify({ message: 'API rate limit exceeded' }),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			)
		}

		return new Response(
			JSON.stringify([
				mockRepoContent({ name: 'README.md', type: 'file', path: 'README.md' }),
				mockRepoContent({ name: 'src', type: 'dir', path: 'src' }),
				mockRepoContent({ name: 'package.json', type: 'file', path: 'package.json' }),
			]),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		)
	}),

	// 4. GET /repos/:owner/:repo/contents/:path — conteúdo de arquivo específico
	http.get(`${API_URL}/repos/:owner/:repo/contents/:path`, ({ params }) => {
		const owner = String(params.owner)
		const repo = String(params.repo)
		const path = String(params.path)

		if (owner === 'ghost' || repo === 'ghost') {
			return new Response(
				JSON.stringify({ message: 'Not Found' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			)
		}

		if (owner === 'rate-limited' || repo === 'rate-limited') {
			return new Response(
				JSON.stringify({ message: 'API rate limit exceeded' }),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			)
		}

		return new Response(
			JSON.stringify(
				mockRepoFileContent({
					name: path.split('/').pop() ?? 'file.txt',
					path,
					content: Buffer.from('console.log("Hello World")').toString('base64'),
				}),
			),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		)
	}),
]