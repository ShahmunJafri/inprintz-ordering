"use server";
import prisma from "../../../../lib/db";
import { updateOrder } from "@/actions/actions"
import Form from 'next/form'

export default async function updateForm({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;

  const proofTypes = ["PDF", "HARD_COPY"] as const;
  const fileSources = [
    "INPRINTZ_FTP",
    "CLIENT_FTP",
    "EMAIL",
    "NEW_JOBS_FOLDER",
    "VUTEK",
    "HP",
    "OTHER",
  ] as const;
  
  const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    }
  );
  
    return (
      <Form action={updateOrder}>
        <input type="hidden" name="id" value={order?.id} />

        <input type="text" name="job_name" placeholder="Job Name" defaultValue={order?.job_name || ""} />
        <input type="text" name="client" placeholder="Client" defaultValue={order?.client || ""} />
        <input type="text" name="contact" placeholder="Contact" defaultValue={order?.contact || ""} />
        <input type="text" name="po_number" placeholder="PO Number" defaultValue={order?.po_number || ""} />
        <input type="text" name="sales_rep" placeholder="Sales Rep" defaultValue={order?.sales_rep || ""} />

        <label>
          <input
            type="checkbox"
            name="proofingIsRequired"
            defaultChecked={order?.proofingIsRequired || false}
          />
          Proofing Required?
        </label>

        <input
          type="datetime-local"
          name="proofDueDate"
          placeholder="Proof Due Date"
          defaultValue={order?.proofDueDate ? new Date(order?.proofDueDate).toISOString().slice(0, 16) : ""}
        />

        <textarea name="notes" placeholder="Notes" defaultValue={order?.notes || ""}></textarea>

        <select name="proof_type" defaultValue={order?.proofType}>
          {proofTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="color_match_info"
          placeholder="Color Match Info"
          defaultValue={order?.color_match_info || ""}
        />

        <input
          type="datetime-local"
          name="shippingDueDate"
          placeholder="Shipping Due Date"
          defaultValue={order?.shippingDueDate ? new Date(order?.shippingDueDate).toISOString().slice(0, 16) : ""}
        />

        <input type="text" name="shipTo" placeholder="Ship To" defaultValue={order?.shipTo || ""} />
        <input type="text" name="shipMethod" placeholder="Shipping Method" defaultValue={order?.shipMethod || ""} />
        <input type="text" name="account" placeholder="Account" defaultValue={order?.account || ""} />

        <select name="filesource" defaultValue={order?.filesource}>
          {fileSources.map((source) => (
            <option key={source} value={source}>
              {source.replace("_", " ")}
            </option>
          ))}
        </select>

        <textarea
          name="filesourcedescription"
          placeholder="File Source Description"
          defaultValue={order?.filesourcedescription || ""}
        ></textarea>

        <input type="text" name="fileFolderName" placeholder="File Folder Name" defaultValue={order?.fileFolderName || ""} />
        <input type="text" name="hardware" placeholder="Hardware" defaultValue={order?.hardware || ""} />
        <input type="text" name="installation" placeholder="Installation" defaultValue={order?.installation || ""} />

        <textarea
          name="additional_info_notes"
          placeholder="Additional Info Notes"
          defaultValue={order?.additional_info_notes || ""}
        ></textarea>

        <button type="submit">Update Order</button>
      </Form>
  );

}