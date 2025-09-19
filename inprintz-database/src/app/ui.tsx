export const inputBase =
  "rounded-md border border-slate-700 px-3 py-2 text-sm w-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50";

export const titleBase =
  "text-slate-800";

interface DetailItemProps {
  label: string;
  value?: string | null;
}
export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <dd className="text-sm font-semibold text-slate-800 truncate">{value}</dd>
    </div>
  );
}

export function OrderStatus({label, value}: DetailItemProps){
  return(
     <p className="mt-2 text-sm text-slate-500">{label}: <span className="font-medium text-slate-700">{value}</span></p>
  );
}

export const financialStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  INVOICED: "bg-blue-50 text-blue-700 ring-blue-200",
  PAID: "bg-green-50 text-green-700 ring-green-200",
  REFUNDED: "bg-red-50 text-red-700 ring-red-200",
};

export const orderStatusStyles: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700 ring-slate-300",
  PROOF_AWAITING_APPROVAL: "bg-amber-50 text-amber-700 ring-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 ring-blue-200",
  READY: "bg-violet-50 text-violet-700 ring-violet-200",
  COMPLETED: "bg-green-50 text-green-700 ring-green-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};
