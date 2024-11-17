import heroVideo from '../assets/hero_video.mp4'
import { ReactTyped } from 'react-typed'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'

const HeroCover = () => {
  return (
    <div className='h-screen w-full'>
    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-55'></div>
      <video src={heroVideo} autoPlay muted loop className='w-full h-full object-cover -z-10'/>
        <div className='absolute z-5 w-full h-full top-0 flex justify-center items-center left-1/2 transform -translate-x-1/2 text-white md:text-4xl sm:text-3xl text-xl font-bold'>
          <div></div>
          <h1>Finding a place just got</h1>
          <ReactTyped className='md:pl-3 pl-1' 
            strings={[
              "easier", "faster", "better", "convenient"
            ]}
            typeSpeed={130}
            backSpeed={140}
            loop
          />
          
        </div>
        
    
      <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 z-20">
      <NavLink to={"/map"}>
        <Button className="font-bold text-xl rounded-[10px] px-16 py-6 bg-accent bg-opacity-80">
          Find Destinations Now
        </Button>
      </NavLink>
    </div>
</div>
  )
}

export default HeroCover