import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'

const useAuthListener = () => {
	const { setSession, setProfile, setLoading } = useAuthStore()

	useEffect(() => {
		setLoading(true)

		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (session) {
				setSession(session)

				const { data: profile } = await supabase
					.from('user_profiles')
					.select('*')
					.eq('id', session.user.id)
					.single()

				setProfile(profile)
			} else {
				setSession(null)
				setProfile(null)
			}

			setLoading(false)
		}

		checkSession()

		// Registra a escuta do Supabase
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			//Toda vez que o login/logout acontecer, o Supabase envia a sessão atualizada
			setSession(session)

			if (session) {
				const { data: profile } = await supabase
					.from('user_profiles')
					.select('*')
					.eq('id', session.user.id)
					.single()

				setProfile(profile)
			} else {
				setProfile(null)
			}

			setLoading(false)
		})

		return () => subscription.unsubscribe()
	}, [setSession, setProfile, setLoading])

	return {}
}

export default useAuthListener
