import Header from './Header'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
	return (
		<div className='min-h-screen flex flex-col bg-base'>
			<Header />
      <main className=' flex-1'>
        <Outlet />
      </main>
		</div>
	)
}

export default RootLayout