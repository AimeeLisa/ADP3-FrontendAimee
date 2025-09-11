import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BookOpen, 
  Truck,
  BarChart3,
  BookHeart,
  LogOut,
  Coffee
} from 'lucide-react'
import { Button } from '../ui/button'

type AdminView = 'dashboard' | 'create-order' | 'manage-orders' | 'catalog' | 'supply-orders' | 'reports'

interface User {
  type: 'customer' | 'admin'
  name: string
  email: string
}

interface AdminSidebarProps {
  activeView: AdminView
  onViewChange: (view: AdminView) => void
  user: User
  onLogout: () => void
}

export function AdminSidebar({ activeView, onViewChange, user, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-order' as AdminView, label: 'Create Order', icon: ShoppingCart },
    { id: 'manage-orders' as AdminView, label: 'Manage Orders', icon: Package },
    { id: 'catalog' as AdminView, label: 'Book Catalog', icon: BookOpen },
    { id: 'supply-orders' as AdminView, label: 'Supply Orders', icon: Truck },
    { id: 'reports' as AdminView, label: 'Business Reports', icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-orange-100 to-amber-100 border-r border-orange-200 p-6">
      {/* Logo and Branding */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full">
            <BookHeart className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <h1 className="font-bold text-orange-800">Snuggle Reads</h1>
            <p className="text-xs text-orange-600">Admin Portal</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg p-3 text-center">
          <Coffee className="w-5 h-5 mx-auto text-orange-600 mb-1" />
          <p className="text-xs text-orange-700 font-medium">Where every book feels like a warm hug</p>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 ${
                activeView === item.id 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'text-orange-700 hover:bg-orange-50'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="mt-auto">
        <div className="bg-white/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-orange-700">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">{user.name}</p>
              <p className="text-xs text-orange-600">Store Manager</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}