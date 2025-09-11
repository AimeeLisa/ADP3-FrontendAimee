import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { 
  Plus, 
  Truck, 
  Package, 
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react'

interface SupplyOrder {
  id: string
  supplier: string
  items: Array<{
    bookTitle: string
    isbn: string
    quantity: number
    unitCost: number
  }>
  status: 'pending' | 'ordered' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  expectedDelivery: string
  totalCost: number
}

export function SupplyOrders() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const [supplyOrders, setSupplyOrders] = useState<SupplyOrder[]>([]);
  useEffect(() => {
    async function fetchSupplyOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/supplyorder/all`);
        if (response.ok) {
          const data = await response.json();
          setSupplyOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch supply orders:', err);
      }
    }
    fetchSupplyOrders();
  }, []);

  const [lowStockBooks, setLowStockBooks] = useState<Array<{ title: string; author: string; currentStock: number; recommendedOrder: number }>>([]);
  useEffect(() => {
    async function fetchLowStockBooks() {
      try {
        const response = await fetch(`${API_BASE_URL}/book/lowstock`);
        if (response.ok) {
          const data = await response.json();
          setLowStockBooks(data);
        }
      } catch (err) {
        console.error('Failed to fetch low stock books:', err);
      }
    }
    fetchLowStockBooks();
  }, []);

  const suppliers = [
    'Penguin Random House',
    'HarperCollins',
    'Simon & Schuster',
    'Macmillan Publishers',
    'Scholastic Corporation'
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'default',
      shipped: 'secondary',
      ordered: 'outline',
      pending: 'destructive',
      cancelled: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Package className="h-4 w-4 text-green-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />
      default:
        return <Calendar className="h-4 w-4 text-yellow-500" />
    }
  }

  if (showCreateForm) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            ← Back to Supply Orders
          </Button>
          <div>
            <h2>Create Supply Order</h2>
            <p className="text-muted-foreground">Place a new order with suppliers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input id="expectedDelivery" type="date" />
              </div>
              
              <div>
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea id="notes" placeholder="Any special instructions..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Add from Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockBooks.map((book, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">{book.title}</p>
                        <p className="text-xs text-muted-foreground">Stock: {book.currentStock}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Add {book.recommendedOrder}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-border rounded-lg">
                <div>
                  <Label>Book Title</Label>
                  <Input placeholder="Enter book title" />
                </div>
                <div>
                  <Label>ISBN</Label>
                  <Input placeholder="ISBN" />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>Unit Cost</Label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-muted-foreground py-8">
                No items added yet. Add books to create your supply order.
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Total Order Cost:</span>
                <span className="text-xl font-semibold">$0.00</span>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button className="flex-1">
                  Create Supply Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2">Supply Orders</h2>
          <p className="text-muted-foreground">
            Manage inventory restocking and supplier orders.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Supply Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting supplier confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Expected this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Spend
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,247</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Supply Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplyOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.supplier}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • Expected: {order.expectedDelivery}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalCost.toFixed(2)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockBooks.map((book, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <p className="font-medium text-sm">{book.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Stock: {book.currentStock}
                    </span>
                    <Button size="sm" variant="outline">
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}