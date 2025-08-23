import Image from "next/image";
import prisma from "@/lib/db"
import Link from 'next/link';

export default async function Home() {
  const orders = await prisma.order.findMany();
    return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">All Orders ({orders.length})</h1>
      <Link href="/orders/form">Form</Link>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="border-t border-b border-black/10 py-5 w-full max-w-2xl">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-100 last:border-b-0">
              <Link 
                href={`/orders/${order.id}/${order.slug}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex-1 text-left"
              >
                {order.job_number || `Order #${order.id}`}
              </Link>
              
              {/* Optional: Add some order details */}
              <div className="text-sm text-gray-500 ml-4">
                {order.job_name}
                {/* Add other order info you want to display */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

