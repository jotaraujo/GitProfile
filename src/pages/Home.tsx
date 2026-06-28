import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '../validations/userSchema'
import type { UsernameInput } from '../validations/userSchema'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import Logo from '../assets/gitprofile-logo.svg?react'
import { useEffect, useRef } from 'react'

const suggestions = [
	{ username: 'torvalds', avatarUrl: 'https://github.com/torvalds.png' },
	{ username: 'gaeron', avatarUrl: 'https://github.com/gaeron.png' },
	{
		username: 'sindresorhus',
		avatarUrl: 'https://github.com/sindresorhus.png',
	},
]

const Home = () => {
	const navigate = useNavigate()

	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()

				inputRef.current?.focus()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UsernameInput>({
		resolver: zodResolver(userSchema),
	})

	const onSubmit = (data: UsernameInput) => {
		navigate(`/profile/${data.username}`)
	}
	return (
		<div className='bg-base relative min-h-[calc(100svh-64px)] w-full flex flex-col items-center justify-center p-6 gap-12 overflow-hidden'>
			{/* BLOB DECORATIVO */}
			{/* BACKGROUND DINÂMICO */}
			<div className='absolute inset-0 z-0 pointer-events-none'>
				{/* Gradiente radial no centro */}
				<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-primary-variant/5 blur-[120px] mix-blend-screen' />
				{/* Blob superior direito */}
				<div className='absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/10 blur-[50px] animate-blob' />
				{/* Blob inferior esquerdo */}
				<div
					className='absolute bottom-10 left-10 w-72 h-72 rounded-full bg-secondary/10 blur-[50px] animate-blob'
					style={{ animationDelay: '4s' }}
				/>
			</div>

			{/* BLOCO PRINCIPAL */}
			<div className='relative z-10 w-full max-w-4xl flex flex-col items-center gap-10'>
				{/* SEÇÃO HERO */}
				<div className='text-center max-w-xl flex flex-col gap-3'>
					<div className='flex items-center justify-center gap-3 md: gap-4'>
						<Logo className='w-15 h-15' />
						<h1 className='text-4xl md:text:5xl font-sans font-bold tracking-tight bg-gradient-to-r from-primary to-main bg-clip-text text-transparent'>
							Explore Perfis do GitHub
						</h1>
					</div>
					<p className='text-muted text-sm leading-relaxed'>
						Busque desenvolvedores, compare stacks tecnológicas em tempo real e
						documente triagens de forma rápida e estéticamente agradável.
					</p>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-2xl flex flex-col gap-2'
				>
					<div className='join w-full border border-outline rounded-lg overflow-hidden focus-within:border-primary-variant transition-colors duration-200'>
						<div className='relative join-item flex-1 flex items-center h-12'>
							<label htmlFor='username' className='sr-only'>
								Username do GitHub
							</label>
							<input
								{...register('username')}
								ref={(e) => {
									register('username').ref(e)
									inputRef.current = e
								}}
								id='username'
								type='text'
								placeholder='Digite o username do GitHub (ex: torvalds)...'
								className='input w-full bg-surface text-main border-none pl-12 focus:outline-none rounded-none h-12'
							/>
							<span className='absolute left-4 text-muted pointer-events-none'>
								<Search size={18} aria-hidden='true' />
							</span>
							<div className='absolute right-4 flex items-center gap-1 pointer-events-none select-none hidden sm:flex'>
								<kbd className='kbd kbd-sm bg-[#222b33] border border-outline-variant text-muted text-xs font-mono px-1.5 py-0.5 rounded'>
									Ctrl
								</kbd>
								<kbd className='kbd kbd-sm bg-[#222b33] border border-outline-variant text-muted text-xs font-mono px-1.5 py-0.5 rounded'>
									K
								</kbd>
							</div>
						</div>

						<button
							type='submit'
							className='btn btn-primary join-item px-8 rounded-none border-none h-12'
						>
							Buscar
						</button>
					</div>

					{errors.username && (
						<span className='text-error text-xs ml-2' role='alert'>
							{errors.username.message}
						</span>
					)}
				</form>

				{/* SEÇÃO DE RECOMENDAÇÕES */}
				<div className='w-full max-w-xl flex items-center gap-3 mt-2'>
					<span className='text-muted font-mono text-xs tracking_wider uppercase'>
						Perfis Recomendados:
					</span>

					<div className='flex flex-wrap gap-2'>
						{suggestions.map((sug) => (
							<button
								key={sug.username}
								type='button'
								onClick={() => navigate(`/profile/${sug.username}`)}
								className='group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/20 hover:bg-[#58a6ff]/20 transition-all duration-200 cursor-pointer'
							>
								<img
									src={sug.avatarUrl}
									alt={`Avatar de ${sug.username}`}
									className='w-5 h-5 rounded-full object-cover border border-outline-variant'
								/>
								<span className='text-xs font-sans text-[#a2c9ff] group-hover:text-main transition-colors'>
									@{sug.username}
								</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
