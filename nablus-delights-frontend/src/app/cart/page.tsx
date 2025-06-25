// File: src/app/cart/page.tsx
'use client';

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cartItems } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user || !token) {
        setMessage('You must be logged in to place an order.');
        router.push('/login');
        return;
    }
    
    const orderItems = cartItems.map(item => ({ dishId: item.id, quantity: item.quantity }));
    
    try {
        await createOrder(orderItems, token);
        setMessage('Order placed successfully! Thank you.');
        // Here you would typically clear the cart: cart.clearCart();
        setTimeout(() => router.push('/'), 3000);
    } catch (error) {
        setMessage('There was an error placing your order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t border-gray-200 text-right">
            <p className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            <button 
              onClick={handlePlaceOrder}
              className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Place Order
            </button>
            {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
      )}
    </div>
  );
}