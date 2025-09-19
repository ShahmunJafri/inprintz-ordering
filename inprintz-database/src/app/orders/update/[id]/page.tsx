"use server";
import prisma from "../../../../lib/db";
import { updateOrder } from "@/actions/actions";
import Link from "next/link";
import { SubmitButton } from '@/app/animations';
import { inputBase, OrderStatus, titleBase } from "@/app/ui";
import { deleteAttachment, addAttachmentsToOrder } from "@/actions/attachments";
import UpdateFilesForm from "./UpdateFilesForm";


export default async function UpdateForm({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>;          
  searchParams: Promise<{ stale?: string }>;
}) {
  const [{id}, sp] = await Promise.all([params, searchParams]);
  const showStale = sp?.stale === '1';

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

  const orderStatus = [
    "NOT_STARTED",
    "PROOF_AWAITING_APPROVAL",
    "IN_PROGRESS",
    "READY",
    "COMPLETED",
    "CANCELLED"
  ] as const;

  const financialStatus = [
    "PENDING",
    "INVOICED",
    "PAID",
    "REFUNDED"
  ]

  const order = await prisma.order.findUnique({
    where: { id },
    include: { attachments: true },
  });

  const toLocal = (value?: string | Date | null) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-white flex items-center justify-center py-12 px-4">
      {showStale && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-center text-amber-800 shadow">
                This order was updated recently.{" "}
              <a
                href={`/orders/update/${id}`}
                className="underline font-medium text-amber-900 hover:text-amber-700"
              >
                Click here
              </a>{" "}
            to see the latest changes.
            </div>
        </div>
      )}
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-sm p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-6">
          <span className={titleBase}>
            Update Order
          </span>
        </h1>

        <form action={updateOrder} className="space-y-6">
          <input type="hidden" name="id" value={order?.id} />
          <input type="hidden" name="updatedAt" value={order?.updatedAt.toISOString()}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
              name="orderStatus"
              defaultValue={order?.orderStatus as any}
              className={inputBase}
            >
              {orderStatus.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>

            <select
              name="financialStatus"
              defaultValue={order?.financialStatus as any}
              className={`${inputBase} bg-white`}
            >
              {financialStatus.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
        </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="job_name" placeholder="Job Name" defaultValue={order?.job_name || ""} className={inputBase} />
            <input type="text" name="client" placeholder="Client" defaultValue={order?.client || ""} className={inputBase} />
            <input type="text" name="contact" placeholder="Contact" defaultValue={order?.contact || ""} className={inputBase} />
            <input type="text" name="po_number" placeholder="PO Number" defaultValue={order?.po_number || ""} className={inputBase} />
            <input type="text" name="sales_rep" placeholder="Sales Rep" defaultValue={order?.sales_rep || ""} className={inputBase} />
            <input type="text" name="account" placeholder="Account" defaultValue={order?.account || ""} className={inputBase} />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="proofingIsRequired" defaultChecked={order?.proofingIsRequired || false} className="h-4 w-4 text-slate-600 rounded border-slate-300 focus:ring-slate-400" />
            Proofing Required?
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="datetime-local" name="proofDueDate" placeholder="Proof Due Date" defaultValue={toLocal(order?.proofDueDate as any)} className={inputBase} />
            <select name="proof_type" defaultValue={order?.proofType as any} className={`${inputBase} bg-white`}>
              {proofTypes.map((type) => (
                <option key={type} value={type}>{type.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <input type="text" name="color_match_info" placeholder="Color Match Info" defaultValue={order?.color_match_info || ""} className={inputBase} />

          <textarea name="notes" placeholder="Proofing Notes" defaultValue={order?.notes || ""} className={`${inputBase} min-h-[80px]`}></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="datetime-local" name="shippingDueDate" placeholder="Shipping Due Date" defaultValue={toLocal(order?.shippingDueDate as any)} className={inputBase} />
            <input type="text" name="shipMethod" placeholder="Shipping Method" defaultValue={order?.shipMethod || ""} className={inputBase} />
          </div>

          <textarea name="shipTo" placeholder="Ship To" defaultValue={order?.shipTo || ""} className={`${inputBase} min-h-[80px]`}></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="filesource" defaultValue={order?.filesource as any} className={`${inputBase} bg-white`}>
              {fileSources.map((source) => (
                <option key={source} value={source}>{source.replace("_", " ")}</option>
              ))}
            </select>
            <input type="text" name="fileFolderName" placeholder="File Folder Name" defaultValue={order?.fileFolderName || ""} className={inputBase} />
          </div>

          <textarea name="filesourcedescription" placeholder="File Source Description" defaultValue={order?.filesourcedescription || ""} className={`${inputBase} min-h-[80px]`}></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="hardware" placeholder="Hardware" defaultValue={order?.hardware || ""} className={inputBase} />
            <input type="text" name="installation" placeholder="Installation" defaultValue={order?.installation || ""} className={inputBase} />
          </div>

          <textarea name="additional_info_notes" placeholder="Additional Info Notes" defaultValue={order?.additional_info_notes || ""} className={`${inputBase} min-h-[100px]`}></textarea>

          <textarea name="production_notes" placeholder="Production Notes" defaultValue={order?.production_notes || ""} className={`${inputBase} min-h-[100px]`}></textarea>
          
          <div className="flex justify-between pt-6">
            <SubmitButton
              label="Update Order"
              pendingLabel="Updating…"
              className="bg-emerald-600 ring-emerald-600/10 hover:bg-emerald-700 focus-visible:ring-emerald-400/40"
            />
            <Link
              href={`/orders/${id}/${order?.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40"
            >
              ← Back to Order
            </Link>
          </div>
        </form>
                
          {order?.attachments?.length ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800">Files</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {order.attachments.map((a) => {
                  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(a.fileName);
                  const isPdf = /\.pdf$/i.test(a.fileName);
                  return (
                    <li key={a.id} className="rounded-xl border p-3 bg-slate-50">
                      <div className="text-xs text-slate-600 mb-2 truncate">{a.fileName}</div>

                      {isImage && (
                        <a href={a.url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={a.url}
                            alt={a.fileName}
                            className="max-h-40 w-auto rounded-lg object-contain bg-white"
                          />
                        </a>
                      )}

                      {isPdf && (
                        <div className="text-xs">
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Preview PDF
                          </a>
                        </div>
                      )}

                      {!isImage && !isPdf && (
                        <div className="text-xs">
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Download
                          </a>
                        </div>
                      )}

                      <div className="mt-3">
                        <form action={deleteAttachment}>
                          <input type="hidden" name="attachmentId" value={a.id} />
                          <button
                            type="submit"
                            className="text-xs rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-6 text-sm text-slate-500">No files attached yet.</div>
          )}

          {order?.id && <UpdateFilesForm orderId={order.id} />}

      </section>
    </main>
  );
}
