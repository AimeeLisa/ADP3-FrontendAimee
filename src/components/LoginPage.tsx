import { useState } from 'react'
import { API_BASE_URL } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { BookHeart, Coffee, Sparkles } from 'lucide-react'

interface LoginPageProps {
  onLogin: (userType: 'customer' | 'admin', userData: { id: string | number; name: string; email: string }) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', password: '' })
  const [adminForm, setAdminForm] = useState({ email: '', password: '' })
  const [showRegister, setShowRegister] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: ''
  })

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerForm.email,
          password: customerForm.password,
        }),
      });
      if (response.ok) {
        const user = await response.json();
  onLogin('customer', { id: user.userId, name: user.userFirstName + ' ' + user.userLastName, email: user.contact.email });
      } else {
        alert('Login failed: ' + (await response.text()));
      }
    } catch (err) {
      alert('Login error: ' + err);
    }
  }

  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: undefined, // Let backend generate or add logic if needed
          userFirstName: registerForm.firstName,
          userLastName: registerForm.lastName,
          email: registerForm.email,
          contact: {
            email: registerForm.email,
            phoneNumber: registerForm.phoneNumber,
            address: registerForm.address,
            password: registerForm.password,
          },
        }),
      });
      if (response.ok) {
        setShowRegister(false);
        setRegisterForm({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', password: '' });
        alert('Registration successful! You can now log in.');
      } else {
        const error = await response.text();
        alert('Registration failed: ' + error);
      }
    } catch (err) {
      alert('Registration error: ' + err);
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminForm.email,
          password: adminForm.password,
        }),
      });
      if (response.ok) {
        const user = await response.json();
        if (user.role && user.role.toLowerCase() === 'admin') {
          onLogin('admin', { id: user.userId, name: user.userFirstName + ' ' + user.userLastName, email: user.contact.email });
        } else {
          alert('Access denied: You are not an admin.');
        }
      } else {
        alert('Login failed: ' + (await response.text()));
      }
    } catch (err) {
      alert('Login error: ' + err);
    }
  }

  const handleQuickLogin = (userType: 'customer' | 'admin') => {
    if (userType === 'customer') {
      onLogin('customer', { id: 1, name: 'Book Lover', email: 'customer@example.com' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-25 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full mb-4">
            <BookHeart className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-orange-800 mb-2">Snuggle Reads</h1>
          <p className="text-orange-600 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            Where every book feels like a warm hug
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        <Card className="shadow-xl border-orange-100">
          <CardContent className="p-6">
            {showRegister ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-orange-800">Create Your Account</h3>
                  <p className="text-sm text-orange-600">Register to start your cozy reading journey</p>
                </div>
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <Label htmlFor="register-firstName">First Name</Label>
                    <Input
                      id="register-firstName"
                      placeholder="First Name"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-lastName">Last Name</Label>
                    <Input
                      id="register-lastName"
                      placeholder="Last Name"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-phone">Phone Number</Label>
                    <Input
                      id="register-phone"
                      placeholder="Phone Number"
                      value={registerForm.phoneNumber}
                      onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-address">Address</Label>
                    <Input
                      id="register-address"
                      placeholder="Address"
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    Register
                  </Button>
                </form>
                <div className="text-center">
                  <Button variant="outline" onClick={() => setShowRegister(false)} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                    Back to Login
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="customer" className="flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Shop Books
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <BookHeart className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="customer">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-medium text-orange-800">Welcome, Book Lover!</h3>
                      <p className="text-sm text-orange-600">Start your cozy reading journey</p>
                    </div>
                    <form onSubmit={handleCustomerLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="customer-name">Your Name</Label>
                        <Input
                          id="customer-name"
                          placeholder="What should we call you?"
                          value={customerForm.name}
                          onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-email">Email</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-password">Password</Label>
                        <Input
                          id="customer-password"
                          type="password"
                          placeholder="Your secret reading password"
                          value={customerForm.password}
                          onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      >
                        Start Reading Adventure
                      </Button>
                    </form>
                    <div className="text-center flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleQuickLogin('customer')}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        Quick Browse
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRegister(true)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="admin">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-medium text-orange-800">Admin Portal</h3>
                      <p className="text-sm text-orange-600">Manage your cozy bookstore</p>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@snugglereads.com"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Your admin password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        Access Admin Dashboard
                      </Button>
                    </form>
                    {/* Removed quick admin login for security */}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-orange-500">
          <p>Made with ❤️ for book lovers everywhere</p>
        </div>
      </div>
    </div>
  )
}