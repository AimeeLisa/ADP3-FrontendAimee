import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Plus, Truck, Package, AlertTriangle, Calendar, DollarSign } from 'lucide-react'

interface SupplyOrderItem {
  bookTitle: string
  isbn: string
  quantity: number
  unitCost: number
}

interface SupplyOrder {
  id: string
  supplier: string
  items: SupplyOrderItem[]
  status: 'pending' | 'ordered' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  expectedDelivery: string
  totalCost: number
}

export function SupplyOrders() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [supplyOrders, setSupplyOrders] = useState<SupplyOrder[]>([])
  const [lowStockBooks, setLowStockBooks] = useState<Array<{ title: string; author: string; currentStock: number; recommendedOrder: number }>>([])
  
  const [newOrder, setNewOrder] = useState({
    supplier: '',
    expectedDelivery: '',
    notes: '',
    items: [] as SupplyOrderItem[],
  })

  const suppliers = [
    'Penguin Random House',
    'HarperCollins',
    'Simon & Schuster',
    'Macmillan Publishers',
    'Scholastic Corporation'
  ]

  useEffect(() => {
    // Initialize low stock books (realistic example, all start at 0 or low stock)
    setLowStockBooks([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', currentStock: 2, recommendedOrder: 5 },
      { title: '1984', author: 'George Orwell', currentStock: 1, recommendedOrder: 6 },
      { title: 'Pride and Prejudice', author: 'Jane Austen', currentStock: 0, recommendedOrder: 4 },
    ])
    setSupplyOrders([]) // start with zero orders
  }, [])

  const addItemToOrder = (item: SupplyOrderItem) => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))
  }

  const handleCreateOrder = () => {
    if (!newOrder.supplier || !newOrder.expectedDelivery || newOrder.items.length === 0) {
      alert('Please select supplier, date, and add at least one item.')
      return
    }

    const totalCost = newOrder.items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0)
    const order: SupplyOrder = {
      id: `SO-${Date.now()}`,
      supplier: newOrder.supplier,
      items: newOrder.items,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: newOrder.expectedDelivery,
      totalCost
    }

    setSupplyOrders(prev => [order, ...prev])
    setNewOrder({ supplier: '', expectedDelivery: '', notes: '', items: [] })
    setShowCreateForm(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'default',
      shipped: 'secondary',
      ordered: 'outline',
      pending: 'destructive',
      cancelled: 'destructive'
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Package className="h-4 w-4 text-green-500" />
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />
      default: return <Calendar className="h-4 w-4 text-yellow-500" />
    }
  }

  const formatCurrency = (value: number) => `R${value.toFixed(2)}`

  if (showCreateForm) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>← Back to Supply Orders</Button>
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
                <Select value={newOrder.supplier} onValueChange={(val: string) => setNewOrder(prev => ({ ...prev, supplier: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input id="expectedDelivery" type="date" value={newOrder.expectedDelivery} onChange={(e) => setNewOrder(prev => ({ ...prev, expectedDelivery: e.target.value }))} />
              </div>

              <div>
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea id="notes" placeholder="Any special instructions..." value={newOrder.notes} onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Add from Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockBooks.map((book, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">{book.title}</p>
                        <p className="text-xs text-muted-foreground">Stock: {book.currentStock}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addItemToOrder({ bookTitle: book.title, isbn: '', quantity: book.recommendedOrder, unitCost: 100 })}>
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
              {newOrder.items.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No items added yet. Add books to create your supply order.
                </div>
              ) : (
                newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-4 border border-border rounded-lg">
                    <div><Label>Book Title</Label><Input value={item.bookTitle} readOnly /></div>
                    <div><Label>ISBN</Label><Input value={item.isbn} readOnly /></div>
                    <div><Label>Quantity</Label><Input value={item.quantity} readOnly /></div>
                    <div><Label>Unit Cost</Label><Input value={item.unitCost} readOnly /></div>
                    <div className="flex items-end">
                      <Button size="sm" variant="destructive" onClick={() => setNewOrder(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))}>Remove</Button>
                    </div>
                  </div>
                ))
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Total Order Cost:</span>
                <span className="text-xl font-semibold">{formatCurrency(newOrder.items.reduce((acc, i) => acc + i.quantity * i.unitCost, 0))}</span>
              </div>

              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreateOrder}>Create Supply Order</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main page
  const pendingOrdersCount = supplyOrders.filter(o => o.status === 'pending').length
  const inTransitCount = supplyOrders.filter(o => o.status === 'shipped').length
  const monthlySpend = supplyOrders.reduce((acc, o) => acc + o.totalCost, 0)

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2">Supply Orders</h2>
          <p className="text-muted-foreground">Manage inventory restocking and supplier orders.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Supply Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting supplier confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitCount}</div>
            <p className="text-xs text-muted-foreground">Expected soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlySpend)}</div>
            <p className="text-xs text-muted-foreground">Since start of month</p>
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
                {supplyOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No supply orders yet.</p>
                ) : (
                  supplyOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.supplier}</p>
                          <p className="text-sm text-muted-foreground">{order.items.length} items • Expected: {order.expectedDelivery}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.totalCost)}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" /> Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockBooks.map((book, index) => (
                <div key={index} className="p-3 border border-border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    <p className="text-xs text-muted-foreground">Stock: {book.currentStock}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => addItemToOrder({ bookTitle: book.title, isbn: '', quantity: book.recommendedOrder, unitCost: 100 })}>
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
