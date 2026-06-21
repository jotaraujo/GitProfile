import { Link } from 'react-router-dom'
import {Bell, Plus} from 'lucide-react'
import logo from '../../assets/logo.png'

const Header = () => {
	return (
		<header className='navbar bg-surface border-b border-outline'>
			<div className='navbar-start'>
				<Link to='/' className='flex items-center gap-2'>
					<img src={logo} alt='Logo' className='w-8 h-8 rounded-full' />
					<span className='text-xl font-sans font-bold text-main'>
						GitProfile
					</span>
				</Link>
			</div>
			<div className='navbar-center hidden lg:flex'>
				<ul className='menu menu-horizontal px-1'>
					<li>
						<Link to=''>Explore</Link>
					</li>
					<li>
						<Link to=''>Repositories</Link>
					</li>
					<li>
						<Link to=''>Pull Requests</Link>
					</li>
					<li>
						<Link to=''>Issues</Link>
					</li>
				</ul>
			</div>
			<div className='navbar-end gap-3'>
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
