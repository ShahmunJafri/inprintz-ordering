"use client";
import { Fragment, useState } from "react";

type Row = {
  fileName?: string;
  size?: string;
  doubleSingle?: "DOUBLE" | "SINGLE" | "NULL" | "";
  substrate?: string;
  finishing?: string;
  originals?: string;
  quantity?: number | "";
};

export default function ProductionNotesTable({
  inputBase,
}: {
  inputBase: string;
}) {
  const [rows, setRows] = useState<Row[]>([
    {
      fileName: "",
      size: "",
      doubleSingle: "",
      substrate: "",
      finishing: "",
      originals: "",
      quantity: "",
    },
  ]);

  const addRow = () =>
    setRows((r) => [
      ...r,
      {
        fileName: "",
        size: "",
        doubleSingle: "",
        substrate: "",
        finishing: "",
        originals: "",
        quantity: "",
      },
    ]);
  const removeRow = (idx: number) =>
    setRows((r) => (r.length > 1 ? r.filter((_, i) => i !== idx) : r));

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Production Notes</h2>
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Add Row
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-500">
        <table className="min-w-full text-sm">
          <tbody>
            {rows.map((row, idx) => (
                <Fragment key={`pn-row-${idx}`}>
                <tr key={`${idx}-row1`} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      name="pn_fileName"
                      placeholder="File Name"
                      className={inputBase}
                      defaultValue={row.fileName}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name="pn_size"
                      placeholder="Size"
                      className={inputBase}
                      defaultValue={row.size}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      name="pn_doubleSingle"
                      className={`${inputBase} bg-white`}
                      defaultValue={row.doubleSingle ?? ""}
                    >
                      <option value="DOUBLE">DOUBLE</option>
                      <option value="SINGLE">SINGLE</option>
                      <option value="NULL">NULL</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name="pn_quantity"
                      placeholder="Quantity"
                      type="number"
                      min={0}
                      className={inputBase}
                      defaultValue={row.quantity}
                    />
                  </td>
                  <td className="px-3 py-2 text-right align-top" rowSpan={2}>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="rounded-lg border border-slate-500 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>

                <tr key={`${idx}-row2`} className="border-b bg-slate-50/30">
                  <td className="px-3 py-2" colSpan={2}>
                    <input
                      name="pn_substrate"
                      placeholder="Substrate"
                      className={inputBase}
                      defaultValue={row.substrate}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name="pn_finishing"
                      placeholder="Finishing"
                      className={inputBase}
                      defaultValue={row.finishing}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name="pn_originals"
                      placeholder="Originals"
                      className={inputBase}
                      defaultValue={row.originals}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Add as many rows as you need. These will save with the order.
      </p>
    </div>
  );
}
