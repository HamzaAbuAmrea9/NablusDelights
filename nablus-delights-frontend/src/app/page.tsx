// File: src/app/page.tsx

import { getDishes, Dish } from "@/services/api";
import Image from 'next/image';

// This is a Server Component, so we can make it async and fetch data directly.
export default async function HomePage() {
  // Fetch the dishes from our API service when the page is rendered on the server.
  const dishes = await getDishes();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Nablus Delights</h1>
          <p className="mt-4 text-xl text-gray-500">Authentic Flavors, Delivered to Your Door</p>
        </header>

        {/* Conditionally render the grid or a message if no dishes are found */}
        {dishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Map over the fetched dishes and render a DishCard for each one */}
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Could not load the menu. Please make sure the backend services are running.
          </p>
        )}
      </div>
    </main>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-56 w-full">
        <Image
          
          src={`/images/knafeh.jpg`} 
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
            <p className="text-3xl font-extrabold text-green-600">
                ${dish.price.toFixed(2)}
            </p>
            <button className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
}