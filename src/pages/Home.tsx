import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '../validations/userSchema'
import type { UsernameInput } from '../validations/userSchema'
import { useNavigate } from 'react-router-dom'

const Home = () => {
	const navigate = useNavigate()

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
		<div className='min-h-screen w-full flex items-center justify-center bg-background'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col items-center w-3/4 py-10 gap-4 bg-surface rounded'
			>
				<div className='flex flex-col max-w-md w-full px-4 items-center gap-1'>
					<label className='text-sm font-medium'>Username</label>
					<input
						{...register('username')}
						type='text'
						placeholder='Digite seu username'
						className='input w-full'
					/>
					{errors.username && (
						<span className='text-red-500 text-xs'>
							{errors.username.message}
						</span>
					)}
				</div>

				<button type='submit' className='btn rounded-full max-w-md w-full'>
					Buscar
				</button>
			</form>
		</div>
	)
}

export default Home
