import { Outlet } from 'react-router-dom';
import UserNavbar from './components/UserNavbar';

const User = () => {
  return (
    <div className='h-screen bg-background'>
        <UserNavbar />
        <Outlet />
    </div>
  )
}

export default User