import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AlertCircle, Briefcase, Code } from 'lucide-react'

// SVG do GitHub oficial
const GithubIcon = ({
	size = 18,
	className = '',
}: {
	size?: number
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
		<path d="M9 18c-4.51 2-5-2-7-2" />
	</svg>
)

const CompleteProfile = () => {
	const { user, setProfile } = useAuthStore()
	const navigate = useNavigate()

	const [userType, setUserType] = useState<'recruiter' | 'developer'>(
		'developer',
	)
	const [githubUsername, setGithubUsername] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!user) {
			navigate('/login')
		}
	}, [user, navigate])

	const handleSubmit = async (e: React.ChangeEvent) => {
		e.preventDefault()
		if (!user) return
		setLoading(true)
		setError(null)

		try {
			//Validação exclusiva de desenvolvedor
			if (userType === 'developer') {
				const response = await fetch(
					`https://api.github.com/users/${githubUsername}`,
				)

				if (response.status === 404)
					throw new Error('O usuário do GitHub informado não foi encontrado.')
			}

			//Salva no banco de dados (roda para recrutador e desenvolvedor)
			const { error } = await supabase.from('user_profiles').insert({
				id: user.id,
				user_type: userType,
				github_username: userType === 'developer' ? githubUsername : null,
			})

			if (error) throw error

			//Atualiza a store global
			setProfile({
				id: user.id,
				user_type: userType,
				github_username: githubUsername,
			})

			//Redireciona para a home
			navigate('/')
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex min-h-[calc(100svh-64px)] w-full items-center justify-center bg-base p-6">
			<div className="bg-surface border border-outline rounded-lg p-8 max-w-md w-full flex flex-col gap-6 shadow-xl">
				{/* Título */}
				<div className="text-center flex flex-col gap-2">
					<h1 className="text-main font-sans font-bold text-2xl tracking-tight">
						Complete seu Perfil
					</h1>
					<p className="text-muted text-sm font-sans">
						Selecione o seu perfil de uso para continuar navegando na plataforma
					</p>
				</div>

				{/* Alerta de Erro */}
				{error && (
					<div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 text-error text-sm font-sans rounded-lg">
						<AlertCircle size={16} className="flex-shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Formulário */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					{/* Seletor de tipo de usuário */}
					<div className="form-control w-full">
						<label className="label py-1">
							<span className="label-text text-muted font-sans text-xs font-semibold uppercase tracking-wider">
								Eu sou um:
							</span>
						</label>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setUserType('developer')}
								className={`flex flex-col items-center justify-center p-4 rounded-lg border text-sm font-sans font-semibold transition-all cursor-pointer gap-2 ${userType === 'developer' ? 'border-primary bg-primary/10 text-main' : 'border-outline hover:border-outline-variant text-muted'}`}
							>
								<Code size={20} />
								Desenvolvedor
							</button>
							<button
								type="button"
								onClick={() => setUserType('recruiter')}
								className={`flex flex-col items-center justify-center p-4 rounded-lg border text-sm font-sans font-semibold transition-all cursor-pointer gap-2 ${userType === 'recruiter' ? 'border-primary bg-primary/10 text-main' : 'border-outline hover:border-outline-variant text-muted'}`}
							>
								<Briefcase size={20} />
								Recrutador
							</button>
						</div>
					</div>

					{/* Campo GitHub condicional para desenvolvedores */}
					{userType === 'developer' && (
						<div className="form-control w-full">
							<label className="label py-1">
								<span className="label-text text-muted font-sans text-xs font-semibold uppercase tracking-wider">
									Username do GitHub
								</span>
							</label>
							<div className="relative flex items-center">
								<GithubIcon
									size={18}
									className="absolute left-3 text-muted pointer-events-none z-10"
								/>
								<input
									type="text"
									placeholder="Digite seu username do GitHub"
									className="input input-bordered bg-base border-outline text-sm text-main font-sans w-full pl-10 focus:border-primary-variant focus:outline-none"
									value={githubUsername}
									onChange={({ target }) => setGithubUsername(target.value)}
									required={userType === 'developer'}
								/>
							</div>
						</div>
					)}

					{/* Botão de Envio */}
					<button
						type="submit"
						disabled={loading}
						className="btn btn-primary w-full text-white font-sans mt-2 flex items-center justify-center gap-2 cursor-pointer"
					>
						{loading ? (
							<span className="loading loading-spinner loading-sm" />
						) : (
							'Salvar e Continuar'
						)}
					</button>
				</form>
			</div>
		</div>
	)
}

export default CompleteProfile
