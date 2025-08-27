import prisma from "@/lib/db";
import Link from 'next/link';
import { titleBase } from "./ui";


export default async function Home() {
  const orders = await prisma.order.findMany({
    orderBy: {
      job_number: "desc",
    },
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-white">
      <section className="mx-auto max-w-3xl px-4 pt-24 pb-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className={titleBase}>
              All Orders
            </span>
          </h1>
          <p className="text-sm text-slate-500">Currently tracking <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">{orders.length}</span> order{orders.length === 1 ? '' : 's'}.</p>

          <div className="mt-2">
            <Link
              href="/orders/form"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-900/10 transition-all hover:shadow-md hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/50"
            >
              <span>New Order Form</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center shadow-sm">
            <div className="text-4xl">🗂️</div>
            <h2 className="mt-3 text-lg font-semibold text-slate-800">No orders found</h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Get started by creating your first order. You can always edit it later.
            </p>
            <Link
              href="/orders/form"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-900/10 transition-all hover:shadow-md hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/50"
            >
              Open Form <span aria-hidden>↗</span>
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-[1px]"
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={`/orders/${order.id}/${order.slug}`}
                    className="flex-1 text-left text-base font-semibold text-slate-800 underline-offset-4 transition-colors hover:text-slate-900 hover:underline focus:outline-none"
                  >
                    {`Job Number: ${order.job_number}`}
                  </Link>

                  <Link
                    href={`/orders/${order.id}/${order.slug}`}
                    className="hidden shrink-0 select-none items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40 md:inline-flex"
                    aria-label="View order details"
                  >
                    View <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>

                {/* Subtext row */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  {order.job_name && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                      {order.job_name}
                    </span>
                  )}
                  {typeof order.orderStatus === 'string' && order.orderStatus && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      {order.orderStatus}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
