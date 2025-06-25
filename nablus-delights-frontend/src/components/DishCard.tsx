// File: src/components/DishCard.tsx
'use client'; // This component has a button with an onClick handler

import Image from 'next/image';
import { Dish } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

export default function DishCard({ dish }: { dish: Dish }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative h-56 w-full">
        <Image
          src={`/images/knafeh.jpg`} // Placeholder image
          alt={dish.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">{dish.name}</h2>
        <p className="text-gray-600 mb-4 h-20 overflow-hidden">{dish.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-3xl font-extrabold text-green-600">${dish.price.toFixed(2)}</p>
          <button 
            onClick={() => addToCart(dish)} // <-- This now works!
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}