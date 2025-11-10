import React, { useEffect, useMemo, useState } from 'react'
import Title from '../components/Title'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const baseUrl = useMemo(() => {
    const raw = (import.meta.env.VITE_BACKEND_URL || '').toString().trim()
    const valid = raw && /^https?:\/\//i.test(raw) ? raw : 'http://localhost:4001'
    return valid.replace(/\/$/, '')
  }, [])
  const token = useMemo(() => localStorage.getItem('token') || '', [])

  const fetchMyOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/order/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to load orders')
      setOrders(data.orders || [])
    } catch (err) {
      // no toast component available here by default; could integrate later
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchMyOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const statusBadge = (status) => {
    const color = status === 'delivered' ? 'bg-green-500' : status === 'out_for_delivery' ? 'bg-blue-500' : 'bg-gray-400'
    return <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>
  }

  // Cancel option removed per request

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className='py-10 text-gray-500'>No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between'>
              <div className='flex items-start gap-6 text-sm'>
                <div>
                  <p className='font-medium sm:text-base'>Order #{order._id}</p>
                  <div className='mt-2 text-base text-gray-700'>
                    <p className='text-sm'>Items: {(order.items || []).reduce((a, b) => a + (b.quantity || 0), 0)}</p>
                    <p className='text-sm'>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between gap-3 md:w-1/2'>
                <div className='flex items-center gap-2'>
                  {statusBadge(order.status)}
                  <p className='text-sm md:text-base capitalize'>{String(order.status).replaceAll('_',' ')}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button onClick={() => navigate(`/orders/${order._id}`, { state: { order } })} className='px-4 py-2 text-sm font-medium border rounded-sm'>TRACK ORDER</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
