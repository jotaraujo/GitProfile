import { useParams } from 'react-router-dom'
import { useGithubUser } from '../hooks/useGithubUser'
import ProfileCard from '../components/profile/ProfileCard'

const Profile = () => {
	const { username } = useParams<{ username: string }>()

	const { data, isLoading, isError, error } = useGithubUser(username || '')

	if (isLoading) {
		return <p>Carregando profile...</p>
	}

	if (isError) {
		return <p>Erro: {error?.message}</p>
	}

	if (data) {
		return (
			<div className='grid h-[calc(100svh-64px)] grid-cols-[400px_1fr_1fr] grid-rows-[auto_1fr] overflow-hidden'>
				<ProfileCard user={data} />
			</div>
		)
	}
}

export default Profile
