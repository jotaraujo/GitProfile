import { Building2, MapPin, Pin, Users } from 'lucide-react'
import { useState } from 'react'
import { usePinnedProfileStore } from '../../store/usePinnedProfileStore'
import type { User } from '../../types/github'

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

const ProfileCard = ({ user, isRecruiter = true }: ProfileCardProps) => {
	const { isPinned, pinProfile, unpinProfile } = usePinnedProfileStore()
	const [isFlipped, setIsFlipped] = useState(false)
	const [status, setStatus] = useState('pendente')
	const [notes, setNotes] = useState('')

	const pinned = isPinned(user.login)

	const handlePinToggle = () => {
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
						<button className="btn btn-outline w-full mb-4">Follow</button>
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
								className="btn btn-outline w-full mt-4"
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
								<div className="flex flex-col gap-4 mb-4">
									<label htmlFor="status" className="text-sm text-muted">
										Status
									</label>
									<select
										name="status"
										id="status"
										value={status}
										onChange={({ target }) => setStatus(target.value)}
										className="select select-bordered w-full bg-surface text-main border-outline rounded-[10px]"
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
							</div>
							<button
								className="btn btn-outline w-full mt-4"
								onClick={() => setIsFlipped(false)}
							>
								Voltar ao Perfil
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ProfileCard
