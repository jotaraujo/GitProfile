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
			<div>
				<ProfileCard user={data} />
			</div>
		)
	}
}

export default Profile
