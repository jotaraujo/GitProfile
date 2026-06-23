import type { User } from '../../types/github'
import { MapPin, Building2, Users } from 'lucide-react'

interface ProfileCardProps {
	user: User
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

const ProfileCard = ({ user }: ProfileCardProps) => {
	return (
		<div
			className='bg-surface flex items-start flex-col m-8 p-6 max-w-md h-full rounded-lg border
    border-outline'
		>
			<div className='avatar'>
				<div className='rounded-md border border-outline-variant'>
					<img src={user.avatar_url} alt='Foto do usuário' />
				</div>
			</div>
			<h1 className='text-main font-sans text-2xl font-bold mt-4 mb-2'>
				{user.name}
			</h1>
			<h2 className='text-primary font-mono text-sm mb-3'>@{user.login}</h2>
			<p className='text-muted text-xs mb-4'>
				Membro desde {date(user.created_at)}
			</p>
			<p className='text-muted text-sm leading-relaxed mb-4'>{user.bio}</p>
			<button className='btn btn-outline w-full mb-4'>Follow</button>
			<div className='flex gap-3 border-b-2 border-outline mb-4 py-4 w-full'>
				<p className='flex items-center gap-2 text-sm'>
					<Users size={18} />
					<span className='font-bold'>{user.followers}</span> followers
				</p>
				<span className='text-sm px-3'>•</span>
				<p className='flex items-center gap-2 text-sm'>
					<span className='font-bold'>{user.following}</span> following
				</p>
			</div>
			{user.location && (
				<>
					<p className='flex gap-2 text-sm text-muted'>
						<MapPin size={18} />
						{user.location}
					</p>
				</>
			)}
			{user.company && (
				<>
					<p className='flex gap-2 text-sm'>
						<Building2 size={18} />
						{user.company}
					</p>
				</>
			)}
		</div>
	)
}

export default ProfileCard
