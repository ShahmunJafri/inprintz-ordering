"use server";
import prisma from "../lib/db";
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData){
    await prisma.order.create({
        data: {
            job_name: formData.get("job name") as string || "unnamed",
            slug: (formData.get("job name") as string)
                .replace(/\s+/g, "-")
                .toLowerCase() || "unnamed",
            client: formData.get("job name") as string || "unnamed",
            contact: formData.get("job name") as string || "unnamed",
            color_match_info: formData.get("job name") as string || "unnamed",
        }
    });
    redirect('/');
}

export async function deleteOrder(formData: FormData){
    const id = formData.get('id') as string;
    await prisma.order.delete({
        where: {
            id: id
        }
    });
    redirect('/');
}

export async function updateOrder(formData: FormData){
    const id = formData.get('id') as string;
    await prisma.order.update({
        where: { 
            id: id 
        },
        data: { 
            job_name: formData.get("job name") as string,
        }
    });

    redirect('/')
}
