import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../lib/supabase'
import { Bookmark, FolderGit2, Trash2, ExternalLink, Star } from 'lucide-react'

// Interface para perfis salvos (Tabela: saved_profiles)
interface SavedProfileItem {
	id: string
	github_username: string
	avatar_url: string | null
	display_name: string | null
	saved_at: string
}

// Interface para repositórios salvos (Tabela: saved_repositories)
interface SavedRepoItem {
	id: string
	repo_id: number
	repo_name: string
	owner_login: string
	description: string | null
	language: string | null
	stars_count: number
	saved_at: string
}

const Saved = () => {
	const { user } = useAuthStore()

	const [activeTab, setActiveTab] = useState<'profiles' | 'repos'>('profiles')
	const [savedProfiles, setSavedProfiles] = useState<SavedProfileItem[]>([])
	const [savedRepos, setSavedRepos] = useState<SavedRepoItem[]>([])
	const [loading, setLoading] = useState(true)

	// Fetch dos salvamentos do usuário logado
	useEffect(() => {
		const fetchSavedData = async () => {
			if (!user?.id) return
			setLoading(true)

			try {
				// Busca os perfis favoritados
				const { data: profilesData } = await supabase
					.from('saved_profiles')
					.select('*')
					.eq('user_id', user.id)
					.order('saved_at', { ascending: false })

				// Busca os repositórios favoritados
				const { data: reposData } = await supabase
					.from('saved_repositories')
					.select('*')
					.eq('user_id', user.id)
					.order('saved_at', { ascending: false })

				setSavedProfiles(profilesData || [])
				setSavedRepos(reposData || [])
			} catch (err) {
				console.error('Erro ao buscar favoritados:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchSavedData()
	}, [user?.id])

	//Função para remover um perfil dos favoritados
	const handleRemoveProfile = async (id: string) => {
		try {
			const { error } = await supabase
				.from('saved_profiles')
				.delete()
				.eq('id', id)

			if (error) throw error
			setSavedProfiles((prev) => prev.filter((p) => p.id !== id))
		} catch (err) {
			console.error('Erro ao remover perfil salvo:', err)
		}
	}

	//Função para remover um repositório dos favoritados
	const handleRemoveRepo = async (id: string) => {
		try {
			const { error } = await supabase
				.from('saved_repositories')
				.delete()
				.eq('id', id)

			if (error) throw error
			setSavedRepos((prev) => prev.filter((r) => r.id !== id))
		} catch (err) {
			console.error('Erro ao remover repositório salvo:', err)
		}
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			{/* Cabeçalho */}
			<div className="border-b border-outline pb-4 mb-6">
				<h1 className="text-2xl font-bold text-main font-sans">
					Meus Favoritos
				</h1>
				<p className="text-xs text-muted font-sans mt-1">
					Seus perfis de desenvolvedores e repositórios favoritados para
					consulta rápida
				</p>
			</div>

			{/* Barra de 2 abas */}
			<div className="grid grid-cols-2 bg-surface p-1 rounded-xl border border-outline max-w-md mx-auto mb-8">
				<button
					type="button"
					onClick={() => setActiveTab('profiles')}
					className={`flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-sans font-semibold rounded-lg transition-all duration-300 ease-out active:scale-95 cursor-pointer ${activeTab === 'profiles' ? 'bg-base text-main shadow-md border border-outline-variant' : 'text-muted hover:text-main'}`}
				>
					<Bookmark size={16} />
					Perfis ({savedProfiles.length})
				</button>

				<button
					type="button"
					onClick={() => setActiveTab('repos')}
					className={`flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-sans font-semibold rounded-lg transition-all duration-300 ease-out active:scale-95 cursor-pointer ${activeTab === 'repos' ? 'bg-base text-main shadow-md border border-outline-variant' : 'text-muted hover:text-main'}`}
				>
					<FolderGit2 size={16} />
					Repositórios ({savedRepos.length})
				</button>
			</div>

			{/* Loading */}
			{loading ? (
				<div className="flex justify-center p-12">
					<span className="loading loading-spinner loading-lg text-primary" />
				</div>
			) : (
				<>
					{/* Aba 1: perfis favoritados */}
					{activeTab === 'profiles' &&
						(savedProfiles.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline rounded-lg text-center">
								<Bookmark size={48} className="text-muted mb-3 opacity-50" />
								<h3 className="text-base font-semibold text-main font-sans">
									Nenhum perfil favoritado
								</h3>
								<p className="text-xs text-muted font-sans max-w-sm mt-1">
									Clique no botão de favoritar nos perfis que você visitar para
									salvá-los aqui.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{savedProfiles.map((item) => (
									<div
										key={item.id}
										className="bg-surface border border-outline hover:border-outline-variant p-4 rounded-lg flex items-center justify-between transition-all group"
									>
										<Link
											to={`/profile/${item.github_username}`}
											className="flex items-center gap-3 min-w-0 flex-1"
										>
											<img
												src={
													item.avatar_url ||
													`https://github.com/${item.github_username}.png`
												}
												alt={item.github_username}
												className="w-10 h-10 rounded-full border border-outline object-cover flex-shrink-0"
											/>

											<div className="min-w-0">
												<p className="text-sm font-semibold text-main font-sans truncate group-hover:text-primary transition-colors">
													@{item.github_username}
												</p>
												{item.display_name && (
													<span className="text-xs text-muted font-sans truncate block">
														{item.display_name}
													</span>
												)}
											</div>
										</Link>

										<button
											type="button"
											onClick={() => handleRemoveProfile(item.id)}
											className="btn btn-ghost btn-circle btn-xs text-muted hover:text-error hover:bg-error/10 ml-2 cursor-pointer"
											title="Remover dos favoritos"
										>
											<Trash2 size={14} />
										</button>
									</div>
								))}
							</div>
						))}

					{/* Aba 2: repositórios favoritados */}
					{activeTab === 'repos' &&
						(savedRepos.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline rounded-lg text-center">
								<FolderGit2 size={48} className="text-muted mb-3 opacity-50" />
								<h3 className="text-base font-semibold text-main font-sans">
									Nenhum repositório salvo
								</h3>
								<p className="text-xs text-muted font-sans max-w-sm mt-1">
									Favorite repositórios para mantê-los organizados nesta aba.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{savedRepos.map((item) => (
									<div
										key={item.id}
										className="flex flex-col justify-between gap-3 bg-surface border border-outline hover:border-outline-variant p-5 rounded-lg transition-all"
									>
										<div className="flex items-start justify-between gap-2">
											<div>
												<a
													href={`https://github.com/${item.owner_login}/${item.repo_name}`}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-1.5 text-sm font-semibold text-primary font-sans hover:underline"
												>
													{item.owner_login}/{item.repo_name}
													<ExternalLink size={12} />
												</a>

												{item.description && (
													<p className="text-xs text-muted font-sans mt-1.5 line-clamp-2">
														{item.description}
													</p>
												)}
											</div>
											<button
												type="button"
												onClick={() => handleRemoveRepo(item.id)}
												className="btn btn-ghost btn-circle btn-xs text-muted hover:text-error hover:bg-error/10 flex-shrink-0 cursor-pointer"
												title="Remover dos favoritos"
											>
												<Trash2 size={14} />
											</button>
										</div>

										{/* Rodapé do card do repositório (lingaugem e stars) */}
										<div className="flex items-center gap-4 text-xs text-muted font-sans pt-2 border-t border-outline/50">
											{item.language && (
												<span className="flex items-center gap-1">
													<span className="w-2.5 h-2.5 rounded-full bg-primary" />
													{item.language}
												</span>
											)}
											{item.stars_count && (
												<span className="flex items-center gap-1">
													<Star
														size={12}
														className="text-warning fill-warning"
													/>
													{item.stars_count}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						))}
				</>
			)}
		</div>
	)
}

export default Saved
