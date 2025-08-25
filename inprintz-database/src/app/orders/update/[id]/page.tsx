"use server";
import prisma from "../../../../lib/db";
import { updateOrder } from "@/actions/actions"
import Form from 'next/form'

export default async function updateForm({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;
  const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    }
  );
  
  return (
    <Form action={updateOrder}>
      <input type="hidden" name="id" value={order?.id} />
      <input
        type="text"
        name="job name" 
        placeholder="Job Name"
        defaultValue={order?.job_name || ""}
      />
      <button
        type="submit"
      >
        Update Order
      </button>
    </Form>
  )
}