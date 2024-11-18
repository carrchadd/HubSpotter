import { NavLink } from "react-router-dom"
import HubSpotterLogo from '../assets/hubspotter.png'

const UserNavbar = () => {

  return (
    <div className="bg-background">
        <div className="py-7 ">
            <div className="flex justify-between items-center max-w-[1240px] mx-auto px-5 text-gray-400 lg:text-xl text-lg font-light font-raleway">
                <NavLink to={"/"} >
                    <img src={HubSpotterLogo} alt="logo" className='h-32' />
                </NavLink>
                <div className="flex gap-5">
                  <NavLink to={"/map"}
                    className={({ isActive}) =>
                      isActive ? "text-white font-normal" : ""
                   }
                  >
                    <p>Find a location</p>
                  </NavLink>
                  <NavLink to={"/login"} 
                    className={({ isActive}) =>
                      isActive ? "text-white font-normal" : ""
                   }
                  >
                    <p>Log In</p>
                  </NavLink>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserNavbar