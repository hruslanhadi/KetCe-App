'use client';

import React, { useEffect, useState } from 'react';
import { orderAPI, productAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  group_id: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  product?: Product;
}

export default function NewOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      delivery_address: '',
      notes: '',
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll();
        setProducts(res.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const addItem = (productId: string) => {
    if (!orderItems.find((item) => item.product_id === productId)) {
      setOrderItems([...orderItems, { product_id: productId, quantity: 1 }]);
    }
  };

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
    } else {
      setOrderItems(
        orderItems.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
      );
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const onSubmit = async (data: any) => {
    if (orderItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      const response = await orderAPI.create({
        ...data,
        items: orderItems,
        source: 'web',
      });

      toast.success(`Order created: ${response.data.id.substring(0, 8)}`);
      reset();
      setOrderItems([]);

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">New Order</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
                  <input
                    type="text"
                    {...register('customer_name', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    {...register('customer_phone', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea
                  {...register('delivery_address')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Create Order
              </button>
            </form>
          </div>

          {/* Products & Summary */}
          <div>
            {/* Products */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addItem(product.id)}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm border border-gray-200"
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-500">₹{product.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orderItems.map((item) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <div key={item.product_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{product?.name}</div>
                        <div className="text-xs text-gray-500">₹{product?.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                          className="w-12 px-2 py-1 border rounded text-sm text-center"
                        />
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              {orderItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
