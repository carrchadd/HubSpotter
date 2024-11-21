import { Input } from "./ui/input"
import { FaUser, FaLock } from "react-icons/fa";
import { Button } from "./ui/button";
import { FaGithubSquare } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import { IoIosMail } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const SignUp = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [defaultLocation, setDefaultLocation] = useState("");
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const navigate = useNavigate();

    const createUser = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch ('http://localhost:4040/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                defaultLocation,
                email,
                password
            })
        })
        const data = await response.json();
        console.log(data);
        if (response.status === 201 && response.ok) {
            console.log(response);
            setSignUpSuccess(true);
            setTimeout(() => navigate('/login'), 1000);
        }
    }

  return (
    <div className="w-full bg-background">
        
        {signUpSuccess && (
            <div className="fixed top-4 right-4 bg-emerald-500 text-white px-7 py-4 rounded-md shadow-lg flex items-center z-10">
                <span>Sign Up Success</span>
                <button 
                    onClick={() => setSignUpSuccess(false)}
                    className="ml-2 hover:text-emerald-100"
                >
                    <X size={16} />
                </button>
            </div>
        )}

        <div className="flex justify-center items-center">
            <div className="px-16 bg-accent py-11 rounded-[5px]">
                <form className="flex flex-col" onSubmit={createUser}>
                    <div className="flex flex-col mx-auto gap-6">
                        <h1 className="lg:text-3xl text-2xl mb-5 text-white font-raleway font-semibold sm:px-7 lg:px-1">Create an Account</h1>
                        <div className="flex justify-center items-center">
                            <Input 
                                type="text"
                                placeholder="Name" 
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-[7px]" />
                            <FaUser className="absolute sm:translate-x-28 translate-x-16"/>
                        </div>
                        <div className="flex justify-center items-center">
                            <Input 
                                type="text"
                                placeholder="Address" 
                                onChange={(e) => setDefaultLocation(e.target.value)}
                                className="rounded-[7px] pr-10" />
                            <FaLocationArrow className="absolute sm:translate-x-28 translate-x-16"/>
                        </div>
                        <div className="flex justify-center items-center">
                            <Input 
                                type="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-[7px] pr-10" />
                            <SiMinutemailer className="absolute sm:translate-x-28 translate-x-16" size={22}/>
                        </div>
                        <div className="flex justify-center items-center">
                            <Input
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-[7px]" />
                            <FaLock className="absolute sm:translate-x-28 translate-x-16" />
                        </div>
                    </div>
                        <Button type="submit" className="rounded-[5px] mt-6 mx-auto">Create Account</Button>
                </form>
                <div className="flex flex-col sm:flex-row justify-center items-center mt-6">
                    <p className="text-white">Already have an account?</p>
                    <p className="text-textColor pl-2"><NavLink to={"/login"}>Log in</NavLink></p>
                </div>
            </div>
        </div>
        <div className="py-12 text-white bg-background">
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

export default SignUp