import { useState, useEffect } from 'react'
import React from 'react'
import { API_BASE_URL } from '../../api'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  BookHeart,
  Coffee,
  Heart
} from 'lucide-react'

export function AdminDashboard() {
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    pages: '',
    genre: '',
    quantity: '',
    price: '',
    image: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleBookInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files) {
      setBookForm({ ...bookForm, image: files[0] })
    } else {
      setBookForm({ ...bookForm, [name]: value })
    }
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      const formData = new FormData()
      formData.append('title', bookForm.title)
      formData.append('author', bookForm.author)
      formData.append('pages', bookForm.pages)
      formData.append('genre', bookForm.genre)
      formData.append('quantity', bookForm.quantity)
      formData.append('price', bookForm.price)
      if (bookForm.image) formData.append('image', bookForm.image)

      const response = await fetch(`${API_BASE_URL}/book/create`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        setSuccess('Book added successfully!')
        setBookForm({ title: '', author: '', pages: '', genre: '', quantity: '', price: '', image: null })
      } else {
        setError('Failed to add book: ' + (await response.text()))
      }
    } catch (err) {
      setError('Error: ' + err)
    }
    setLoading(false)
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('ZAR', 'R')
  }

  const stats = [
    {
      title: 'Daily Hugs (Revenue)',
      value: 'R15,246',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up',
      description: 'Spreading cozy vibes'
    },
    {
      title: 'Book Lovers Today',
      value: '24',
      change: '+8.2%',
      icon: Users,
      trend: 'up',
      description: 'Happy customers'
    },
    {
      title: 'Cozy Deliveries',
      value: '18',
      change: '+15.1%',
      icon: Package,
      trend: 'up',
      description: 'Books finding homes'
    },
    {
      title: 'Reading Adventures',
      value: '142',
      change: '+4.7%',
      icon: BookHeart,
      trend: 'up',
      description: 'Stories shared'
    }
  ]

  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; status: string; customer: string; message: string; book: string; total: string }>>([]);
  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/order/recent`);
        if (response.ok) {
          const data = await response.json();
          setRecentOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch recent orders:', err);
      }
    }
    fetchRecentOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'shipped':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'default',
      shipped: 'secondary',
      processing: 'outline',
      pending: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="p-6">
      {/* Add Book Form */}
      <Card className="border-orange-100 mb-8">
        <CardHeader>
          <CardTitle className="text-orange-800">Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleBookSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={bookForm.title} onChange={handleBookInput} required className="border-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={bookForm.author} onChange={handleBookInput} required className="border-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <Label htmlFor="pages">Pages</Label>
                <Input id="pages" name="pages" type="number" value={bookForm.pages} onChange={handleBookInput} required className="border-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" value={bookForm.genre} onChange={handleBookInput} required className="border-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" value={bookForm.quantity} onChange={handleBookInput} required className="border-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" value={bookForm.price} onChange={handleBookInput} required className="border-orange-200 focus:border-orange-400" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="image">Book Image (optional)</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleBookInput} className="border-orange-200 focus:border-orange-400" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              {loading ? 'Adding...' : 'Add Book'}
            </Button>
            {success && <p className="text-green-600 mt-2">{success}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full">
              <Coffee className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-800 mb-1">Good Morning, Store Manager!</h2>
              <p className="text-orange-700">Here's how we're spreading cozy reading vibes today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-orange-100 bg-gradient-to-br from-white to-orange-25">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1 text-orange-800">{stat.value}</div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">{stat.change}</span>
                  <span className="text-xs text-orange-600">vs yesterday</span>
                </div>
                <p className="text-xs text-orange-600">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Orders with Cozy Touch */}
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Heart className="w-5 h-5" />
            Recent Cozy Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-gradient-to-r from-white to-orange-25">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium text-orange-800">{order.id}</p>
                    <p className="text-sm text-orange-600">{order.customer}</p>
                    <p className="text-xs text-orange-500 italic">{order.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-800">{order.book}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-medium text-orange-800">{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cozy Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Today's Cozy Vibes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-orange-700">☕ Morning readers</span>
              <span className="font-medium text-orange-800">8 orders</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-700">🌙 Evening browsers</span>
              <span className="font-medium text-orange-800">12 orders</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-700">❤️ Repeat customers</span>
              <span className="font-medium text-orange-800">6 orders</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-700">📚 New book lovers</span>
              <span className="font-medium text-orange-800">4 orders</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Popular Cozy Genres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-orange-700">Fiction & Literature</span>
              <Badge className="bg-orange-200 text-orange-800">35%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-700">Self-Help & Wellness</span>
              <Badge className="bg-amber-200 text-amber-800">28%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-700">Romance</span>
              <Badge className="bg-pink-200 text-pink-800">22%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-700">Mystery & Thriller</span>
              <Badge className="bg-purple-200 text-purple-800">15%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}