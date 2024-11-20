import { NavLink } from "react-router-dom"
import HubSpotterLogo from '../assets/hubspotter.png'
import { useState } from "react"

const UserNavbar = () => {

  const [isSignedIn, setIsSignedIn] = useState(true);

  return (
    <div className="bg-background">
        <div className="pt-3">
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
                  {isSignedIn ? 
                  <NavLink to={"/profile"} 
                      className={({ isActive}) =>
                        isActive ? "text-white font-normal" : ""
                     }
                    >
                      <p>Profile</p>
                    </NavLink> 
                    : 
                    <NavLink to={"/login"} 
                    className={({ isActive}) =>
                      isActive ? "text-white font-normal" : ""
                   }
                  >
                    <p>Log In</p>
                  </NavLink>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserNavbar