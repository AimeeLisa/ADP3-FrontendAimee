import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  BookHeart, 
  ShoppingCart, 
  Package, 
  User, 
  LogOut,
  Coffee
} from 'lucide-react'

import type { CustomerView } from '../CustomerApp'

interface User {
  type: 'customer' | 'admin'
  name: string
  email: string
}

interface CustomerHeaderProps {
  user: User
  activeView: CustomerView
  onViewChange: (view: CustomerView) => void
  onLogout: () => void
  cartItemCount: number
}

export function CustomerHeader({ 
  user, 
  activeView, 
  onViewChange, 
  onLogout, 
  cartItemCount 
}: CustomerHeaderProps) {
  const navItems = [
    { id: 'storefront' as CustomerView, label: 'Browse Books', icon: Coffee },
    { id: 'cart' as CustomerView, label: 'My Cart', icon: ShoppingCart, badge: cartItemCount },
    { id: 'orders' as CustomerView, label: 'My Orders', icon: Package },
    { id: 'profile' as CustomerView, label: 'Profile', icon: User },
  ]

  return (
    <header className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full">
              <BookHeart className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-orange-800">Snuggle Reads</h1>
              <p className="text-xs text-orange-600 hidden sm:block">Where every book feels like a warm hug</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? 'default' : 'ghost'}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 relative ${
                    activeView === item.id 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'text-orange-700 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center p-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-orange-800">Hello, {user.name}!</p>
              <p className="text-xs text-orange-600">Happy reading</p>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? 'default' : 'ghost'}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 relative min-w-fit ${
                    activeView === item.id 
                      ? 'bg-orange-500 text-white' 
                      : 'text-orange-700'
                  }`}
                  size="sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center p-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}