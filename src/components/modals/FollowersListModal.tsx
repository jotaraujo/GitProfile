import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, X } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useFollowStore } from '../../store/useFollowStore'

interface GithubUserSimple {
	login: string
	avatar_url: string
	html_url: string
}

interface FollowerListModalProps {
	isOpen: boolean
	onClose: () => void
	username: string
	initialTab?: 'followers' | 'following'
}

const FollowersListModal = ({
	isOpen,
	onClose,
	username,
	initialTab = 'followers',
}: FollowerListModalProps) => {
	const navigate = useNavigate()
	const { user: currentUser } = useAuthStore()
	const { isFollowing, followUser, unfollowUser } = useFollowStore()

	const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
		initialTab,
	)
	const [usersList, setUsersList] = useState<GithubUserSimple[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!isOpen || !username) return

		const fetchUsers = async () => {
			setLoading(true)

			try {
				const res = await fetch(
					`https://api.github.com/users/${username}/${activeTab}`,
				)

				if (res.ok) {
					const data = await res.json()
					setUsersList(data)
				}
			} catch (err) {
				console.error('Erro ao buscar lista de usuários:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchUsers()
	}, [isOpen, username, activeTab])

	const handleFollow = (targetLogin: string, isCurrentlyFollowing: boolean) => {
		if (isCurrentlyFollowing) {
			unfollowUser(targetLogin, currentUser?.id)
		} else {
			followUser(targetLogin, currentUser?.id)
		}
	}

	if (!isOpen) return null

	return (
		<div className="modal modal-open">
			<div className="modal-box relative bg-surface border border-outline roudend-xl max-w-md w-full p-6 shadow-2xl">
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="btn btn-circle btn-sm absolute right-4 top-4 border-none bg-transparent hover:bg-bright text-muted hover:text-main cursor-pointer"
				>
					<X size={18} />
				</button>

				{/* Cabeçalho */}
				<div className="flex items-center gap-2 mb-4">
					<Users className="text-primary-variant" size={20} />
					<h3 className="text-lg font-bold text-main font-sans">
						Conexões de @{username}
					</h3>
				</div>

				{/* Abas: Followers / Following */}
				<div className="flex border-b border-outline mb-4">
					<button
						type="button"
						onClick={() => setActiveTab('followers')}
						className={`flex-1 py-2 text-center text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'followers' ? 'border-primary-variant text-primary-variant' : 'border-transparent text-muted hover:text-main'}`}
					>
						Seguidores (Followers)
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('following')}
						className={`flex-1 py-2 text-center text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'following' ? 'border-primary-variant text-primary-variant' : 'border-transparent text-muted hover:text-main'}`}
					>
						Seguindo (Following)
					</button>
				</div>

				{/* Lista de Devs */}
				<div className="flex flex-col gap-3 max-h-80 overflow-y-auto no-scrollbar">
					{loading ? (
						<div className="flex justify-center items-center py-8">
							<span className="loading loading-spinner loading-md text-primary-variant" />
						</div>
					) : usersList.length === 0 ? (
						<p className="text-center text-xs text-muted font-sans py-8">
							Nenhum desenvolvedor encontrado nesta lista.
						</p>
					) : (
						usersList.map((dev) => {
							const followingDev = isFollowing(dev.login)
							const isSelf =
								currentUser?.user_metadata?.preferred_username?.toLowerCase() ===
								dev.login.toLowerCase()

							return (
								<div
									key={dev.login}
									className="flex items-center justify-between p-3 rounded-lg bg-base border border-outline/50 hover:border-outline transition-colors"
								>
									<div
										onClick={() => {
											onClose()
											navigate(`/profile/${dev.login}`)
										}}
										className="flex items-center gap-3 cursor-pointer group"
									>
										<img
											src={dev.avatar_url}
											alt={dev.login}
											className="w-10 h-10 rounded-full border border-outline group-hover:border-primary-variant transition-colors"
										/>
										<span className="text-sm font-semibold text-main group-hover:text-primary-variant font-mono transition-colors">
											@{dev.login}
										</span>
									</div>

									{!isSelf && (
										<button
											type="button"
											onClick={() => handleFollow(dev.login, followingDev)}
											className={`btn btn-xs ${followingDev ? 'btn-primary text-main' : 'btn-outline border-outline hover:bg-primary hover:text-main'}`}
										>
											{followingDev ? 'Following' : 'Follow'}
										</button>
									)}
								</div>
							)
						})
					)}
				</div>
			</div>
			<div
				className="modal-backdrop bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
		</div>
	)
}

export default FollowersListModal
