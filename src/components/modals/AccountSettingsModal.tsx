import React, { useState, useEffect } from 'react'
import { Settings, Code, Briefcase, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { supabase } from '../../lib/supabase'
import Modal from '../ui/Modal'

interface AccountSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

const AccountSettingsModal = ({
	isOpen,
	onClose,
}: AccountSettingsModalProps) => {
	const { user, profile, setProfile } = useAuthStore()

	const [userType, setUserType] = useState<'developer' | 'recruiter'>(
		profile?.user_type || 'developer',
	)
	const [githubUsername, setGithubUsername] = useState(
		profile?.github_username || '',
	)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (profile) {
			setUserType(profile.user_type)
			setGithubUsername(profile.github_username || '')
		}
	}, [profile])

	const handleSave = async (e: React.ChangeEvent) => {
		e.preventDefault()
		if (!user) return

		setLoading(true)
		setError(null)

		try {
			if (userType === 'developer' && githubUsername.trim()) {
				const res = await fetch(
					`https://api.github.com/users/${githubUsername.trim()}`,
				)

				if (res.status === 404) {
					throw new Error('O usuário do GitHub informado não foi encontrado.')
				}
			}

			const cleanUsername =
				userType === 'developer' ? githubUsername.trim() : null

			const { error } = await supabase
				.from('user_profiles')
				.update({
					user_type: userType,
					github_username: cleanUsername,
					updated_at: new Date().toISOString(),
				})
				.eq('id', user.id)

			if (error) throw error

			setProfile({
				id: user.id,
				user_type: userType,
				github_username: cleanUsername || undefined,
			})

			onClose()
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao salvar alterações.',
			)
		} finally {
			setLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Configurações da Conta"
			icon={<Settings className="text-primary-variant" size={20} />}
		>
			<div className="flex flex-col gap-5 text-left">
				{/* Alerta de Erro */}
				{error && (
					<div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 text-error text-xs font-sans rounded-lg">
						<AlertCircle size={16} />
						<span>{error}</span>
					</div>
				)}
				<form onSubmit={handleSave} className="flex flex-col gap-5">
					{/* Seleção do papel */}
					<div className="flex flex-col gap-2">
						<label className="text-xs font-mono text-muted uppercase tracking-wider">
							Tipo de Perfil
						</label>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setUserType('developer')}
								className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-sans font-semibold transition-all cursor-pointer ${
									userType === 'developer'
										? 'border-primary-variant bg-primary-variant/10 text-main'
										: 'border-outline text-muted hover:border-outline-variant'
								}`}
							>
								<Code size={16} />
								Desenvolvedor
							</button>
							<button
								type="button"
								onClick={() => setUserType('recruiter')}
								className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-sans font-semibold transition-all cursor-pointer ${
									userType === 'recruiter'
										? 'border-primary-variant bg-primary-variant/10 text-main'
										: 'border-outline text-muted hover:border-outline-variant'
								}`}
							>
								<Briefcase size={16} />
								Recrutador
							</button>
						</div>
					</div>
					{/* Campo GitHub (se for desenvolvedor) */}
					{userType === 'developer' && (
						<div className="flex flex-col gap-2">
							<label
								htmlFor="settings-github"
								className="text-xs font-mono text-muted uppercase tracking-wider"
							>
								Username do GitHub
							</label>
							<input
								id="settings-github"
								type="text"
								value={githubUsername}
								onChange={({ target }) => setGithubUsername(target.value)}
								className="input input-bordered w-full bg-base text-main text-sm border-outline focus:border-primary-variant focus:outline-none rounded-lg"
								required={userType === 'developer'}
							/>
						</div>
					)}
					{/* Footer */}
					<div className="flex gap-2 justify-end border-t border-outline pt-4 mt-2">
						<button
							type="button"
							onClick={onClose}
							className="btn btn-ghost btn-sm text-muted hover:text-main cursor-pointer"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={loading}
							className="btn btn-primary btn-sm cursor-pointer"
						>
							{loading ? (
								<span className="loading loading-spinner loading-xs" />
							) : (
								'Salvar Alterações'
							)}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default AccountSettingsModal
