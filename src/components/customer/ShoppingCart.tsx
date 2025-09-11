import { useState } from 'react'
import { API_BASE_URL } from '../../api'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Heart,
  ArrowLeft,
  Coffee,
  Gift
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { CartItem } from '../CustomerApp'

interface ShoppingCartProps {
  items: CartItem[];
  userId: number;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onClearCart: () => void;
  onBackToShopping: () => void;
  onCheckout: () => void;
}

export function ShoppingCart({ 
  items, 
  userId,
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onBackToShopping,
  onCheckout
}: ShoppingCartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace('ZAR', 'R')
  }

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const freeShippingThreshold = 650 // R650 for free shipping (equivalent to $35)
  const shipping = subtotal > freeShippingThreshold ? 0 : 89.99 // R89.99 shipping
  const tax = subtotal * 0.15 // 15% VAT for South Africa
  const total = subtotal + shipping + tax

  // Removed address, paymentMethod, and handleCheckout logic

  // Removed orderComplete logic

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-100">
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-orange-300 mb-6" />
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Your cart feels a bit lonely</h2>
            <p className="text-orange-600 mb-6">
              Add some cozy books to make it happy! Every book is waiting to give you a warm hug.
            </p>
            <Button 
              onClick={onBackToShopping}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Browse Our Cozy Collection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBackToShopping}
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-orange-800">Your Cozy Cart</h2>
          <p className="text-orange-600">
            {items.length} {items.length === 1 ? 'book' : 'books'} ready to wrap you in warmth
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-orange-100">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex-shrink-0">
                    <ImageWithFallback 
                      src="/api/placeholder/80/112"
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-orange-800">{item.title}</h4>
                        <p className="text-sm text-orange-600">{item.author}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-orange-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 p-0 border-orange-200"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-orange-800">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 border-orange-200"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-orange-800">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-orange-600">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onClearCart}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-orange-700">Subtotal</span>
                <span className="font-medium text-orange-800">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-orange-700">Shipping</span>
                <div className="text-right">
                  {shipping === 0 ? (
                    <div>
                      <span className="font-medium text-green-600">Free</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        R650+ orders
                      </Badge>
                    </div>
                  ) : (
                    <span className="font-medium text-orange-800">{formatCurrency(shipping)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-orange-700">VAT (15%)</span>
                <span className="font-medium text-orange-800">{formatCurrency(tax)}</span>
              </div>
              
              <Separator className="bg-orange-200" />
              
              <div className="flex justify-between text-lg">
                <span className="font-medium text-orange-800">Total</span>
                <span className="font-bold text-orange-800">{formatCurrency(total)}</span>
              </div>
              
              {subtotal < freeShippingThreshold && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-700">
                    Add {formatCurrency(freeShippingThreshold - subtotal)} more for free shipping!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

    {/* Delivery Information removed; handled in CheckoutPage */}

          <Button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg py-6"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Proceed to Checkout - {formatCurrency(total)}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}