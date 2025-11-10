import React, { useContext, useMemo, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const { navigate, cartItems, getCartAmount, clearCart, products } = useContext(ShopContext);

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')
  const [mobile, setMobile] = useState('')

  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000', [])
  const token = useMemo(() => localStorage.getItem('token') || '', [])

  const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id))

  const buildItems = () => {
    const items = []
    let invalidFound = false
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size]
        if (quantity > 0) {
          const prod = products.find(p => String(p._id) === String(productId))
          if (!prod) continue
          if (!isValidObjectId(prod._id)) { invalidFound = true; continue }
          const price = Number(prod.price || 0)
          items.push({ productId: prod._id, quantity, size, price })
        }
      }
    }
    return { items, invalidFound }
  }

  const onPlaceOrder = async () => {
    try {
      const { items, invalidFound } = buildItems()
      if (invalidFound) {
        toast.error('Some items cannot be ordered yet. Please remove them or try again after products are added to the store.')
        return
      }
      if (items.length === 0) {
        toast.error('Your cart is empty')
        return
      }
      const address = {
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zip,
        country,
        mobile,
      }
      const amount = getCartAmount()

      const res = await fetch(`${baseUrl}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, amount, address, paymentId: method !== 'cod' ? 'mock' : undefined }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to place order')

      toast.success('Order placed')
      clearCart()
      navigate('/orders')
    } catch (err) {
      toast.error(err.message)
    }
  }
  
  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='First Name' 
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='Last Name' 
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <input 
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="email" 
          placeholder='Email Address' 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="text" 
          placeholder='Street' 
          value={street}
          onChange={e => setStreet(e.target.value)}
        />
        <div className='flex gap-3'>
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='City' 
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='State' 
            value={state}
            onChange={e => setState(e.target.value)}
          />
        </div>
        <div className='flex gap-3'>
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="number" 
            placeholder='Zip Code' 
            value={zip}
            onChange={e => setZip(e.target.value)}
          />
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='Country' 
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
        </div>
        <input 
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="number" 
          placeholder='Mobile' 
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />
      </div>
      {/* Right Side Content */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        {/* Payment Methods Selection */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full mt-8 text-end'>
            <button onClick={onPlaceOrder} className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
