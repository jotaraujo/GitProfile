import { Building2, MapPin, Pin, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePinnedProfileStore } from '../../store/usePinnedProfileStore'
import type { User, Candidate, Job } from '../../types/github'
import { useCandidateStore } from '../../store/useCandidateStore'
import { useAuthStore } from '../../store/useAuthStore'
import { supabase } from '../../lib/supabase'

interface ProfileCardProps {
	user: User
	isRecruiter?: boolean
}

const date = (data: string) => {
	const newDate = new Date(data)
	const formatedDate = new Intl.DateTimeFormat('pt-BR', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(newDate)

	return formatedDate
}

const ProfileCard = ({ user, isRecruiter }: ProfileCardProps) => {
	// Hooks e ações da store de recrutamento global (Zustand)
	const { user: currentUser } = useAuthStore()
	const { isPinned, pinProfile, unpinProfile } = usePinnedProfileStore()
	const {
		candidates,
		jobs,
		addCandidate,
		addJob,
		updateJob,
		evaluateRequirement,
	} = useCandidateStore()

	// Estados locais para controlar a exibição do formulário
	const [isFlipped, setIsFlipped] = useState(false) // Controla a animação 3D de rotação do card
	const [status, setStatus] = useState<Candidate['status']>('pendente') // Status de triagem selecionado
	const [notes, setNotes] = useState('') // Anotações escritas pelo recrutador
	const [contact, setContact] = useState('') // URL de contato (LinkedIn/E-mail)
	const [isCreatingJob, setIsCreatingJob] = useState(false) // Controla o formulário de cadastro inline de vagas
	const [newJobTitle, setNewjobTitle] = useState('') // Input de título da nova vaga
	const [newJobRequirement, setNewJobRequirement] = useState('') // Input de requisitos separados por vírgula da nova vaga
	const [isEditingRequirements, setIsEditingRequirements] = useState(false) // Controla o formulário inline de edição de requisitos
	const [editingRequirementsText, setEditingRequirementsText] = useState('') // Requisitos em formato texto sendo editados
	const [activeJobId, setActiveJobId] = useState(jobs[0]?.id || '') // ID da vaga selecionada no dropdown
	const [isSaving, setIsSaving] = useState(false) // Controla o estado de carregamento (spinner) do botão de salvamento
	const [activeTab, setActiveTab] = useState<'avaliacao' | 'anotacoes'>(
		'avaliacao',
	) // Controla a aba ativa no verso do card

	// Busca reativa: procura se o candidato atual já possui triagem salva na store
	const existingCandidate = candidates.find((c) => c.login === user.login)
	// Busca reativa: encontra o objeto completo da vaga correspondente ao ID selecionado
	const activeJob = jobs.find((j) => j.id === activeJobId)

	const pinned = isPinned(user.login)

	/**
	 * Efeito de Sincronização Reativa (Fronteira Store ➔ Estado Local).
	 * Sempre que o candidato selecionado ou a lista de vagas mudar, nós sincronizamos os estados
	 * locais do formulário com as informações correspondentes da store.
	 * Se for um candidato novo, limpamos os estados locais para os valores padrão.
	 */
	useEffect(() => {
		if (existingCandidate) {
			// Preenche o formulário local com os dados da triagem já existente
			setStatus(existingCandidate.status)
			setNotes(existingCandidate.notes)
			setContact(existingCandidate.contactUrl)

			// Encontra o ID da vaga com base no título textual salvo no candidato
			const job = jobs.find((j) => j.title === existingCandidate.jobRole)
			setActiveJobId(job ? job.id : '')
		} else {
			// Limpa o formulário para receber um novo cadastro
			setStatus('pendente')
			setNotes('')
			setContact('')
			setActiveJobId(jobs[0]?.id || '')
		}
	}, [existingCandidate, jobs])

	// Alterna o estado de fixação do perfil no topo da página
	const handlePinToggle = async () => {
		if (pinned) {
			unpinProfile(user.login)
		} else {
			pinProfile({
				login: user.login,
				name: user.name,
				avatar_url: user.avatar_url,
				bio: user.bio,
				pinnedAt: new Date().toISOString(),
			})
		}

		if (!currentUser) return

		try {
			if (pinned) {
				await supabase
					.from('saved_profiles')
					.delete()
					.eq('user_id', currentUser.id)
					.eq('github_username', user.login)
			} else {
				await supabase.from('saved_profiles').insert({
					user_id: currentUser.id,
					github_username: user.login,
					avatar_url: user.avatar_url,
					display_name: user.name,
				})
			}
		} catch (err) {
			console.error('Erro ao sincronizar perfil salvo no supabase:', err)
		}
	}

	// Cria uma nova vaga a partir do formulário inline e insere na store
	const handleCreatejob = () => {
		if (!newJobTitle.trim()) return

		// Transforma a string de requisitos separados por vírgula em um array limpo
		const requirementsArray = newJobRequirement
			.split(',')
			.map((r) => r.trim())
			.filter(Boolean)

		const newJob: Job = {
			id: crypto.randomUUID
				? crypto.randomUUID()
				: Math.random().toString(36).substring(2, 9),
			title: newJobTitle.trim(),
			requirements: requirementsArray,
			createdAt: Date.now(),
		}

		addJob(newJob)

		// UX Premium: Seleciona automaticamente a vaga recém-criada no dropdown
		setActiveJobId(newJob.id)

		// Limpa os campos de input e fecha o formulário
		setNewjobTitle('')
		setNewJobRequirement('')
		setIsCreatingJob(false)
	}

	/**
	 * Manipulador de clique nos checkboxes de requisitos (Opção A).
	 * Se o candidato já existe na store, chama diretamente 'evaluateRequirement' para salvar a alteração.
	 * Se o candidato ainda não existe, nós criamos a ficha dele na store no primeiro clique para
	 * garantir que todas as modificações subsequentes de requisitos em tempo real funcionem.
	 */
	const handleRequirementToggle = (requirement: string, checked: boolean) => {
		if (!existingCandidate) {
			addCandidate({
				login: user.login,
				name: user.name,
				avatar_url: user.avatar_url,
				bio: user.bio,
				html_url: user.html_url,
				jobRole: activeJob ? activeJob.title : '',
				contactUrl: contact,
				notes: notes,
				status: status,
				requirementsEvaluation: { [requirement]: checked },
				savedAt: Date.now(),
			})
		} else {
			evaluateRequirement(user.login, requirement, checked)
		}
	}

	// Salva a alteração de requisitos na vaga selecionada através da store
	const handleSaveRequirements = () => {
		if (!activeJobId) return

		const cleanRequirements = editingRequirementsText
			.split(',')
			.map((r) => r.trim())
			.filter(Boolean)

		updateJob(activeJobId, { requirements: cleanRequirements })
		setIsEditingRequirements(false)
	}

	/**
	 * Função unificada de Salvamento (no Rodapé).
	 * Consolida todos os dados locais coletados (status, anotações, contatos, vaga) e grava/atualiza
	 * o candidato de uma só vez na store.
	 * Está configurada como assíncrona (async) com indicador de carregamento (isSaving) para estar
	 * pronta para a integração direta com o banco de dados do Supabase no futuro.
	 */
	const handleSaveCandidate = async () => {
		setIsSaving(true)
		try {
			await addCandidate({
				login: user.login,
				name: user.name,
				avatar_url: user.avatar_url,
				bio: user.bio,
				html_url: user.html_url,
				jobRole: activeJob ? activeJob.title : '',
				contactUrl: contact,
				notes: notes,
				status: status,
				// Preserva a avaliação de requisitos já efetuada
				requirementsEvaluation: existingCandidate?.requirementsEvaluation || {},
				savedAt: Date.now(),
			})

			// Vira o card de volta para a frente
			setIsFlipped(false)
		} catch (error) {
			console.error('Erro ao salvar triagem:', error)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<>
			{/* Contêiner do Card que suporta a animação 3D de virada (flip) */}
			<div className="flip-container m-8 max-w-md">
				<div className={`flip-inner ${isFlipped ? 'flipped' : ''}`}>
					{/* =========================================================
					// SEÇÃO 1: FRENTE DO CARD (Visualização do Perfil Público)
					// ========================================================= */}
					<div className="flip-front bg-surface flex flex-col items-start w-full p-6 rounded-lg border border-outline">
						<div className="avatar">
							<div className="rounded-md border border-outline-variant">
								<img src={user.avatar_url} alt="Foto do usuário" />
							</div>
						</div>
						<div className="flex items-center gap-4">
							<h1 className="text-main font-sans text-2xl font-bold mt-4 mb-2">
								{user.name}
							</h1>
							<button
								type="button"
								onClick={handlePinToggle}
								className={`mt-2 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${pinned ? 'bg-primary-variant/20 border-primary-variant text-primary-variant' : 'bg-transparent border-outline hover:bg-bright text-muted hover:text-main'} `}
								title={pinned ? 'Desfixar perfil' : 'Fixar perfil'}
								aria-pressed={pinned}
							>
								<Pin size={18} className={pinned ? 'fill-current' : ''} />
							</button>
						</div>
						<h2 className="text-primary font-mono text-sm mb-3">
							@{user.login}
						</h2>
						<p className="text-muted text-xs mb-4">
							Membro desde {date(user.created_at)}
						</p>
						<p className="text-muted text-sm leading-relaxed mb-4">
							{user.bio}
						</p>
						<button className="btn btn-outline w-full mb-4 hover:bg-primary hover:text-main">
							Follow
						</button>
						<div className="flex gap-3 border-b-2 border-outline mb-4 py-4 w-full">
							<p className="flex items-center gap-2 text-sm">
								<Users size={18} />
								<span className="font-bold">{user.followers}</span> followers
							</p>
							<span className="text-sm px-3">•</span>
							<p className="flex items-center gap-2 text-sm">
								<span className="font-bold">{user.following}</span> following
							</p>
						</div>
						<div className="flex gap-3 py-2 w-full">
							{user.location && (
								<>
									<p className="flex gap-2 text-sm text-muted mb-4">
										<MapPin size={18} />
										{user.location}
									</p>
								</>
							)}
							{user.company && (
								<>
									<span className="text-sm px-3">|</span>
									<p className="flex gap-2 text-sm text-muted">
										<Building2 size={18} />
										{user.company}
									</p>
								</>
							)}
						</div>
						{isRecruiter && (
							<button
								className="btn btn-outline w-full mt-4 hover:bg-primary hover:text-main"
								onClick={() => setIsFlipped(true)}
							>
								Anotações de Triagem
							</button>
						)}
					</div>
					{/* =========================================================
					// SEÇÃO 2: VERSO DO CARD (Formulário Privado de Triagem)
					// ========================================================= */}
					{isRecruiter && (
						<div className="flip-back bg-surface flex flex-col items-start w-full p-6 rounded-lg border border-outline overflow-y-auto">
							<div className="flex flex-col flex-1">
								<h3 className="text-main font-sans text-xl font-semibold mb-4">
									Triagem do Candidato
								</h3>
								<div className="flex flex-col gap-4 mb-4">
									<p className="text-muted text-xs">
										Anotações privadas para o perfil de @{user.login}
									</p>
								</div>
								<div className="flex border-b border-outline mb-4 w-full flex-shrink-0">
									<button
										type="button"
										onClick={() => setActiveTab('avaliacao')}
										className={`flex-1 py-2 text-center text-sm font-sans font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'avaliacao' ? 'border-primary-variant text-primary-variant' : 'border-transparent text-muted hover:text-main'}`}
									>
										Avaliação
									</button>
									<button
										type="button"
										onClick={() => setActiveTab('anotacoes')}
										className={`flex-1 py-2 text-center text-sm font-sans font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'anotacoes' ? 'border-primary-variant text-primary-variant' : 'border-transparent text-muted hover:text-main'}`}
									>
										Anotações
									</button>
								</div>
								<div className="flex flex-col gap-4 flex-1 w-full">
									{activeTab === 'avaliacao' ? (
										<>
											{isCreatingJob ? (
												<div className="flex flex-col gap-3 p-4 border border-outline rounded-lg bg-bright">
													<span className="text-xs font-semibold text-main uppercase tracking-wider">
														Cadastrar Nova Vaga
													</span>

													<input
														type="text"
														value={newJobTitle}
														onChange={({ target }) =>
															setNewjobTitle(target.value)
														}
														placeholder="Título da Vaga (ex: Frontend React Jr)"
														className="input input-bordered input-sm w-full bg-surface text-main border-outline rounded-sm"
													/>

													<input
														type="text"
														value={newJobRequirement}
														onChange={({ target }) =>
															setNewJobRequirement(target.value)
														}
														placeholder="Requisitos separados por vírgula (ex: React, Zustand, Git)"
														className="input input-bordered input-sm w-full bg-surafce text-main border-outline rounded-sm"
													/>

													<div className="flex gap-2 justify-end">
														<button
															type="button"
															onClick={() => setIsCreatingJob(false)}
															className="btn btn-ghost btn-xs text-muted hover:text-main hover:bg-error hover:text-main cursor-pointer"
														>
															Cancelar
														</button>
														<button
															type="button"
															onClick={handleCreatejob}
															className="btn btn-primary btn-xs cursor-pointer"
														>
															Salvar Vaga
														</button>
													</div>
												</div>
											) : (
												<div className="flex flex-col gap-2">
													<div className="flex items-center justify-between">
														<label
															htmlFor="job-select"
															className="text-sm text-muted font-sans font-semibold"
														>
															Vaga Alvo
														</label>
														<button
															type="button"
															onClick={() => setIsCreatingJob(true)}
															className="text-xs text-primary-variant hover:underline cursor-pointer"
														>
															+ Criar Nova Vaga
														</button>
													</div>

													<select
														id="job-select"
														value={activeJobId}
														onChange={({ target }) =>
															setActiveJobId(target.value)
														}
														className="select select-bordered w-full bg-surface text-main border-outline rounded=[10px]"
													>
														<option value="">Selecione uma vaga</option>
														{jobs.map((j) => (
															<option key={j.id} value={j.id}>
																{j.title}
															</option>
														))}
													</select>
												</div>
											)}

											<div className="flex flex-col gap-2">
												<label
													htmlFor="contact-input"
													className="text-sm text-muted font-sans font-semibold"
												>
													Contato (LinkedIn / E-mail)
												</label>
												<input
													id="contact-input"
													type="text"
													value={contact}
													onChange={({ target }) => setContact(target.value)}
													placeholder="https://linkedin.com/in/candidato"
													className="input input-bordered w-full bg-surface text-main border-outline rounded"
												/>
											</div>
											{activeJobId && activeJob && (
												<div className="flex flex-col gap-2 mt-4">
													<div className="flex items-center justify-between">
														<span className="text-xs font-semibold text-muted uppercase tracking-wider">
															Requisitos da Vaga
														</span>

														{!isEditingRequirements && (
															<button
																type="button"
																onClick={() => {
																	setIsEditingRequirements(true)
																	setEditingRequirementsText(
																		activeJob.requirements.join(', '),
																	)
																}}
																className="text-xs text-primary-variant hover:underline cursor-pointer"
															>
																Editar Requisitos
															</button>
														)}
													</div>

													{isEditingRequirements ? (
														<div className="flex flex-col gap-2">
															<input
																type="text"
																value={editingRequirementsText}
																onChange={({ target }) =>
																	setEditingRequirementsText(target.value)
																}
																className="input input-bordered input-sm w-full bg-surface text-main border-outline rounded-sm"
																placeholder="Requisitos separados por vírgula"
															/>

															<div className="flex gap-2 justify-end">
																<button
																	type="button"
																	onClick={() =>
																		setIsEditingRequirements(false)
																	}
																	className="btn btn-ghost btn-xs text-muted hover:bg-error hover:text-main cursor-pointer"
																>
																	Cancelar
																</button>
																<button
																	type="button"
																	onClick={handleSaveRequirements}
																	className="btn btn-primary btn-xs hover:bg-primary cursor-pointer"
																>
																	Salvar
																</button>
															</div>
														</div>
													) : (
														activeJob.requirements.map((req) => {
															const isChecked =
																existingCandidate?.requirementsEvaluation?.[
																	req
																] || false

															return (
																<label
																	key={req}
																	className="flex items-center gap-2 text-sm text-main cursor-pointer"
																>
																	<input
																		type="checkbox"
																		checked={isChecked}
																		onChange={({ target }) =>
																			handleRequirementToggle(
																				req,
																				target.checked,
																			)
																		}
																		className="checkbox checkbox-primary checkbox-sm focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2 focus:ring-offset-surface"
																	/>
																	<span>{req}</span>
																</label>
															)
														})
													)}
												</div>
											)}
										</>
									) : (
										<>
											<div className="flex flex-col gap-4 mb-4">
												<label htmlFor="status" className="text-sm text-muted">
													Status
												</label>
												<select
													name="status"
													id="status"
													value={status}
													onChange={({ target }) =>
														setStatus(target.value as Candidate['status'])
													}
													className={`select select-bordered w-full bg-surface border-outline rounded-[10px] ${
														status === 'aprovado'
															? 'text-success'
															: status === 'recusado'
																? 'text-error'
																: status === 'triagem'
																	? 'text-primary-variant'
																	: 'text-pending'
													}`}
												>
													<option value="pendente">Pendente</option>
													<option value="triagem">Em Triagem</option>
													<option value="aprovado">Aprovado</option>
													<option value="recusado">Recusado</option>
												</select>
											</div>
											<div className="flex flex-col gap-4 w-full">
												<label htmlFor="notes" className="text-sm text-muted">
													Anotações
												</label>
												<textarea
													name="notes"
													id="notes"
													value={notes}
													onChange={({ target }) => setNotes(target.value)}
													className="textarea textarea-bordered w-full min-h-[100px] bg-surface text-main border-outline rounded-[10px]"
												></textarea>
											</div>
										</>
									)}
								</div>
							</div>
							<div className="flex gap-2 w-full mt-6 flex-shrink-0">
								<button
									type="button"
									onClick={handleSaveCandidate}
									className="btn btn-primary flex-1 cursor-pointer"
									disabled={isSaving} //Desabilita cliques repetidos
								>
									{isSaving ? (
										<span className="loading loading-spinner loading-xs" />
									) : (
										'Salvar Triagem'
									)}
								</button>
								<button
									type="button"
									onClick={() => setIsFlipped(false)}
									className="btn btn-outline flex-1 hover:bg-error hover:text-main cursor-pointer"
								>
									Cancelar
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ProfileCard
