import HubSpotterLogo from '../assets/hubspotter.png'
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className='relative z-50'>
      <div className="absolute flex justify-between items-center w-full max-w-[1240px] px-10 pt-20 left-1/2 transform -translate-x-1/2 top-0 h-24 text-white">
          <div className='flex items-center'>
              <NavLink to={"/"}>
                <img src={HubSpotterLogo} alt="logo" className='h-32' />
              </NavLink>
          </div>
          <div>
          <NavLink to={"/login"}>
            <p className='lg:text-2xl text-xl font-medium font-raleway'>Log In</p>
          </NavLink>
          </div>
      </div>
    </div>
  )
  
}

export default Navbar