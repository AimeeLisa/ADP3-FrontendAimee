import { useState } from 'react'
import { AdminSidebar } from './admin/AdminSidebar'
import { AdminDashboard } from './admin/AdminDashboard'
import { OrderCreation } from './OrderCreation'
import { OrderManagement } from './OrderManagement'
import BookCatalog from './BookCatalog'
import { SupplyOrders } from './SupplyOrders'

import { AdminView } from '../types/AdminView'

interface User {
  id: number;
  type: 'customer' | 'admin';
  name: string;
  email: string;
}

interface AdminAppProps {
  user: User
  onLogout: () => void
}

export function AdminApp({ user, onLogout }: AdminAppProps) {
  const [activeView, setActiveView] = useState<AdminView>('dashboard')

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'create-order':
        return <OrderCreation userId={user.id} />
      case 'manage-orders':
        return <OrderManagement />
      case 'catalog':
        return <BookCatalog />
      case 'supply-orders':
        return <SupplyOrders />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-25 via-amber-25 to-yellow-25">
      <AdminSidebar 
        activeView={activeView} 
        onViewChange={(view: AdminView) => setActiveView(view)}
        user={user}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  )
}