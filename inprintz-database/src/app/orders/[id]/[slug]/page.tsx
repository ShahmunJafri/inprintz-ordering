"use server";
import prisma from "../../../../lib/db";
import { deleteOrder, recoverOrder } from "@/actions/actions";

import Link from 'next/link';
import { SubmitButton } from "@/app/animations";
import { titleBase, DetailItem, OrderStatus } from "@/app/ui";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: id as any },
    include: { attachments: true },
  });

  const title = order?.job_name || `Order #${order?.id || id}`;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-white">
      <section className="mx-auto max-w-3xl px-4 pt-20 pb-16">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className={titleBase}>
              {title}
            </span>
          </h1>
          <OrderStatus label="Job Number" value={order?.job_number.toString() ?? id}/>
          <OrderStatus label="Created At" value={order?.created_at.toString() ?? id}/>
          <OrderStatus label="Last Updated" value={order?.updatedAt.toString() ?? id}/>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className={titleBase}>Basic Info</div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem label="Client" value={order?.client}/>
            <DetailItem label="Contact" value={order?.contact}/>
            <DetailItem label="PO Number" value={order?.po_number}/>
            <DetailItem label="Sales Rep" value={order?.sales_rep}/>
          </dl>

          <div className={titleBase}>Proofing</div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem label="Proof Required" value={order?.proofingIsRequired.toString()}/>
            <DetailItem label="PDF or Hard Proof" value={order?.proofType}/>
            <DetailItem label="Proof Due" value={order?.proofDueDate?.toString()}/>
            <DetailItem label="Color Match Info" value={order?.color_match_info}/>
          </dl>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Proofing Notes</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3 max-h-* overflow-y-auto">{order?.notes}</p>
          </div>
          <div className={titleBase}>Shipping Info</div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem label="Delivery Due Date" value={order?.shippingDueDate?.toString()}/>
            <DetailItem label="Ships To" value={order?.shipTo}/>
            <DetailItem label="Ship Method" value={order?.shipMethod}/>
            <DetailItem label="Account" value={order?.account}/>
          </dl>

          <div className={titleBase}>File Names and & Location</div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem label="File Source" value={order?.filesource}/>
            <DetailItem label="File/Folder Name" value={order?.fileFolderName}/>
          </dl>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <h2 className="text-sm font-semibold text-slate-800">File & Folder Description</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3 max-h-* overflow-y-auto">{order?.filesourcedescription}</p>
          </div>


          <div className={titleBase}>Outsourced Materials</div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem label="Hardware" value={order?.hardware}/>
            <DetailItem label="Installation" value={order?.installation}/>
          </dl>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Additional Info Notes</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3 max-h-* overflow-y-auto"> {order?.additional_info_notes}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Production Notes</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3 max-h-* overflow-y-auto"> {order?.production_notes}</p>
          </div>

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
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          Preview PDF
                        </a>
                      </div>
                    )}

                    {!isImage && !isPdf && (
                      <div className="text-xs">
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          Download
                        </a>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="mt-6 text-sm text-slate-500">No files attached yet.</div>
        )}
   
                 <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex flex-wrap gap-3">
    {/* If SOFT-DELETED → show Recover */}
    {order?.deleted ? (
      <form action={recoverOrder}>
        <input type="hidden" name="id" value={order?.id} />
        <SubmitButton
          label="Recover Order"
          pendingLabel="Recovering…"
          className="bg-emerald-600 ring-emerald-600/10 hover:bg-emerald-700 focus-visible:ring-emerald-400/40"
        />
      </form>
    ) : (
      /* If NOT deleted → normal soft-delete */
      <form action={deleteOrder}>
        <input type="hidden" name="id" value={order?.id} />
        <SubmitButton
          label="Delete Order"
          pendingLabel="Deleting…"
          className="bg-red-600 ring-red-600/10 hover:bg-red-700 focus-visible:ring-red-400/40"
        />
      </form>
    )}

    {/* When already soft-deleted, keep a "Delete Permanently" (hard delete) too if you want */}
    {order?.deleted && (
      <form action={deleteOrder}>
        <input type="hidden" name="id" value={order?.id} />
        <SubmitButton
          label="Delete Permanently"
          pendingLabel="Deleting…"
          className="bg-red-600 ring-red-600/10 hover:bg-red-700 focus-visible:ring-red-400/40"
        />
      </form>
    )}

    {/* Update form is always available */}
    <form action={`/orders/update/${order?.id}`}>
      <SubmitButton
        label="Update Form"
        pendingLabel="Loading..."
        className="bg-blue-600 ring-blue-600/10 hover:bg-blue-700 focus-visible:ring-blue-400/40"
      />
    </form>
  </div>

  <Link
    href="/"
    className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40"
  >
    ← Back to Orders
  </Link>
</div>

                </div>
              </section>
            </main>
          );
        }
