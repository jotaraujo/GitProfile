import { Link } from 'react-router-dom'
import { Bell, Plus } from 'lucide-react'
import Logo from '../../assets/gitprofile-logo.svg?react'

const Header = () => {
	return (
		<header className='navbar bg-surface border-b border-outline sticky top-0 z-50'>
			<div className='navbar-start px-6'>
				<Link to='/' className='flex items-center gap-2'>
					<Logo className='w-8 h-8 rounded-full'/>
					<span className='text-xl font-sans font-bold text-main'>
						GitProfile
					</span>
				</Link>
			</div>
			<div className='navbar-center hidden lg:flex'>
				<ul className='menu menu-horizontal px-1'>
					<li>
						<Link
							to=''
							className='border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main'
						>
							Explore
						</Link>
					</li>
					<li>
						<Link
							to=''
							className='border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main'
						>
							Repositories
						</Link>
					</li>
					<li>
						<Link
							to=''
							className='border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main'
						>
							Pull Requests
						</Link>
					</li>
					<li>
						<Link
							to=''
							className='border-b border-transparent hover:border-bright hover:bg-transparent rounded-none transition-all duration-200 text-main'
						>
							Issues
						</Link>
					</li>
				</ul>
			</div>
			<div className='navbar-end gap-3 px-6'>
				<button className='btn btn-ghost btn-circle btn-sm text-main'>
					<Bell size={20}></Bell>
				</button>
				<button className='btn btn-ghost btn-circle btn-sm text-main'>
					<Plus size={20}></Plus>
				</button>
				<Link to='/login' className='btn btn-primary btn-sm rounded-full'>
					Entrar
				</Link>
			</div>
		</header>
	)
}

export default Header
