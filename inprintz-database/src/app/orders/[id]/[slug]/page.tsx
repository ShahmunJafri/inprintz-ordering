"use server";
import prisma from "../../../../lib/db";
import { deleteOrder } from "@/actions/actions";
import Form from 'next/form';
import Link from 'next/link';
import { titleBase } from "@/app/ui";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: id as any },
  });

  const title = order?.job_name || `Order #${order?.id || id}`;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-white">
      <section className="mx-auto max-w-3xl px-4 pt-20 pb-16">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className={titleBase}>
              {title}
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">ID: <span className="font-medium text-slate-700">{order?.id ?? id}</span></p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Meta */}
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {order?.client && (
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <dt className="text-xs font-medium text-slate-500">Client</dt>
                <dd className="text-sm font-semibold text-slate-800 truncate">{order.client}</dd>
              </div>
            )}
            {order?.sales_rep && (
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <dt className="text-xs font-medium text-slate-500">Sales Rep</dt>
                <dd className="text-sm font-semibold text-slate-800 truncate">{order.sales_rep}</dd>
              </div>
            )}
            {order?.shipMethod && (
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <dt className="text-xs font-medium text-slate-500">Ship Method</dt>
                <dd className="text-sm font-semibold text-slate-800 truncate">{order.shipMethod}</dd>
              </div>
            )}
            {order?.fileFolderName && (
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <dt className="text-xs font-medium text-slate-500">Folder</dt>
                <dd className="text-sm font-semibold text-slate-800 truncate">{order.fileFolderName}</dd>
              </div>
            )}
          </dl>

          {order?.notes && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Notes</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Form action={deleteOrder}>
                <input type="hidden" name="id" value={order?.id} />
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-red-600/10 transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400/40">
                  Delete Order
                </button>
              </Form>

              <Form action={`/orders/update/${order?.id}`}>
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-600/10 transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40">
                  Update Order
                </button>
              </Form>
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
