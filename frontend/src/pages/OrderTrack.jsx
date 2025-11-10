import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import Title from '../components/Title'

const OrderTrack = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001', [])
  const token = useMemo(() => localStorage.getItem('token') || '', [])

  useEffect(() => {
    const load = async () => {
      if (order) return
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/order/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (data?.success) {
          const found = (data.orders || []).find(o => String(o._id) === String(id))
          setOrder(found || null)
        }
      } catch (_) {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const statusSteps = [
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for delivery' },
    { key: 'delivered', label: 'Delivered' },
  ]

  const currentIndex = order ? Math.max(0, statusSteps.findIndex(s => s.key === order.status)) : 0

  return (
    <div className='pt-16 border-t'>
      <div className='flex items-center justify-between mb-6'>
        <Title text1={'TRACK'} text2={'ORDER'} />
        <button onClick={() => navigate('/orders')} className='px-3 py-2 text-sm border'>Back to Orders</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : !order ? (
        <p className='text-gray-500'>Order not found.</p>
      ) : (
        <div className='space-y-6'>
          <div className='p-4 bg-white border'>
            <p className='text-sm text-gray-600'>Order ID</p>
            <p className='font-mono text-sm'>{order._id}</p>
            <p className='mt-2 text-sm text-gray-600'>Placed</p>
            <p className='text-sm'>{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className='p-4 bg-white border'>
            <p className='mb-4 text-sm text-gray-600'>Status</p>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              {statusSteps.map((step, idx) => {
                const active = idx <= currentIndex
                return (
                  <div key={step.key} className='flex items-center gap-2'>
                    <span className={`inline-block w-3 h-3 rounded-full ${active ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                    <span className={`text-sm ${active ? 'text-green-700' : 'text-gray-500'}`}>{step.label}</span>
                    {idx < statusSteps.length - 1 && <span className='hidden mx-3 text-gray-300 sm:inline'>—</span>}
                  </div>
                )
              })}
            </div>
          </div>

          <div className='p-4 bg-white border'>
            <p className='mb-3 text-sm text-gray-600'>Items</p>
            <ul className='text-sm list-disc pl-5 text-gray-700'>
              {(order.items || []).map((it, i) => (
                <li key={i}>
                  {String(it.productId)} × {it.quantity}{it.size ? ` (${it.size})` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTrack
