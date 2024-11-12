import { Button } from './ui/button'
import { FaGithubSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";



const Footer = () => {
  return (
    
    <div className="py-20 text-white bg-background">
        <div className='max-w-[1100px] mx-auto flex flex-col gap-20'>
            <div>
                <div className='grid lg:grid-cols-3 lg:gap-0 gap-5 mx-auto'>
                    <div className='lg:col-span-2 text-center'>
                        <h1 className="md:text-4xl sm:text-3xl text-2xl font-raleway font-bold">Your Adventure Begins Here</h1>
                        <p className='font-nunito font-semibold pt-2'>Enjoy full access to all our features with a single account.</p>
                    </div>
                    <div className='lg:col-span-1 flex items-center justify-center'>
                        <Button className='bg-accent px-24 py-6 rounded-[6px] font-nunito'>Get Started</Button>
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <h1 className="text-white text-lg font-nunito">© 2024 HubSpotter All Rights Reserved</h1>
                <div className='mx-auto my-2 flex md:w-[50%] justify-center items-center gap-10'>
                    <a href="https://github.com/carrchadd/HubSpotter"><FaGithubSquare size={30}/></a>
                    <a href="mailto:ccarreon@charlotte.edu?subject=HubSpotter%20Customer%20Contact"><IoIosMail size={32}/></a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer