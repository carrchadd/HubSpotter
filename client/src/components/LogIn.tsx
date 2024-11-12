import { Input } from "./ui/input"
import { FaUser, FaLock } from "react-icons/fa";
import { Button } from "./ui/button";
import HubSpotterLogo from '../assets/hubspotter.png'
import { FaGithubSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const LogIn = () => {
  return (
    <div className="h-screen w-full bg-background">
        <div className="py-7 pl-10">
            <a href="/"><img src={HubSpotterLogo} alt="logo" className='h-32' /></a>
        </div>
        <div className="flex justify-center items-center py-14">
            <div className="w-[400px] bg-accent pt-11 pb-32 rounded-xl">
                <form className="flex flex-col">
                    <div className="flex flex-col w-[70%] mx-auto gap-6">
                        <h1 className="text-4xl mb-5 text-white font-raleway font-semibold">Sign In</h1>
                        <div className="flex justify-center items-center">
                            <Input 
                                type="text"
                                placeholder="Username" 
                                className="rounded-[7px]" />
                            <FaUser className="absolute translate-x-28"/>
                        </div>
                        <div className="flex justify-center items-center">
                            <Input
                                type="password"
                                placeholder="Password"
                                className="rounded-[7px]" />
                            <FaLock className="absolute translate-x-28" />
                        </div>
                    </div>
                    <Button type="submit" className="rounded-[5px] mt-6 mx-auto">Sign In</Button>
                </form>
                <p className="text-center mt-6 text-white">Don't have an account? <a href="/signup" className="text-textColor">Sign up now</a></p>
            </div>
        </div>
        <div className="py-20 text-white bg-background">
            <div className='max-w-[1100px] mx-auto flex flex-col gap-20'>
                <div className='text-center'>
                    <h1 className="text-white text-lg font-nunito">© 2024 HubSpotter All Rights Reserved</h1>
                    <div className='mx-auto my-2 flex md:w-[50%] justify-center items-center gap-10'>
                        <a href="https://github.com/carrchadd/HubSpotter"><FaGithubSquare size={30}/></a>
                        <a href="mailto:ccarreon@charlotte.edu?subject=HubSpotter%20Customer%20Contact"><IoIosMail size={32}/></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LogIn