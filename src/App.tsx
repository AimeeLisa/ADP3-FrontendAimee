import { useState } from 'react'
import { LoginPage } from './components/LoginPage'
import { CustomerApp } from './components/CustomerApp'
import { AdminApp } from './components/AdminApp'

type UserType = 'customer' | 'admin'

interface User {
  id: number;
  type: UserType;
  name: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (userType: UserType, userData: { id: string | number; name: string; email: string }) => {
    setUser({
      id: Number(userData.id),
      type: userType,
      name: userData.name,
      email: userData.email
    })
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (user.type === 'customer') {
    return <CustomerApp user={user} onLogout={handleLogout} />
  }

  if (user.type === 'admin') {
    return <AdminApp user={user} onLogout={handleLogout} />
  }

  return null
}