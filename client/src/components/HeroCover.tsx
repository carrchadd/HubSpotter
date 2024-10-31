import heroVideo from '../assets/hero_video.mp4'
import { ReactTyped } from 'react-typed'

const HeroCover = () => {
  return (
    <div className='h-screen w-full'>
    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-55'></div>
      <video src={heroVideo} autoPlay muted loop className='w-full h-full object-cover -z-10'/>
        <div className='absolute z-5 w-full h-full top-0 flex justify-center items-center left-1/2 transform -translate-x-1/2 text-white md:text-4xl sm:text-3xl text-xl font-bold'>
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
    </div>
  )
}

export default HeroCover