import './App.css'
import { Outlet } from 'react-router-dom';
// import LandingPage from './components/LandingPage'
// import LogIn from './components/LogIn';

function Landing() {

  return (
    <>
    <Outlet />
    </>
  )
}

export default Landing;