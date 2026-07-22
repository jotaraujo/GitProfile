import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
	Mail,
	Lock,
	Code,
	Briefcase,
	AlertCircle,
	Eye,
	EyeClosed,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

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

// SVG do Google oficial e colorido
const GoogleIcon = ({
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
		className={className}
	>
		<path
			fill="#EA4335"
			d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.973 0 12 0 7.354 0 3.307 2.69 1.295 6.647l3.971 3.118z"
		/>
		<path
			fill="#4285F4"
			d="M23.864 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.655a5.69 5.69 0 0 1-2.473 3.736l3.864 3.001c2.259-2.083 3.568-5.148 3.568-8.873z"
		/>
		<path
			fill="#FBBC05"
			d="M5.266 14.235A7.002 7.002 0 0 1 4.909 12c0-.79.136-1.55.357-2.265L1.295 6.618A11.934 11.934 0 0 0 0 12c0 1.92.455 3.732 1.268 5.353l3.998-3.118z"
		/>
		<path
			fill="#34A853"
			d="M12 24c3.24 0 5.955-1.077 7.941-2.923l-3.864-3.001c-1.073.719-2.446 1.146-4.077 1.146-3.145 0-5.805-2.127-6.755-4.991l-4.01 3.109A11.954 11.954 0 0 0 12 24z"
		/>
	</svg>
)

const Login = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()

	const initialMode =
		searchParams.get('mode') === 'register' ? 'register' : 'login'

	const [mode, setMode] = useState<'login' | 'register'>(initialMode)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [userType, setUserType] = useState<'recruiter' | 'developer'>(
		'developer',
	)
	const [githubUsername, setGithubUsername] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.ChangeEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			if (mode === 'login') {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				if (error) throw error //Se o e-mail e a senha estiverem incorretos

				navigate('/') //Sucesso! Redireciona para Home
			} else {
				if (password !== confirmPassword)
					throw new Error('As senhas não coincidem.')

				if (userType === 'developer') {
					const response = await fetch(
						`https://api.github.com/users/${githubUsername}`,
					)
					if (response.status === 404)
						throw new Error('O usuário do GitHub informado não foi encontrado.')
				}

				const { error: signUpError } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							user_type: userType,
							github_username: userType === 'developer' ? githubUsername : null,
						},
					},
				})

				if (signUpError) throw signUpError

				navigate('/') //Sucesso! Redireciona para Home
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	const handleSocialLogin = async (provider: 'google' | 'github') => {
		setLoading(true)
		setError(null)

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			})

			// Se o supabase retornar um erro de rede/config, ele vai direto p o catch
			if (error) throw error
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
			setError(errorMessage)
			setLoading(false)
		}
	}

	return (
		<div className="flex min-h-[calc(100svh-64px)] w-full items-center justify-center bg-base p-6">
			<div className="bg-surface border border-outline rounded-lg p-8 max-w-md w-full flex flex-col gap-6 shadow-xl">
				{/* Sessão de Título */}
				<div className="text-center flex flex-col gap-2">
					<h1 className="text-main font-sans font-bold text-2xl tracking-tight">
						GitProfile
					</h1>
					<p className="text-muted text-sm font-sans">
						Conecte-se para explorar e gerenciar perfis de candidatos
					</p>
				</div>

				{/* Painel de Abas */}
				<div className="grid grid-cols-2 bg-base p-1 rounded-xl border border-outline">
					<button
						type="button"
						className={`py-2 text-sm font-sans font-semibold rounded-lg transition-all duration-200 cursor-pointer ${mode === 'login' ? 'bg-surface text-main shadow-md border border-outline-variant' : 'text-muted hover:text-main'}`}
						onClick={() => setMode('login')}
					>
						Entrar
					</button>
					<button
						type="button"
						className={`py-2 text-sm font-sans font-semibold rounded-lg transition-all duration-200 cursor-pointer ${mode === 'register' ? 'bg-surface text-main shadow-md border border-outline-variant' : 'text-muted hover:text-main'}`}
						onClick={() => setMode('register')}
					>
						Criar Conta
					</button>
				</div>

				{/* Card de Alerta de Erro */}
				{error && (
					<div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-lg font-sans">
						<AlertCircle size={16} className="flex-shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Formulário Principal */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{/* Campo E-mail */}
					<div className="form-control w-full">
						<label className="label py-1">
							<span className="label-text text-muted font-sans text-xs font-semibold uppercase tracking-wider">
								E-mail
							</span>
						</label>
						<div className="relative flex items-center">
							<Mail
								size={18}
								className="absolute left-3 text-muted pointer-events-none z-10"
							/>
							<input
								type="email"
								placeholder="Digite seu e-mail"
								className="input input-bordered bg-base border-outline text-sm text-main font-sans w-full pl-10 focus:border-primary-variant focus:outline-none"
								value={email}
								onChange={({ target }) => setEmail(target.value)}
								required
							/>
						</div>
					</div>

					{/* Campo Senha */}
					<div className="form-control w-full">
						<label className="label py-1">
							<span className="label-text text-muted font-sans text-xs font-semibold uppercase tracking-wider">
								Senha
							</span>
						</label>
						<div className="relative flex items-center">
							<Lock
								size={18}
								className="absolute left-3 text-muted pointer-events-none z-10"
							/>
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder="Digite sua senha"
								className="input input-bordered bg-base border-outline text-sm text-main font-sans w-full pl-10 focus:border-primary-variant focus:outline-none"
								value={password}
								onChange={({ target }) => setPassword(target.value)}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 text-muted hover:text-main focus:outline-none cursor-pointer z-10"
							>
								{showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					{/* Campos dinâmicos de cadastro */}
					{mode === 'register' && (
						<>
							{/* Campo de confirmação da senha */}
							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text text-muted font-sans text-xs font-semibold uppercase tracking-wider">
										Confirme a Senha
									</span>
								</label>
								<div className="relative flex items-center">
									<Lock
										size={18}
										className="absolute left-3 text-muted pointer-events-none z-10"
									/>
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder="Digite sua senha novamente"
										className="input input-bordered bg-base border-outline text-sm text-main font-sans w-full pl-10 focus:border-primary-variant focus:outline-none"
										value={confirmPassword}
										onChange={({ target }) => setConfirmPassword(target.value)}
										required
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 text-muted hover:text-main focus:outline-none cursor-pointer z-10"
									>
										{showConfirmPassword ? (
											<EyeClosed size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</div>

							{/* Campo seletor de tipo de usuário */}
							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text text-muted font-sans text-xs font-semibold uppercase tracking-wider">
										Eu sou um:
									</span>
								</label>
								<div className="grid grid-cols-2 gap-3">
									<button
										type="button"
										className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-sans font-semibold transition-all cursor-pointer gap-2 ${userType === 'developer' ? 'border-primary bg-primary/10 text-main' : 'border-outline hover:border-outline-variant text-muted'}`}
										onClick={() => setUserType('developer')}
									>
										<Code size={18} />
										Desenvolvedor
									</button>
									<button
										type="button"
										className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-sans font-semibold transition-all cursor-pointer gap-2 ${userType === 'recruiter' ? 'border-primary bg-primary/10 text-main' : 'border-outline hover:border-outline-variant text-muted'}`}
										onClick={() => setUserType('recruiter')}
									>
										<Briefcase size={18} />
										Recrutador
									</button>
								</div>
							</div>

							{/* Campo GitHub (se for desenvolvedor) */}
							{mode === 'register' && userType === 'developer' && (
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
						</>
					)}

					{/* Botão de submit do formulário */}
					<button
						type="submit"
						disabled={loading}
						className="btn btn-primary w-full text-white font-sans mt-4 flex items-center justify-center gap-2 cursor-pointer"
					>
						{loading ? (
							<span className="loading loading-spinner loading-sm" />
						) : mode === 'login' ? (
							'Entrar'
						) : (
							'Criar Conta'
						)}
					</button>
				</form>

				{/* Divisor de Login Social */}
				<div className="relative my-2">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-outline" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-surface px-2 text-muted font-sans">
							Ou continue com
						</span>
					</div>
				</div>

				{/* Grade de botões OAuth */}
				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={() => handleSocialLogin('google')}
						className="btn btn-outline border-outline hover:bg-bright text-xs text-main font-sans flex items-center justify-center gap-2 cursor-pointer"
					>
						<GoogleIcon size={16} />
						Google
					</button>
					<button
						type="button"
						onClick={() => handleSocialLogin('github')}
						className="btn btn-outline border-outline hover:bg-bright text-xs text-main font-sans flex items-center jsutify-center gap-2 cursor-pointer"
					>
						<GithubIcon size={16} />
						GitHub
					</button>
				</div>
			</div>
		</div>
	)
}

export default Login
