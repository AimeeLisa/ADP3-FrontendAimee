import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BookOpen, 
  Truck,
  BarChart3,
  Store
} from 'lucide-react'
import { Button } from './ui/button'

type View = 'dashboard' | 'create-order' | 'manage-orders' | 'catalog' | 'supply-orders' | 'reports'

interface SidebarProps {
  activeView: View
  onViewChange: (view: View) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-order' as View, label: 'Create Order', icon: ShoppingCart },
    { id: 'manage-orders' as View, label: 'Manage Orders', icon: Package },
    { id: 'catalog' as View, label: 'Book Catalog', icon: BookOpen },
    { id: 'supply-orders' as View, label: 'Supply Orders', icon: Truck },
    { id: 'reports' as View, label: 'Business Reports', icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-card border-r border-border p-6">
      <div className="flex items-center gap-2 mb-8">
        <Store className="h-8 w-8 text-primary" />
        <h1 className="font-semibold">BookStore Admin</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}