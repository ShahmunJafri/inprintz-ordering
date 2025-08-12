'use server';
import prisma from './lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    
    const order = await prisma.order.create({
      data: { 
        job_name: formData.get('job_name') as string
      }
    });
    
    revalidatePath('/users');
    return order;
  } catch (error) {
    console.error("Prisma error:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

export async function getOrder() {
  return await prisma.order.findMany();
}

export async function updateOrder(id: string) {
  return await prisma.order.update({
    where: { id },
    data: { id }
  });
}

export async function deleteOrder(id: string) {
  try {
    // First delete all 1:1 related records
    await prisma.$transaction([
      // These use orderId as the foreign key
      prisma.basicInfo.deleteMany({ where: { orderId: id } }),
      prisma.proofing.deleteMany({ where: { orderId: id } }),
      prisma.shippingInfo.deleteMany({ where: { orderId: id } }),
      prisma.files.deleteMany({ where: { orderId: id } }),
      prisma.additionalInfo.deleteMany({ where: { orderId: id } }),
      prisma.outsourceMaterials.deleteMany({ where: { orderId: id } }),
      
      // Then delete the order itself
      prisma.order.delete({ where: { id } })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Deletion failed:', error);
    throw new Error(`Failed to delete order: ${error.message}`);
  }
}