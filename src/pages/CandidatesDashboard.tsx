import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../lib/supabase'
import {
	UserCheck,
	Bookmark,
	FolderGit2,
	Pencil,
	Trash2,
	X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Interface para as notas de triagem (Tabela: recruiter_notes)
interface RecruiterNote {
	id: string
	candidate_username: string
	notes: string | null
	status: 'pendente' | 'triagem' | 'aprovado' | 'recusado'
	updated_at: string
}

// Interface para os perfis salvos (Tabela: saved_profiles)
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

const CandidatesDashboard = () => {
	const { user } = useAuthStore()

	const [activeTab, setActiveTab] = useState<'notes' | 'profiles' | 'repos'>(
		'notes',
	)
	const [notes, setNotes] = useState<RecruiterNote[]>([])
	const [savedProfiles, setSavedProfiles] = useState<SavedProfileItem[]>([])
	const [savedRepos, setSavedRepos] = useState<SavedRepoItem[]>([])
	const [editingNote, setEditingNote] = useState<RecruiterNote | null>(null)
	const [editNotesText, setEditNotesText] = useState('')
	const [editStatus, setEditStatus] =
		useState<RecruiterNote['status']>('pendente')
	const [deletingNote, setDeletingNote] = useState<RecruiterNote | null>(null)
	const [saving, setSaving] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchDashBoardData = async () => {
			if (!user?.id) return
			setLoading(true)

			try {
				//Busca as notas de triagem
				const { data: notesData } = await supabase
					.from('recruiter_notes')
					.select('*')
					.eq('recruiter_id', user.id)
					.order('updated_at', { ascending: false })

				//Busca os perfis favoritos
				const { data: profilesData } = await supabase
					.from('saved_profiles')
					.select('*')
					.eq('user_id', user.id)
					.order('saved_at', { ascending: false })

				//Busca os repositórios favoritados
				const { data: reposData } = await supabase
					.from('saved_repositories')
					.select('*')
					.eq('user_id', user.id)
					.order('saved_at', { ascending: false })

				setNotes(notesData || [])
				setSavedProfiles(profilesData || [])
				setSavedRepos(reposData || [])
			} catch (err) {
				console.error('Erro ao buscar dados do dashboard:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchDashBoardData()
	}, [user?.id])

	// Atualiza nota e status no supabase
	const handleUpdateNote = async (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!editingNote) return
		setSaving(true)

		try {
			const { error } = await supabase
				.from('recruiter_notes')
				.update({
					notes: editNotesText,
					status: editStatus,
					updated_at: new Date().toISOString(),
				})
				.eq('id', editingNote.id)

			if (error) throw error

			//Atualiza a lista na memória
			setNotes((prev) =>
				prev.map((n) =>
					n.id === editingNote.id
						? { ...n, notes: editNotesText, status: editStatus }
						: n,
				),
			)

			setEditingNote(null) // Fecha o modal
		} catch (err) {
			console.error('Erro ao atualizar notar:', err)
		} finally {
			setSaving(true)
		}
	}

	// Exclui candidato do pipeline no supabase
	const handleDeleteNote = async () => {
		if (!deletingNote) return
		setSaving(true)

		try {
			const { error } = await supabase
				.from('recruiter_notes')
				.delete()
				.eq('id', deletingNote.id)

			if (error) throw error

			// Remove da lista na memória
			setNotes((prev) => prev.filter((n) => n.id !== deletingNote.id))
			setDeletingNote(null) // Fecha o modal
		} catch (err) {
			console.error('Erro ao deletar nota:', err)
		} finally {
			setSaving(true)
		}
	}

	return (
		<div className="p-6 max-w-6xl mx-auto">
			{/* Cabeçalho */}
			<div className="border-b border-outline pb-4 mb-6">
				<h1 className="text-2xl font-bold text-main font-sans">
					Painel do Recrutador
				</h1>
				<p className="text-xs text-muted font-sans mt-1">
					Gerencie os candidatos em triagem, perfis favoritados e repositórios
					salvos
				</p>
			</div>

			{/* Barra de abas */}
			<div className="grid grid-cols-3 bg-surface p-1 rounded-xl border border-outline max-w-xl mx-auto my-6">
				<button
					type="button"
					onClick={() => setActiveTab('notes')}
					className={`flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-sans font-semibold rounded-lg transition-all duration-300 ease-out active:scale-95 cursor-pointer ${activeTab === 'notes' ? 'bg-base text-main shadow-md border border-outline-variant' : 'text-muted hover:text-main'}`}
				>
					<UserCheck size={16} />
					Triagem ({notes.length})
				</button>

				<button
					type="button"
					onClick={() => setActiveTab('profiles')}
					className={`flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-sans font-semibold rounded-lg transition-all ease-out active:scale-95 cursor-pointer ${activeTab === 'profiles' ? 'bg-base text-main shadow-md border border-outline-variant' : 'text-muted hover:text-main'}`}
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
					{/* Aba 1: Triagem de Candidatos */}
					{activeTab === 'notes' &&
						(notes.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline rounded-lg text-center">
								<UserCheck size={48} className="text-muted mb-3 opacity-50" />
								<h3 className="text-base font-semibold text-main font-sans">
									Nenhum candidato em triagem
								</h3>
								<p className="text-xs text-muted font-sans max-w-sm mt-1">
									Adicione notas e status aos perfis que você visitar para
									organizá-los aqui.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{notes.map((item) => (
									<div
										key={item.id}
										className="flex flex-col justify-between gap-4 bg-surface border border-outline hover:border-outline-variant p-5 rounded-lg transition-all"
									>
										{/* cabeçalho do card */}
										<div className="flex items-start justify-between gap-3">
											<Link
												to={`/profile/${item.candidate_username}`}
												className="flex item-center gap-3 min-w-0 group"
											>
												<img
													src={`https://github.com/${item.candidate_username}.png`}
													alt={`${item.candidate_username}`}
													className="w-10 h-10 rounded-full border border-outline object-cover flex-shrink-0"
												/>
												<div className="min-w-0">
													<p className="text-sm font-semibold text-main font-sans truncate group-hover:text-primary transition-colors">
														@{item.candidate_username}
													</p>
												</div>
											</Link>

											{/* Badge de Status Semântica */}
											<span
												className={`badge text-xs font-sans capitalize ${item.status === 'aprovado' ? 'badge-success text-white' : item.status === 'triagem' ? 'badge-info text-white' : item.status === 'recusado' ? 'badge-error text-white' : 'badge-warning text-white'}`}
											>
												{item.status}
											</span>

											<div className="flex items-center gap-1">
												<button
													type="button"
													onClick={() => {
														setEditingNote(item)
														setEditNotesText(item.notes || '')
														setEditStatus(item.status)
													}}
													className="btn btn-ghost btn-xs text-muted hover:text-main cursor-pointer"
													title="Editar nota/status"
												>
													<Pencil size={14} />
												</button>
												<button
													type="button"
													onClick={() => setDeletingNote(item)}
													className="btn btn-ghost btn-xs text-muted hover:text-error cursor-pointer"
													title="Remover da triagem"
												>
													<Trash2 size={14} />
												</button>
											</div>
										</div>

										{/* Notas da triagem */}
										{item.notes && (
											<p className="bg-base text-xs text-muted font-sans p-3 rounded-md border border-outline line-clamp-3">
												"{item.notes}"
											</p>
										)}
									</div>
								))}
							</div>
						))}

					{/* Aba 2: Perfis favoritados */}
					{activeTab === 'profiles' &&
						(savedProfiles.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline rounded-lg text-center">
								<Bookmark size={48} className="text-muted mb-3 opacity-50" />
								<h3 className="text-base font-semibold text-main font-sans">
									Nenhum perfil favoritado
								</h3>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{savedProfiles.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between bg-surface border border-outline p-4 rounded-lg"
									>
										<Link
											to={`/profile/${item.github_username}`}
											className="flex items-center gap-3"
										>
											<img
												src={
													item.avatar_url ||
													`https://github.com/${item.github_username}.png`
												}
												alt=""
												className="w-10 h-10 rounded-full"
											/>
											<div>
												<p className="text-sm font-semibold text-main">
													@{item.github_username}
												</p>
											</div>
										</Link>
									</div>
								))}
							</div>
						))}

					{/* Aba 3: Repositórios favoritados */}
					{activeTab === 'repos' &&
						(savedRepos.length === 0 ? (
							<div className="flex flex-col items-center justify-center bg-surface p-12 border border-outline rounded-lg text-center">
								<FolderGit2 size={48} className="text-muted mb-3 opacity-50" />
								<h3 className="text-base font-semibold text-main font-sans">
									Nenhum repositório salvo
								</h3>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{savedRepos.map((item) => (
									<div
										key={item.id}
										className="flex flex-col gap-2 bg-surface border border-outline p-4 rounded-lg"
									>
										<h4 className="text-sm font-semibold text-primary">
											{item.owner_login}/{item.repo_name}
										</h4>
										{item.description && (
											<p className="text-xs text-muted">{item.description}</p>
										)}
									</div>
								))}
							</div>
						))}
				</>
			)}

			{/* Modal de Edição */}
			{editingNote && (
				<div role="dialog" aria-modal="true" className="modal modal-open">
					<div className="modal-box flex flex-col gap-4 bg-surface border boder-outline rounded-lg max-w-md relative p-6">
						<button
							type="button"
							onClick={() => setEditingNote(null)}
							className="btn btn-sm btn-circle absolute right-4 top-4 border-none bg-transparent hover:bg-bright text-muted hover:text-main cursor-pointer"
						>
							<X size={14} />
						</button>

						<h3 className="text-base font-semibold text-main font-sans">
							Editar Triagem de @{editingNote.candidate_username}
						</h3>

						<form onSubmit={handleUpdateNote} className="flex flex-col gap-4">
							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text text-muted text-xs font-semibold uppercase font-sans">
										Status
									</span>
								</label>
								<select
									value={editStatus}
									onChange={({ target }) =>
										setEditStatus(target.value as RecruiterNote['status'])
									}
									className="select select-bordered bg-base text-main border-outline w-full text-sm font-sans focus:outline-none"
								>
									<option value="pendente">Pendente</option>
									<option value="triagem">Em Triagem</option>
									<option value="aprovado">Aprovado</option>
									<option value="recusado">Recusado</option>
								</select>
							</div>

							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text text-muted text-xs font-semibold uppercase font-sans">
										Suas anotações
									</span>
								</label>
								<textarea
									value={editNotesText}
									onChange={({ target }) => setEditNotesText(target.value)}
									placeholder="Adicione observações da entrevista..."
									className="textarea textarea-bordered bg-base text-main border-outline w-full text-sm font-sans min-h-[100px] focus:outline-none"
								/>
							</div>

							<div className="flex justify-end gap-2 mt-2">
								<button
									type="button"
									onClick={() => setEditingNote(null)}
									className="btn btn-ghost btn-sm text-muted font-sans cursor-pointer"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={saving}
									className="btn btn-primary btn-sm text-white font-sans cursor-pointer"
								>
									{saving ? (
										<span className="loading loading-spinner loading-xs" />
									) : (
										'Salvar Alterações'
									)}
								</button>
							</div>
						</form>
					</div>
					<div
						className="modal-backdrop bg-black/60 backdrop-blur-sm"
						onClick={() => setEditingNote(null)}
					/>
				</div>
			)}

			{/* Modal de confirmação de exclusão */}
			{deletingNote && (
				<div role="dialog" aria-modal="true" className="modal modal-open">
					<div className="modal-box flex flex-col gap-4 bg-surface border border-outline rounded-lg max-w-sm relative p-6 text-center">
						<h3 className="text-base font-semibold text-main font-sans">
							Remover Candidato?
						</h3>
						<p className="text-xs text-muted font-sans">
							Tem certeza que deseja remover @{deletingNote.candidate_username}{' '}
							da sua lista de triagem?
						</p>

						<div className="flex justify-center gap-3 mt-2">
							<button
								type="button"
								onClick={() => setDeletingNote(null)}
								className="btn btn-ghost btn-sm text-muted font-sans cursor-pointer"
							>
								Cancelar
							</button>
							<button
								type="button"
								disabled={saving}
								onClick={handleDeleteNote}
								className="btn btn-error btn-sm text-white font-sans cursor-pointer"
							>
								{saving ? (
									<span className="loading loading-spinner loading-xs" />
								) : (
									'Confirmar Exclusão'
								)}
							</button>
						</div>
					</div>
					<div
						className="modal-backdrop bg-black/60 backdrop-blur-sm"
						onClick={() => setDeletingNote(null)}
					/>
				</div>
			)}
		</div>
	)
}

export default CandidatesDashboard
