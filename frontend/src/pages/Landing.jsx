import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center'>
      <h1 className='text-3xl sm:text-4xl font-semibold'>Welcome to Trendify</h1>
      <p className='text-gray-600 max-w-xl'>Discover the latest collections and shop your favorite styles. Get started by creating an account or logging in.</p>
      <div className='flex gap-4'>
        <Link to='/signup' className='px-6 py-2 bg-black text-white rounded'>Sign Up</Link>
        <Link to='/login' className='px-6 py-2 border border-black rounded'>Log In</Link>
      </div>
    </div>
  )
}

export default Landing
