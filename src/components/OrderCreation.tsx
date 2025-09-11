import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Plus, Minus, Search } from 'lucide-react'

interface OrderItem {
  id: string
  title: string
  author: string
  price: number
  quantity: number
  stock: number
}

interface OrderCreationProps {
  userId: number;
}

export function OrderCreation({ userId }: OrderCreationProps) {
  useEffect(() => {
    console.log("OrderCreation received userId:", userId)
  }, [userId])

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  
  const [availableBooks, setAvailableBooks] = useState<OrderItem[]>([]);
  useEffect(() => {
    async function fetchAvailableBooks() {
      try {
        const response = await fetch(`${API_BASE_URL}/book/all`);
        if (response.ok) {
          const data = await response.json();
          setAvailableBooks(data.map((book: any) => ({
            id: book.id || book.isbn,
            title: book.title,
            author: book.author,
            price: book.price,
            quantity: 0,
            stock: book.quantity
          })));
        }
      } catch (err) {
        console.error('Failed to fetch available books:', err);
      }
    }
    fetchAvailableBooks();
  }, []);

  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToOrder = (book: OrderItem) => {
    const existingItem = orderItems.find(item => item.id === book.id)
    if (existingItem) {
      if (existingItem.quantity < book.stock) {
        setOrderItems(orderItems.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        ))
      }
    } else {
      setOrderItems([...orderItems, { ...book, quantity: 1 }])
    }
  }

  const removeFromOrder = (bookId: string) => {
    const existingItem = orderItems.find(item => item.id === bookId)
    if (existingItem && existingItem.quantity > 1) {
      setOrderItems(orderItems.map(item =>
        item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
      ))
    } else {
      setOrderItems(orderItems.filter(item => item.id !== bookId))
    }
  }

  const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: '',
    notes: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setForm(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      items: orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address
      },
      paymentMethod: form.paymentMethod,
      notes: form.notes
    };
    console.log("Submitting order with userId:", userId);
    console.log("Order data:", orderData);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/create?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (response.ok) {
        alert('Order created successfully!');
        setOrderItems([]);
        setForm({ firstName: '', lastName: '', email: '', phone: '', address: '', paymentMethod: '', notes: '' });
      } else {
        alert('Failed to create order.');
      }
    } catch (err) {
      alert('Error creating order.');
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="mb-2">Create New Order</h2>
        <p className="text-muted-foreground">
          Create a new customer order by selecting books and filling in customer details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Book Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Books</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">${book.price}</span>
                      <Badge variant={book.stock > 5 ? 'secondary' : 'destructive'} className="text-xs">
                        {book.stock} in stock
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToOrder(book)}
                    disabled={book.stock === 0}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Current Order */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No items selected</p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.author}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromOrder(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToOrder(item)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-16 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={form.firstName} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={form.lastName} onChange={handleFormChange} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={handleFormChange} />
                </div>
                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Textarea id="address" value={form.address} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select required value={form.paymentMethod} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="cash-on-delivery">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea id="notes" value={form.notes} onChange={handleFormChange} placeholder="Any special instructions..." />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={orderItems.length === 0}
                >
                  Create Order (${totalAmount.toFixed(2)})
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}