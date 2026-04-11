import React from 'react'

const NewsletterBox = () => {

   const onSubmitHandler = (event)=>{
    event.preventDefault();
   }

  return (
    <div className ='text-center'>
        <p className='text-3xl font-medium text-gray-800 '>Subscribe now & get 20% off</p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere, nostrum.
      </p>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex flex-col sm:flex-row item-center gap-3 mx-auto my-6 pl-3 mb-4" >
        <input className="border pl-4 border-gray-400 w-full sm:flex-1 outline-none" type="email" placeholder='Enter your Email' required/>
        <button className="bg-black text-white text-xs px-10  py-3" type="submit">SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
