import { Button } from './ui/button'
import { FaGithubSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { NavLink } from "react-router-dom";



const Footer = () => {
  return (
    
    <div className="py-14 text-white bg-background">
        <div className='max-w-[1100px] mx-auto flex flex-col gap-10'>
            <div>
                <div className='grid lg:grid-cols-3 lg:gap-0 gap-5 mx-auto'>
                    <div className='lg:col-span-2 text-center'>
                        <h1 className="md:text-4xl sm:text-3xl text-2xl font-raleway font-bold">Your Adventure Begins Here</h1>
                        <p className='font-nunito font-semibold pt-2'>Enjoy full access to all our features with a single account.</p>
                    </div>
                    <div className='lg:col-span-1 flex items-center justify-center'>
                        <NavLink to={"/login"}>
                            <Button className='bg-accent px-24 py-6 rounded-[5px] font-nunito'>Get Started</Button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <p className='lg:text-lg text-center font-nunito my-2'>We value your input and would love to hear your thoughts—share your feedback with us <NavLink to={"/feedback"} className="text-accent underline">here!</NavLink></p>
            <div className='text-center'>
                <h1 className="text-white text-lg font-nunito">© 2024 HubSpotter All Rights Reserved</h1>
                <div className='mx-auto my-3 flex md:w-[50%] justify-center items-center gap-10'>
                    <a href="https://github.com/carrchadd/HubSpotter"><FaGithubSquare size={30}/></a>
                    <a href="mailto:ccarreon@charlotte.edu?subject=HubSpotter%20Customer%20Contact"><IoIosMail size={32}/></a>
                </div>
                <div className='flex md:w-[50%] mx-auto justify-center items-center gap-10 my-5 font-nunito lg:text-xl'>
                    <NavLink to={"/about"} >About</NavLink>
                    <NavLink to={"/contact"}>Contact</NavLink>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer