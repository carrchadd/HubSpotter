import HubSpotterLogo from '../assets/hubspotter.png'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='relative z-50'>
      <div className="absolute flex justify-between items-center w-full max-w-[1240px] px-10 pt-20 left-1/2 transform -translate-x-1/2 top-0 h-24 text-white text-2xl font-bold">
          <div className='flex items-center'>
              <img src={HubSpotterLogo} alt="logo" className='h-32' />
          </div>
          <Button className='font-bold text-sm rounded-[8px] px-8 bg-accent'>Log In</Button>
      </div>
    </div>
  )
  
}

export default Navbar