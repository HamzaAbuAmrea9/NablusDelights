// File: src/components/AdminDashboard.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDishes, createDish, updateDish, deleteDish, Dish, CreateDishData } from '@/services/api';

export default function AdminDashboard() {
  const { token } = useAuth();
  
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateDishData>({ name: '', description: '', price: 0, imageUrl: '' });

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const fetchedDishes = await getDishes();
        setDishes(fetchedDishes);
      } catch (err) {
        setError('Failed to load dishes.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDishes();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, imageUrl: '' });
    setIsEditing(null);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
        setError("You are not authorized to perform this action.");
        return;
    };

    try {
      if (isEditing) {
        await updateDish(isEditing, formData, token);
      } else {
        await createDish(formData, token);
      }
      resetForm();
      const fetchedDishes = await getDishes();
      setDishes(fetchedDishes);
    } catch (err) {
      setError('Failed to save dish. Please check your input.');
    }
  };

  const handleEdit = (dish: Dish) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEditing(dish.id);
    setFormData({ name: dish.name, description: dish.description, price: dish.price, imageUrl: dish.imageUrl || '' });
  };
  
  const handleDelete = async (id: number) => {
    if (!token || !window.confirm('Are you sure you want to delete this dish?')) return;
    
    try {
      await deleteDish(id, token);
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError('Failed to delete dish.');
    }
  };

  if (isLoading) {
    return <p className="text-center p-12">Loading Admin Dashboard...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-gray-500">Manage your restaurant's menu.</p>
      </header>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6">{error}</p>}
      
      <div className="bg-white p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-semibold mb-6">{isEditing ? `Editing: ${formData.name}` : 'Add a New Dish'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Dish Name" required className="p-3 border rounded-md"/>
          <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" type="number" step="0.01" required className="p-3 border rounded-md"/>
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required className="p-3 border rounded-md md:col-span-2 h-24"/>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Image URL (e.g., /images/knafeh.jpg)" className="p-3 border rounded-md md:col-span-2"/>
          <div className="md:col-span-2 flex justify-end space-x-4">
            {isEditing && <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">Cancel</button>}
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">{isEditing ? 'Update Dish' : 'Add Dish'}</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Current Menu</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold text-gray-600">ID</th>
                <th className="p-3 font-semibold text-gray-600">Name</th>
                <th className="p-3 font-semibold text-gray-600">Price</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map(dish => (
                <tr key={dish.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{dish.id}</td>
                  <td className="p-3 font-medium text-gray-800">{dish.name}</td>
                  <td className="p-3 text-gray-600">${dish.price.toFixed(2)}</td>
                  <td className="p-3 text-right space-x-4">
                    <button onClick={() => handleEdit(dish)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(dish.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}