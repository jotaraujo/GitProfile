import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useSearchHistoryStore } from '../store/useSearchHistoryStore'
import { Clock, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const History = () => {
	const { user } = useAuthStore()
	const { history, fetchHistory, removeSearch, clearHistory } =
		useSearchHistoryStore()

	useEffect(() => {
		if (user?.id) {
			fetchHistory(user.id)
		}
	}, [user, fetchHistory])

	return (
		<>
			<div className="flex items-center justify-between border-b border-outline pl-8 py-4 mb-6">
				<div className="flex items-center gap-3">
					<Clock className="text-primary" size={24} />
					<div>
						<h1 className="text-xl font-bold text-main font-sans">
							Histórico de Pesquisas
						</h1>
						<p className="text-xs text-muted font-sans">
							Sua lista de perfis do GitHub consultados recentemente
						</p>
					</div>
				</div>

				{history.length > 0 && (
					<button
						type="button"
						onClick={() => clearHistory(user?.id)}
						className="btn btn-ghost btn-sm text-error hover:bg-error/10 font-sans flex items-center gap-2 rounded-lg cursor-pointer"
					>
						<Trash2 />
						Limpar Histórico
					</button>
				)}
			</div>
			{history.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline rounded-lg text-center mx-8 my-8">
					<Clock className="text-muted mb-3 opacity-50" size={48} />
					<h3 className="text-base font-semibold text-main font-sans">
						Nenhum histórico recente
					</h3>
					<p className="text-xs text-muted font-sans max-w-sm mt-1 mb-4">
						Os perfis do GitHub que você pesquisar na barra de buscas aparecerão
						automaticamente aqui.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{history.map((item) => (
						<div
							key={item.username}
							className="bg-surface border border-outline hover:border-outline-variant p-4 rounded-lg flex items-center justify-between transition-all group shadow-sm"
						>
							{/* Informações do usuário com link direto */}
							<Link
								to={`/profile/${item.username}`}
								className="flex items-center gap-3 min-w-0 flex-1"
							>
								<img
									src={item.avatarUrl}
									alt={`Avatar de ${item.username}`}
									className="w-10 h-10 rounded-full border border-outline object-cover flex-shrink-0"
								/>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-semibold text-main font-sans truncate group-hover:text-primary transition-colors">
										@{item.username}
									</p>
									<span className="text-[11px] text-muted font-sans block">
										{new Date(item.searchedAt).toLocaleDateString('pt-BR', {
											day: '2-digit',
											month: 'short',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</div>
							</Link>

							{/* Botão para deletar item individual */}
							<button
								type="button"
								onClick={() => removeSearch(item.username, user?.id)}
								className="btn btn-ghost btn-xs text-muted hover:text-error hover:bg-error/10 ml-2 cursor-pointer"
							>
								<Trash2 size={14} />
							</button>
						</div>
					))}
				</div>
			)}
		</>
	)
}

export default History
