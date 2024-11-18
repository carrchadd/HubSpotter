import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"


const Feedback = () => {
  return (
    <div className="min-h-[calc(100vh-184px)]">
        <div className="max-w-[600px] mx-auto flex flex-grow flex-col items-center">
            <h1 className="lg:text-3xl font-raleway font-semibold mb-16 text-white"> Feedback</h1>
            <form className="w-[80%] font-librefranklin flex flex-col gap-5">
                <Input type='text' placeholder='Name' className="rounded-[5px] w-[40%]" />
                <Textarea placeholder='Feedback' className="rounded-[5px] h-[200px]" />
                <Button className="bg-accent w-[30%] rounded-[5px] mx-auto">Submit</Button>
            </form>
        </div>
    </div>
  )
}

export default Feedback