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
		<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
			<div className='flex flex-col gap-1'>
				<label className='text-sm font-medium'>Username</label>
				<input
					{...register('username')}
					type='text'
					placeholder='Digite seu username'
					className='border p-2 rounded'
				/>
				{errors.username && (
					<span className='text-red-500 text-xs'>
						{errors.username.message}
					</span>
				)}
			</div>

			<button type='submit' className='bg-blue-500 text-white p-2 rounded cursor-pointer'>
				Buscar
			</button>
		</form>
	)
}

export default Home
