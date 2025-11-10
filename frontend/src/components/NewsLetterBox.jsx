import React, { useEffect, useState } from 'react'

const NewsLetterBox = () => {

  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const flag = localStorage.getItem('subscribed') === 'true'
    setSubscribed(flag)
  }, [])

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!email) return
    try {
      localStorage.setItem('newsletterEmail', email)
      localStorage.setItem('subscribed', 'true')
      setSubscribed(true)
      setEmail('')
    } catch (_) {}
  }
  
  return (
    <div className='mt-10 text-center '>
      <p className='text-2xl font-medium text-gray-800'>
        {subscribed ? 'You’re subscribed! Extra offers unlocked 🎉' : 'Unlock 20% Off | Subscribe Today!'}
      </p>
      <p className='mt-3 text-gray-400'>
        {subscribed ? 'Enjoy exclusive subscriber-only deals and early access to sales.' : 'Don\'t miss out—unlock your savings now by subscribing below!'}
      </p>
      {!subscribed && (
        <form onSubmit={onSubmitHandler} className='flex items-center w-full gap-3 pl-3 mx-auto my-6 border sm:w-1/2'>
          <input 
            className='w-full outline-none sm:flex-1' 
            type="email" 
            placeholder='hello@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type='submit' className='px-10 py-4 text-xs text-white bg-black'>SUBSCRIBE</button>
        </form>
      )}
    </div>
  )
}

export default NewsLetterBox
