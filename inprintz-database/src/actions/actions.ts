"use server";
import { ProofType } from "@/generated/prisma";
import prisma from "../lib/db";
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData){

    await prisma.order.create({
        data: {
            job_name: formData.get("job_name") as string || "unnamed",
            slug: (formData.get("job_name") as string)
                .replace(/\s+/g, "-")
                .toLowerCase() || "unnamed",
            client: formData.get("client") as string || "null",
            contact: formData.get("contact") as string || "null",
            po_number: formData.get("po_number") as string || "null",
            sales_rep: formData.get("sales_rep") as string || "null",

            proofingIsRequired: formData.get("proofingIsRequired") === "on",
            proofDueDate: typeof formData.get("proofDueDate") === "string" && formData.get("proofDueDate")
                        ? new Date(formData.get("proofDueDate") as string) : null,
            notes: formData.get("notes") as string || "null",
            proofType: proofType, ///error here
            color_match_info: formData.get("color_match_info") as string || "null",

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
            client: formData.get("client") as string
        }
    });

    redirect('/')
}
