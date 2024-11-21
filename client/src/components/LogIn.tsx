import { Input } from "./ui/input"
import { FaUser, FaLock } from "react-icons/fa";
import { Button } from "./ui/button";
import { FaGithubSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";



//test comment

const LogIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [logInSuccess, setLogInSuccess] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const navigate = useNavigate();


    const authenticateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch ('http://localhost:4040/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const data = await response.json();
        console.log(data);
        if (response.status === 201 && response.ok) {
            setLogInSuccess(true);
            setIsNavigating(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        }
    }


  return (
    
    <div className="w-full bg-background">

        {logInSuccess && (
            <div className="fixed top-4 right-4 bg-emerald-500 text-white px-7 py-4 rounded-md shadow-lg flex items-center">
                <span>Log In Success</span>
                <button 
                    onClick={() => setLogInSuccess(false)}
                    className="ml-2 hover:text-emerald-100"
                >
                    <X size={16} />
                </button>
            </div>
        )}

        <div className="flex justify-center items-center pb-14">
            <div className="px-16 bg-accent pt-11 pb-16 rounded-[5px]">
                <form className="flex flex-col" onSubmit={authenticateUser}>
                    <div className="flex flex-col mx-auto gap-6 w-full">
                        <h1 className="lg:text-3xl text-2xl mb-5 text-white font-raleway font-semibold">Sign In</h1>
                        <div className="flex justify-center items-center">
                            <Input 
                                type="email"
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-[7px]" />
                            <FaUser className="absolute sm:translate-x-28 translate-x-16"/>
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
                    <Button type="submit" className="rounded-[5px] mt-6 mx-auto" disabled={isNavigating}>
                        {isNavigating ? "Redirecting..." : "Sign In"}
                    </Button>
                </form>
                <div className="flex flex-col sm:flex-row justify-center items-center mt-6">
                    <p className="text-white">Don't have an account?</p>
                    <p className="text-textColor pl-2"><NavLink to={"/signup"}>Sign up now</NavLink></p>
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

export default LogIn