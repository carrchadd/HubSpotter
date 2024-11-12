import address from '../assets/address.svg'
import exploring from '../assets/exploring.svg'
import friends from '../assets/friends.svg'

const Infographic = () => {
  return (
    <div className="w-full bg-[#f2f2f2] py-32 px-4">
        <div className="flex flex-col md:gap-0 gap-6 max-w-[1240px] mx-auto lg:px-20">
            <div className='w-full md:grid md:grid-cols-2'>
                <img className='w-[350px] mx-auto' src={address} alt="looking-at-map" />
                <div className='flex flex-col mx-auto px-4 justify-center gap-3 md:text-3xl text-xl text-center'>
                    <h1 className='text-3xl font-raleway'>Find a meeting point</h1>
                    <p className='text-lg font-librefranklin'>Utilizing Google Maps, we provide precise tracking and accurate distance calculations between locations, saving you the hassle of searching.</p>
                </div>
            </div>
            <div className='w-full md:grid md:grid-cols-2 flex flex-col-reverse' >
                <div className='flex flex-col mx-auto px-4 justify-center gap-3 md:text-3xl text-xl text-center'>
                    <h1 className='text-3xl font-raleway'>Discover new places</h1>
                    <p className='text-lg font-librefranklin'>Explore a curated list of top-rated recommendations that highlight the best places, ensuring you always find the highest-rated options for your next adventure.</p>
                </div>
                <img className='w-[370px] mx-auto' src={exploring} alt="looking-at-map" />
            </div>
            <div className='w-full md:grid md:grid-cols-2 mt-7'>
                <img className='w-[400px] mx-auto mb-4' src={friends} alt="looking-at-map" />
                <div className='flex flex-col mx-auto px-4 justify-center gap-3 md:text-3xl text-xl text-center'>
                    <h1 className='text-3xl font-raleway'>Meet with friends</h1>
                    <p className='text-lg font-librefranklin'>Connect effortlessly with your friends by finding the perfect spot to gather. Our platform streamlines the process, allowing you to choose popular venues or hidden gems, making every meetup memorable.</p>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Infographic