import React, { useState } from 'react';

interface CartItem {
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface CheckoutPageProps {
  user: { id: number };
  cartItems: CartItem[];
  shippingAddress: string;
  onOrderPlaced?: () => void;
}

import { API_BASE_URL } from '../../api';

export function CheckoutPage({ user, cartItems, shippingAddress, onOrderPlaced }: CheckoutPageProps) {
  const [form, setForm] = useState({
    shippingAddress: shippingAddress || '',
    paymentMethod: '',
  });
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setConfirmation(null);
    try {
      // 1. Create payment
      const paymentRes = await fetch(`${API_BASE_URL}/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          status: 'Pending',
          transactionCode: 'TX-' + Date.now(),
        }),
      });
      const payment = await paymentRes.json();

      // 2. Create order
      const orderRes = await fetch(`${API_BASE_URL}/orders/create?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: form.shippingAddress,
          paymentMethod: form.paymentMethod,
          items: cartItems,
          paymentId: payment.id,
        }),
      });
      const order = await orderRes.json();

      setConfirmation(`Order placed! Order ID: ${order.orderId}`);
      if (order.orderId && typeof onOrderPlaced === 'function') {
        onOrderPlaced();
      }
    } catch (err) {
      setConfirmation('Error placing order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>Order Date: {new Date().toLocaleDateString()}</div>
        <div className="font-bold">Total Amount: R{totalAmount.toFixed(2)}</div>
        <div>
          <h3 className="font-semibold mb-2">Items:</h3>
          <ul>
            {cartItems.map((item, idx) => (
              <li key={item.title + '-' + item.author}>
                {item.title} by {item.author} (Qty: {item.quantity}) - R{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block mb-1 font-medium">Shipping Address</label>
          <input
            name="shippingAddress"
            className="border p-2 w-full"
            value={form.shippingAddress}
            onChange={handleChange}
            placeholder="Enter shipping address"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            className="border p-2 w-full"
            value={form.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select payment method</option>
            <option value="Card">Card</option>
            <option value="EFT">EFT</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg py-3 rounded shadow"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Place Order'}
        </button>
        {confirmation && <div className="mt-4 text-green-700">{confirmation}</div>}
      </form>
    </div>
  );
}
