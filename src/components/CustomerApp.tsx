import { useState } from 'react'
import { CustomerHeader } from './customer/CustomerHeader'
import { BookStorefront } from './customer/BookStorefront'
import { ShoppingCart } from './customer/ShoppingCart'
import { MyOrders } from './customer/MyOrders'
import { CheckoutPage } from './customer/CheckoutPage'
import { UserProfile } from './customer/UserProfile'

export type CustomerView = 'storefront' | 'cart' | 'orders' | 'profile' | 'checkout'

interface User {
  id: string | number
  type: 'customer' | 'admin'
  name: string
  email: string
}

interface CustomerAppProps {
  user: User
  onLogout: () => void
}

export interface CartItem {
  id: string
  title: string
  author: string
  price: number
  quantity: number
  coverImage?: string
}

export function CustomerApp({ user, onLogout }: CustomerAppProps) {
  const [activeView, setActiveView] = useState<CustomerView>('storefront')
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (book: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (bookId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(bookId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const [shippingAddress, setShippingAddress] = useState('');

  const renderContent = () => {
    switch (activeView) {
      case 'storefront':
        return <BookStorefront onAddToCart={addToCart} />
      case 'cart':
        return (
          <ShoppingCart
            items={cartItems}
            userId={typeof user.id === 'string' ? parseInt(user.id) : user.id}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onBackToShopping={() => setActiveView('storefront')}
            onCheckout={() => setActiveView('checkout')}
          />
        )
      case 'checkout':
        // Prompt for shipping address if not set
        if (!shippingAddress) {
          return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Enter Shipping Address</h2>
              <input
                className="border p-2 mb-4 w-full"
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                placeholder="Shipping Address"
              />
              <button
                className="bg-orange-600 text-white px-4 py-2 rounded"
                onClick={() => shippingAddress && setShippingAddress(shippingAddress)}
                disabled={!shippingAddress}
              >
                Continue to Checkout
              </button>
            </div>
          );
        }
        return (
          <CheckoutPage
            user={{ id: typeof user.id === 'string' ? parseInt(user.id) : user.id }}
            cartItems={cartItems}
            shippingAddress={shippingAddress}
            onOrderPlaced={() => clearCart()}
          />
        );
      case 'orders':
        return <MyOrders user={{ ...user, id: typeof user.id === 'string' ? parseInt(user.id) : user.id }} />
      case 'profile':
        return <UserProfile userId={String(user.id)} onLogout={onLogout} />
      default:
        return <BookStorefront onAddToCart={addToCart} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-amber-25 to-yellow-25">
      <CustomerHeader
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={onLogout}
        cartItemCount={cartItemCount}
      />
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  )
}