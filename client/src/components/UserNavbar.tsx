import { NavLink } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import HubSpotterLogo from '../assets/hubspotter.png'

const UserNavbar = () => {

  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4040/users/logout', {
        method: 'GET', // Include credentials for the session
      });
      console.log(response);
      if (response.status === 200 && response.ok) {
        setIsSignedIn(false); // Update the UI
        navigate('/login'); // Redirect to login page after logout
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                    <p className="hover:text-slate-100">Find a location</p>
                  </NavLink>
                {isSignedIn ? (
                  <>
                    <NavLink
                      to={"/profile"}
                      className={({ isActive }) => (isActive ? "text-white font-normal" : "")}
                    >
                      <p className="hover:text-slate-100">Profile</p>
                    </NavLink>
                      <button
                      onClick={handleLogout}
                      className="hover:text-slate-100"
                      >
                      Log Out
                    </button>
                  </>
                ) : (
                  <NavLink
                    to={"/login"}
                    className={({ isActive }) => (isActive ? "text-white font-normal" : "")}
                  >
                    <p className="hover:text-slate-100">Log In</p>
                  </NavLink>
                )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserNavbar