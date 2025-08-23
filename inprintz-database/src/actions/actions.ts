"use server";
import prisma from "../lib/db";
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData){
    await prisma.order.create({
        data: {
            job_name: formData.get("job name") as string,
            slug: (formData.get("job name") as string)
                .replace(/\s+/g, "-")
                .toLowerCase(),
            client: formData.get("job name") as string,
            contact: formData.get("job name") as string,
            color_match_info: formData.get("job name") as string,
        }
    });
    redirect('/');
}

