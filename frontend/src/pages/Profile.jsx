import React, { useState } from 'react'

const Profile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: Hook up to backend when available
    alert('Profile saved (demo)')
  }

  return (
    <div className='max-w-lg py-8 mx-auto'>
      <h1 className='mb-6 text-2xl font-semibold'>Edit Profile</h1>
      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        <input
          className='w-full px-3 py-2 border rounded'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='w-full px-3 py-2 border rounded'
          placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='px-6 py-2 text-white bg-black rounded'>Save</button>
      </form>
    </div>
  )
}

export default Profile
