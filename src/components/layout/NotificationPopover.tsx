import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Trash2, X } from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'
import { useAuthStore } from '../../store/useAuthStore'

interface NotificationPopoverProps {
	isOpen: boolean
	onClose: () => void
}

const NotificationPopover = ({ isOpen, onClose }: NotificationPopoverProps) => {
	const navigate = useNavigate()
	const { user } = useAuthStore()
	const {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		clearNotifications,
	} = useNotificationStore()

	if (!isOpen) return null

	return (
		<div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-surface border border-outline rounded-xl p-4 shadow-2xl flex flex-col gap-3 text-left">
			{/* Cabeçalho */}
			<div className="flex items-center justify-between border-b border-outline pb-3">
				<div className="flex items-center gap-2">
					<Bell size={18} className="text-primary-variant" />
					<span className="font-sans font-bold text-sm text-main">
						Notificações
					</span>
					{unreadCount > 0 && (
						<span className="badge badge-primary badge-sm font-mono font-bold">
							{unreadCount}
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					{unreadCount > 0 && (
						<button
							type="button"
							onClick={() => markAllAsRead(user?.id)}
							className="text-xs text-primary-variant hover:underline flex items-center gap-1 cursor-pointer"
							title="Marcar todas como lidas"
						>
							<CheckCheck size={14} />
							<span>Lidas</span>
						</button>
					)}
					<button
						type="button"
						onClick={onClose}
						className="text-muted hover:text-main cursor-pointer"
					>
						<X size={16} />
					</button>
				</div>
			</div>

			{/* Lista de Notificações */}
			<div className="flex flex-col gap-2 max-h-80 overflow-y-auto no-scrollbar">
				{notifications.length === 0 ? (
					<div className="py-8 text-center text-xs text-muted font-sans">
						Nenhuma notificação no momento.
					</div>
				) : (
					notifications.map((n) => (
						<div
							key={n.id}
							onClick={() => {
								markAsRead(n.id)
								onClose()
								navigate(`/profile/${n.username}`)
							}}
							className={`flex gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${n.read ? 'bg-base/50 border-outline/50 opacity-70' : 'bg-base border-primary-variant/30 hover:border-primary-variant'}`}
						>
							<img
								src={n.avatarUrl}
								alt={n.username}
								className="w-9 h-9 rounded-full border border-outline"
							/>
							<div className="flex flex-col flex-1 gap-1 text-xs">
								<p className="text-main leading-snug">
									<strong className="font-semibold text-primary-variant">
										@{n.username}
									</strong>{' '}
									{n.message}{' '}
									{n.repoName && (
										<span className="font-mono text-secondary">
											{n.repoName}
										</span>
									)}
								</p>
								<span className="text-[10px] text-muted font-mono">
									{new Date(n.createdAt).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
							</div>

							{!n.read && (
								<span className="w-2 h-2 rounded-full bg-primary-variant mt-1" />
							)}
						</div>
					))
				)}
			</div>

			{/* Footer: Limpar Notificações */}
			{notifications.length > 0 && (
				<div className="border-t border-outline pt-2 flex justify-between items-center">
					<button
						type="button"
						onClick={() => clearNotifications(user?.id)}
						className="text-xs text-muted hover:text-error flex items-center gap-1 cursor-pointer"
					>
						<Trash2 size={12} />
						Limpar Notificações
					</button>
				</div>
			)}
		</div>
	)
}

export default NotificationPopover
