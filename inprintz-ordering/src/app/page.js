'use client';
import Image from "next/image";
import prisma from './lib/prisma';
import Link from 'next/link';

import { createOrder, getOrder, updateOrder, deleteOrder } from './actions';

export default async function OrderManager() {
  const orders = await prisma.order.findMany({
    include: {
      basic_info: true,
      proofing: true,
      shipping_info: true
    },
    orderBy: { job_number: 'desc' }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      {/* Create Order Button */}
      <Link 
        href="/orders/new"
        className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create New Order
      </Link>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  #{order.job_number} - {order.job_name}
                </h2>
                <p className="text-gray-600">{order.basic_info?.client}</p>
                <p className="text-sm text-gray-500">
                  Status: {order.proofing?.status || 'Not started'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
                >
                  View
                </Link>

                <Link
                  href={`/orders/${order.id}/edit`}
                  className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-500"
                >
                  Edit
                </Link>

                <form action={deleteOrder}>
                  <input type="hidden" name="id" value={order.id} />
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                  >
                  Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}