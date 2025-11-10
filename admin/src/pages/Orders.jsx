import React, { useEffect, useMemo, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])

  const baseUrl = useMemo(() => backendUrl || 'http://localhost:4000', [])

  const totals = useMemo(() => {
    const sum = (arr) => arr.reduce((a, b) => a + Number(b?.amount || 0), 0)
    const totalRevenue = sum(orders)
    const deliveredRevenue = sum(orders.filter(o => String(o.status) === 'delivered'))
    return { totalRevenue, deliveredRevenue }
  }, [orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/order`, {
        headers: { token }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to load orders')
      setOrders(data.orders || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${baseUrl}/api/order/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to update status')
      toast.success('Order status updated')
      setOrders(prev => prev.map(o => (o._id === id ? data.order : o)))
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statuses = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']
  const statusLabels = {
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    cancelled: 'Cancelled'
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-semibold">Orders</h2>
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
        <div className="p-4 bg-white border rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold">{currency(totals.totalRevenue || 0)}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow-sm">
          <p className="text-sm text-gray-500">Delivered Revenue</p>
          <p className="mt-1 text-2xl font-semibold">{currency(totals.deliveredRevenue || 0)}</p>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Placed</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="p-3 align-top font-mono text-xs">{order._id}</td>
                  <td className="p-3 align-top">{order.userId}</td>
                  <td className="p-3 align-top">
                    <ul className="list-disc pl-4">
                      {(order.items || []).map((it, idx) => (
                        <li key={idx}>
                          {it.productId} × {it.quantity}
                          {it.size ? ` (${it.size})` : ''}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 align-top">{currency(order.amount || 0)}</td>
                  <td className="p-3 align-top">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-3 align-top">
                    <select
                      className="border px-2 py-1 rounded"
                      value={statuses.includes(order.status) ? order.status : ''}
                      onChange={e => updateStatus(order._id, e.target.value)}
                    >
                      {!statuses.includes(order.status) && (
                        <option value="" disabled>{statusLabels[order.status] || order.status}</option>
                      )}
                      {statuses.map(s => (
                        <option key={s} value={s}>{statusLabels[s] || s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Orders