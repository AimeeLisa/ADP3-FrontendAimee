import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../api'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Package, Truck, CheckCircle, Clock, Eye, Coffee } from 'lucide-react'

interface OrderItem {
  title: string
  author: string
  quantity: number
}

interface Order {
  id: number
  date: string
  status: 'delivered' | 'shipped' | 'processing' | 'pending'
  total: number
  items: OrderItem[]
  shippingAddress?: string
  paymentMethod?: string
}

interface MyOrdersProps {
  user: {
    id: number
  }
}

export function MyOrders({ user }: MyOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Fetch orders for the logged-in customer
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/orders/customer/${user.id}`)
        if (res.ok) {
          const data: Order[] = await res.json()
          setOrders(data)
        } else {
          setOrders([])
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchOrders()
    }
  }, [user.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'default',
      shipped: 'secondary',
      processing: 'outline',
      pending: 'destructive',
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-orange-800 mb-2">
          Your Reading Journey
        </h2>
        <p className="text-orange-600">
          Track your cozy book deliveries and reading adventures
        </p>
      </div>

      {loading ? (
        <Card className="border-orange-100">
          <CardContent className="text-center py-12 text-orange-600">
            Loading your orders...
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="border-orange-100">
          <CardContent className="text-center py-12">
            <Coffee className="h-16 w-16 mx-auto text-orange-300 mb-6" />
            <h3 className="text-xl font-medium mb-2 text-orange-800">
              No orders yet
            </h3>
            <p className="text-orange-600 mb-6">
              Start your reading adventure by browsing our cozy collection!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border-orange-100 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <CardTitle className="text-lg text-orange-800">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-orange-600">
                        Ordered on {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="font-bold text-orange-800">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium text-orange-800 mb-2">
                      Books in this order:
                    </h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                          <div
                            key={item.title + '-' + item.author}
                            className="flex justify-between items-center text-orange-700"
                          >
                            <span>
                              {item.title} by {item.author}
                            </span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-orange-100">
                    <div className="text-sm text-orange-600">
                      {order.status === 'delivered' &&
                        'Delivered - Enjoy your cozy reads!'}
                      {order.status === 'shipped' &&
                        'On its way to your reading nook'}
                      {order.status === 'processing' &&
                        'Being carefully prepared for you'}
                      {order.status === 'pending' &&
                        'Awaiting confirmation from our team'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
      {/* Modal for order details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-orange-600 hover:text-red-500"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-orange-800">Order #{selectedOrder.id}</h3>
            <p className="text-sm text-orange-600 mb-2">Ordered on {selectedOrder.date}</p>
            <p className="mb-2"><span className="font-medium">Status:</span> {selectedOrder.status}</p>
            <p className="mb-2"><span className="font-medium">Total:</span> {formatCurrency(selectedOrder.total)}</p>
            <p className="mb-2"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod || 'N/A'}</p>
            <p className="mb-2"><span className="font-medium">Shipping Address:</span> {selectedOrder.shippingAddress || 'N/A'}</p>
            <h4 className="font-semibold mt-4 mb-2">Books in this order:</h4>
            <ul className="mb-2">
              {selectedOrder.items.map((item, idx) => (
                <li key={item.title + '-' + item.author}>
                  {item.title} by {item.author} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
