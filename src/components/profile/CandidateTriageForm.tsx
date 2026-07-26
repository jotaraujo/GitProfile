import { useEffect, useState } from 'react'
import type { User, Candidate, Job } from '../../types/github'
import { useCandidateStore } from '../../store/useCandidateStore'

interface CandidateTriageFormProps {
	user: User
	onClose: () => void
}

const CandidateTriageForm = ({ user, onClose }: CandidateTriageFormProps) => {
	const {
		candidates,
		jobs,
		addCandidate,
		addJob,
		updateJob,
		evaluateRequirement,
	} = useCandidateStore()

	const [status, setStatus] = useState<Candidate['status']>('pendente')
	const [notes, setNotes] = useState('')
	const [contact, setContact] = useState('')
	const [isCreatingJob, setIsCreatingJob] = useState(false)
	const [newJobTitle, setNewJobTitle] = useState('')
	const [newJobRequirement, setNewJobRequirement] = useState('')
	const [isEditingRequirements, setIsEditingRequirements] = useState(false)
	const [editingRequirementsText, setEditingRequirementsText] = useState('')
	const [activeJobId, setActiveJobId] = useState(jobs[0]?.id || '')
	const [isSaving, setIsSaving] = useState(false)
	const [activeTab, setActiveTab] = useState<'avaliacao' | 'anotacoes'>(
		'avaliacao',
	)

	const existingCandidate = candidates.find((c) => c.login === user.login)
	const activeJob = jobs.find((j) => j.id === activeJobId)

	useEffect(() => {
		if (existingCandidate) {
			setStatus(existingCandidate.status)
			setNotes(existingCandidate.notes)
			setContact(existingCandidate.contactUrl)

			const job = jobs.find((j) => j.title === existingCandidate.jobRole)
			setActiveJobId(job ? job.id : '')
		} else {
			setStatus('pendente')
			setNotes('')
			setContact('')
			setActiveJobId(jobs[0]?.id || '')
		}
	}, [existingCandidate, jobs])

	const handleCreateJob = () => {
		if (!newJobTitle.trim()) return

		const requirementsList = newJobRequirement
			.split(',')
			.map((r) => r.trim())
			.filter(Boolean)

		const newJob: Job = {
			id: crypto.randomUUID
				? crypto.randomUUID()
				: Math.random().toString(36).substring(2, 9),
			title: newJobTitle.trim(),
			requirements: requirementsList,
			createdAt: Date.now(),
		}

		addJob(newJob)
		setActiveJobId(newJob.id)
		setNewJobTitle('')
		setNewJobRequirement('')
		setIsCreatingJob(false)
	}

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

	const handleSaveRequirements = () => {
		if (!activeJobId) return

		const cleanRequirements = editingRequirementsText
			.split(',')
			.map((r) => r.trim())
			.filter(Boolean)

		updateJob(activeJobId, { requirements: cleanRequirements })
		setIsEditingRequirements(false)
	}

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
				requirementsEvaluation: existingCandidate?.requirementsEvaluation || {},
				savedAt: Date.now(),
			})
		} catch (err) {
			console.error('Erro ao salvar triagem:', err)
		} finally {
			setIsSaving(false)
			onClose()
		}
	}

	return (
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
						className={`flex-1 py-2 text-center text-sm font-sans font-semibold border-b-2 transition-colors cursor-pointer ${
							activeTab === 'avaliacao'
								? 'border-primary-variant text-primary-variant'
								: 'border-transparent text-muted hover:text-main'
						}`}
					>
						Avaliação
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('anotacoes')}
						className={`flex-1 py-2 text-center text-sm font-sans font-semibold border-b-2 transition-colors cursor-pointer ${
							activeTab === 'anotacoes'
								? 'border-primary-variant text-primary-variant'
								: 'border-transparent text-muted hover:text-main'
						}`}
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
										onChange={({ target }) => setNewJobTitle(target.value)}
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
											onClick={handleCreateJob}
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
										onChange={({ target }) => setActiveJobId(target.value)}
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
													onClick={() => setIsEditingRequirements(false)}
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
												existingCandidate?.requirementsEvaluation?.[req] ||
												false
											return (
												<label
													key={req}
													className="flex items-center gap-2 text-sm text-main cursor-pointer"
												>
													<input
														type="checkbox"
														checked={isChecked}
														onChange={({ target }) =>
															handleRequirementToggle(req, target.checked)
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
					disabled={isSaving}
				>
					{isSaving ? (
						<span className="loading loading-spinner loading-xs" />
					) : (
						'Salvar Triagem'
					)}
				</button>
				<button
					type="button"
					onClick={onClose}
					className="btn btn-outline flex-1 hover:bg-error hover:text-main cursor-pointer"
				>
					Cancelar
				</button>
			</div>
		</div>
	)
}

export default CandidateTriageForm
