import { useParams } from 'react-router-dom'

const Profile = () => {
	const { username } = useParams<{ username: string }>()
	return (
		<div>
			<h1>Este é seu profile: {username}</h1>
		</div>
	)
}

export default Profile
