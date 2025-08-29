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
