"use server";
import prisma from "../../../../lib/db";
import { deleteOrder } from "@/actions/actions";
import Form from 'next/form';
import Link from 'next/link';
import { SubmitButton } from "@/app/animations";
import { titleBase, DetailItem, OrderStatus } from "@/app/ui";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: id as any },
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
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem label="Client" value={order?.client}/>
            <DetailItem label="Contact" value={order?.contact}/>
            <DetailItem label="PO Number" value={order?.po_number}/>
            <DetailItem label="Sales Rep" value={order?.sales_rep}/>
          </dl>

          {
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Notes</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3">{order?.notes}</p>
            </div>
          }
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Form action={deleteOrder}>
                <input type="hidden" name="id" value={order?.id} />
                <SubmitButton
                  label="Delete Order"
                  pendingLabel="Deleting…"
                  className="bg-red-600 ring-red-600/10 hover:bg-red-700 focus-visible:ring-red-400/40"
                />
              </Form>

              <Form action={`/orders/update/${order?.id}`}>
                <SubmitButton
                  label="Update Form"
                  pendingLabel="Loading..."
                  className="bg-emerald-600 ring-emerald-600/10 hover:bg-emerald-700 focus-visible:ring-emerald-400/40"
                />
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
