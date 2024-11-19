import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { FaStar } from "react-icons/fa";


const Feedback = () => {

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const sendFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch ('http://localhost:4040/feedback/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rating,
            feedback
        })
    })
    if (response.status === 200) {
        alert('Feedback Sent Successfully')
    }
  };

  // Define RatingReview inside ParentComponent
  function RatingReview({
    rating,
    setRating,
  }: {
    rating: number;
    setRating: (rating: number) => void;
  }) {
    return (
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => {
          return (
            <span
            style={{
                cursor: 'pointer',
                color: rating >= star ? '#BFD9C0' : 'gray',
                fontSize: '35px',
            }}
            onClick={() => setRating(star)}
            key={star} // Ensure each star has a unique key
            >
                <FaStar className="transform hover:scale-110 transition duration-300" />
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex justify-center items-center">
        <div className="lg:min-w-[40%] md:min-w-[60%] max-w-[85%]  mx-auto flex flex-col items-center bg-accent rounded-[6px]">
            <div className="text-center text-white flex flex-col gap-2 my-4">
                <h1 className="lg:text-3xl md:text-2xl text-xl font-librefranklin font-semibold text-white">We value your opinion.</h1>
                <p className="font-nunito mt-5">How would you rate your overall experience?</p>
                <RatingReview rating={rating} setRating={setRating}/>
                <p className="font-nunito mx-4">Let us know how we’re doing—provide your thoughts in the field below.</p>
            </div>
            <form onSubmit={sendFeedback} className="w-full font-librefranklin">
                <div className="flex flex-col gap-5 mx-10">
                    <Textarea placeholder='Enter your feedback here' required onChange={(e) => setFeedback(e.target.value)} className="rounded-[5px] h-[200px]" />
                    <Button className="bg-secondary text-black w-[30%] rounded-[5px] mb-4 mx-auto">Submit</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Feedback