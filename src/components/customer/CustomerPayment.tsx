import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../api'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface Payment {
  payment_id: string
  amount: number
  quantity: number
  status: string
  total: number
  transaction_code: string
}

export function CustomerPayment({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setPayments(data)
        } else {
          setError('Failed to fetch payments')
        }
      } catch (err) {
        setError('Error fetching payments')
      }
      setLoading(false)
    }
    fetchPayments()
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {payments.length === 0 && !loading && !error && (
          <div>No payments found.</div>
        )}
        {payments.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Total</th>
                <th>Transaction Code</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.payment_id}>
                  <td>{p.payment_id}</td>
                  <td>R{p.amount}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <Badge variant={p.status === 'paid' ? 'default' : 'destructive'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>R{p.total}</td>
                  <td>{p.transaction_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
