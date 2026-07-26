import { useEffect, useState } from 'react'
import { Building2, MapPin, Pin, Users } from 'lucide-react'
import FollowersListModal from '../modals/FollowersListModal'
import CandidateTriageForm from './CandidateTriageForm'
import { usePinnedProfileStore } from '../../store/usePinnedProfileStore'
import { useFollowStore } from '../../store/useFollowStore'
import type { User } from '../../types/github'
import { useAuthStore } from '../../store/useAuthStore'
import { useNotificationStore } from '../../store/useNotificationStore'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import IconButton from '../ui/IconButton'

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
	const { user: currentUser, profile } = useAuthStore()
	const { isFollowing, followUser, unfollowUser, fetchFollowedUsernames } =
		useFollowStore()
	const following = isFollowing(user.login)
	const isOwnProfile =
		Boolean(profile?.github_username) &&
		profile?.github_username?.toLowerCase() === user.login.toLowerCase()
	const { addNotification } = useNotificationStore()
	const { isPinned, pinProfile, unpinProfile } = usePinnedProfileStore()

	// Estados locais para controlar a exibição do formulário
	const [isFlipped, setIsFlipped] = useState(false) // Controla a animação 3D de rotação do card
	const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false)
	const [followersModalTab, setFollowersModalTab] = useState<
		'followers' | 'following'
	>()

	const pinned = isPinned(user.login)

	useEffect(() => {
		if (currentUser?.id) {
			fetchFollowedUsernames(currentUser.id)
		}
	}, [currentUser?.id, fetchFollowedUsernames])

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

	const handleFollowToggle = async () => {
		if (following) {
			unfollowUser(user.login, currentUser?.id)
		} else {
			await followUser(user.login, currentUser?.id)

			addNotification(
				{
					username: user.login,
					avatarUrl: user.avatar_url,
					message: 'Foi adicionado aos seus perfis seguidos!',
				},
				currentUser?.id,
			)
		}
	}

	const handleOpenFollowersModal = (tab: 'followers' | 'following') => {
		setFollowersModalTab(tab)
		setIsFollowerModalOpen(true)
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
							<IconButton
								icon={
									<Pin size={18} className={pinned ? 'fill-current' : ''} />
								}
								onClick={handlePinToggle}
								tooltip={pinned ? 'Desfixar perfil' : 'Fixar perfil'}
								aria-pressed={pinned}
								className={`mt-2 rounded-lg border ${pinned ? 'bg-primary-variant/20 border-primary-variant text-primary-variant' : 'bg-transparent border-outline hover:bg-bright text-muted hover:text-main'}`}
							/>
						</div>
						<div className="flex items-center gap-2">
							<h2 className="text-primary font-mono text-sm mb-3">
								@{user.login}
							</h2>
							{isOwnProfile && (
								<span className="badge badge-primary badge-outline text-xs mb-3">
									Seu Perfil
								</span>
							)}
						</div>
						<p className="text-muted text-xs mb-4">
							Membro desde {date(user.created_at)}
						</p>
						<p className="text-muted text-sm leading-relaxed mb-4">
							{user.bio}
						</p>
						{!isOwnProfile && (
							<Button
								variant={following ? 'primary' : 'outline'}
								fullWidth
								onClick={handleFollowToggle}
								className="mb-4"
							>
								{following ? 'Unfollow' : 'Follow'}
							</Button>
						)}
						<div className="flex gap-3 border-b-2 border-outline mb-4 py-4 w-full">
							<button
								type="button"
								onClick={() => handleOpenFollowersModal('followers')}
								className="flex items-center gap-2 text-sm hover:text-primary-variant transition-colors cursor-pointer"
							>
								<Users size={18} />
								<span className="font-bold">{user.followers}</span> followers
							</button>
							<span className="text-sm px-3">•</span>
							<button
								type="button"
								onClick={() => handleOpenFollowersModal('following')}
								className="flex items-center gap-2 text-sm hover:text-primary-variant transition-colors cursor-pointer"
							>
								<span className="font-bold">{user.following}</span> following
							</button>
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
							<Button
								variant="outline"
								fullWidth
								onClick={() => setIsFlipped(true)}
								className="mt-4"
							>
								Anotações de Triagem
							</Button>
						)}
					</div>
					{/* =========================================================
					// SEÇÃO 2: VERSO DO CARD (Formulário Privado de Triagem)
					// ========================================================= */}
					{isRecruiter && (
						<CandidateTriageForm
							user={user}
							onClose={() => setIsFlipped(false)}
						/>
					)}
				</div>
				<FollowersListModal
					isOpen={isFollowerModalOpen}
					onClose={() => setIsFollowerModalOpen(false)}
					username={user.login}
					initialTab={followersModalTab}
				/>
			</div>
		</>
	)
}

export default ProfileCard
