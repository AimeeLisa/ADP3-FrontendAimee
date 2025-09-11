import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react'

export function Dashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,847',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Orders Today',
      value: '24',
      change: '+8.2%',
      icon: Package,
      trend: 'up'
    },
    {
      title: 'Active Customers',
      value: '1,284',
      change: '+4.1%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Books in Stock',
      value: '3,847',
      change: '-2.3%',
      icon: Package,
      trend: 'down'
    }
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', book: 'The Great Gatsby', status: 'processing', total: '$24.99' },
    { id: 'ORD-002', customer: 'Sarah Jones', book: 'To Kill a Mockingbird', status: 'shipped', total: '$19.99' },
    { id: 'ORD-003', customer: 'Mike Wilson', book: '1984', status: 'delivered', total: '$22.50' },
    { id: 'ORD-004', customer: 'Emily Brown', book: 'Pride and Prejudice', status: 'processing', total: '$18.99' },
    { id: 'ORD-005', customer: 'David Lee', book: 'The Catcher in the Rye', status: 'pending', total: '$21.99' }
  ]

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
      <div className="mb-8">
        <h2 className="mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your bookstore today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3 w-3 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.book}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-medium">{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}