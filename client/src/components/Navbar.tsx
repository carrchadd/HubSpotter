import HubSpotterLogo from '../assets/hubspotter.png'
import { Button } from './ui/button'
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className='relative z-50'>
      <div className="absolute flex justify-between items-center w-full max-w-[1240px] px-10 pt-20 left-1/2 transform -translate-x-1/2 top-0 h-24 text-white text-2xl font-bold">
          <div className='flex items-center'>
              <NavLink to={"/"}>
                <img src={HubSpotterLogo} alt="logo" className='h-32' />
              </NavLink>
          </div>
          <div>
        
          <NavLink to={"/login"}>
            <Button className='font-bold text-sm rounded-[5px] px-8 bg-accent ml-3'>Log In</Button>
          </NavLink>
          </div>
      </div>
    </div>
  )
  
}

export default Navbar