import { NavLink } from "react-router-dom"
import HubSpotterLogo from '../assets/hubspotter.png'

const UserNavbar = () => {
  return (
    <div className="bg-background">
        <div className="py-7 ">
            <div className="flex justify-between items-center max-w-[1240px] mx-auto px-5">
                <NavLink to={"/"}>
                    <img src={HubSpotterLogo} alt="logo" className='h-32' />
                </NavLink>
            </div>
        </div>
    </div>
  )
}

export default UserNavbar