"use server";
import prisma from "../../../../lib/db";
import { deleteOrder } from "@/actions/actions";
import Form from 'next/form'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orders = await prisma.order.findUnique({
        where: {
            id: id,  
        },
    }
  );
  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
        <h1 className="text-3xl font-semibold">{orders?.job_name}</h1>
        <p>{orders?.id}</p>
         <Form action={deleteOrder}>
          <input type="hidden" name="id" value={orders?.id} />
          <button type="submit" className="bg-red-500 py-2 text-white rounded-sm">
            Delete Order
          </button>
        </Form>
          
        <Form action={`/orders/update/${orders?.id}`}>
          <button type="submit" className="bg-green-500 py-2 text-white rounded-sm">
            Update Order
          </button>
        </Form>
    </main>
    
  );
}
