"use server";
import { ProofType, FileSource, OrderStatus, FinancialStatus } from "@/generated/prisma";
import prisma from "../lib/db";
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData){

    await prisma.order.create({
        data: {
            job_name: formData.get("job_name") as string || "Unnamed_Order",
            slug: (formData.get("job_name") as string)
                .replace(/\s+/g, "-")
                .toLowerCase() || "Unnamed_Order",
            client: formData.get("client") as string || "",
            contact: formData.get("contact") as string || "",
            po_number: formData.get("po_number") as string || "",
            sales_rep: formData.get("sales_rep") as string || "",

            orderStatus: formData.get("orderStatus") as OrderStatus || "NOT_STARTED" as OrderStatus,
            financialStatus: formData.get("financialStatus") as FinancialStatus || "PENDING" as FinancialStatus,

            proofingIsRequired: formData.get("proofingIsRequired") === "on",
            proofDueDate: typeof formData.get("proofDueDate") === "string" && formData.get("proofDueDate")
                        ? new Date(formData.get("proofDueDate") as string) : null,
            notes: formData.get("notes") as string || "",
            proofType: formData.get("proof_type") as ProofType, 
            color_match_info: formData.get("color_match_info") as string || "",

            shippingDueDate: formData.get("shippingDueDate") === "string" && formData.get("shippingDueDate")
                        ? new Date(formData.get("shippingDueDate") as string) : null,
            shipTo: formData.get("shipTo") as string || "Pick Up",
            shipMethod: formData.get("shipMethod") as string || "",
            account: formData.get("account") as string || "",
            
            filesource: formData.get("filesource") as FileSource,
            filesourcedescription: formData.get("filesourcedescription") as string || "",
            fileFolderName: formData.get("fileFolderName") as string || "",

            hardware: formData.get("hardware") as string || "",
            installation: formData.get("installation") as string || "",

            additional_info_notes: formData.get("additional_info_notes") as string || ""
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
    const lastSeen = new Date(formData.get("updatedAt") as string);

    try {
        await prisma.order.update({
            where: { 
                id_updatedAt: {
                    id: id,
                    updatedAt: lastSeen
                },
            },
            data: { 
                job_name: formData.get("job_name") as string,
                slug: (formData.get("job_name") as string)
                    .replace(/\s+/g, "-")
                    .toLowerCase() || "Unnamed_Order",
                client: formData.get("client") as string,
                contact: formData.get("contact") as string || "",
                po_number: formData.get("po_number") as string || "",
                sales_rep: formData.get("sales_rep") as string || "",
                
                orderStatus: formData.get("orderStatus") as OrderStatus || "NOT_STARTED" as OrderStatus,
                financialStatus: formData.get("financialStatus") as FinancialStatus || "PENDING" as FinancialStatus,

                proofingIsRequired: formData.get("proofingIsRequired") === "on",
                proofDueDate: typeof formData.get("proofDueDate") === "string" && formData.get("proofDueDate")
                            ? new Date(formData.get("proofDueDate") as string) : null,
                notes: formData.get("notes") as string || "",
                proofType: formData.get("proof_type") as ProofType, 
                color_match_info: formData.get("color_match_info") as string || "",

                shippingDueDate: formData.get("shippingDueDate") === "string" && formData.get("shippingDueDate")
                            ? new Date(formData.get("shippingDueDate") as string) : null,
                shipTo: formData.get("shipTo") as string || "Pick Up",
                shipMethod: formData.get("shipMethod") as string || "",
                account: formData.get("account") as string || "",
                
                filesource: formData.get("filesource") as FileSource,
                filesourcedescription: formData.get("filesourcedescription") as string || "",
                fileFolderName: formData.get("fileFolderName") as string || "",

                hardware: formData.get("hardware") as string || "",
                installation: formData.get("installation") as string || "",

                additional_info_notes: formData.get("additional_info_notes") as string || ""
            }
        });
        redirect('/')
    } catch (err: any) {
    if (err?.code === "P2025") {
      redirect(`/orders/update/${id}?stale=1`);
    }
    throw err;                                  
  }
}

