import { createOrder } from '@/actions/actions';
import Form from 'next/form';
import { SubmitButton } from '@/app/animations';
import { inputBase, titleBase } from "@/app/ui";

export default function OrderFormPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-white flex items-center justify-center py-12 px-4">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-sm p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-6">
          <span className={titleBase}>
            Create Order
          </span>
        </h1>

        <Form action={createOrder} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="job_name" placeholder="Job Name" className={inputBase} />
            <input type="text" name="client" placeholder="Client" className={inputBase} />
            <input type="text" name="contact" placeholder="Contact" className={inputBase} />
            <input type="text" name="po_number" placeholder="PO Number" className={inputBase} />
            <input type="text" name="sales_rep" placeholder="Sales Rep" className={inputBase} />
            <input type="text" name="account" placeholder="Account" className={inputBase} />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="proofingIsRequired" className="h-4 w-4 text-slate-600 rounded border-slate-300 focus:ring-slate-400" />
            Proofing Required?
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="datetime-local" name="proofDueDate" placeholder="Proof Due Date" className={inputBase} />
            <select name="proof_type" className={`${inputBase} bg-white text-slate-800`}>
              <option value="PDF">PDF</option>
              <option value="HARD_COPY">HARD COPY</option>
            </select>
          </div>

          <input type="text" name="color_match_info" placeholder="Color Match Info" className={inputBase} />

          <textarea name="notes" placeholder="Notes" className={`${inputBase}`}></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="datetime-local" name="shippingDueDate" placeholder="Shipping Due Date" className={inputBase} />
            <input type="text" name="shipMethod" placeholder="Shipping Method" className={inputBase} />
          </div>

          <textarea name="shipTo" placeholder="Ship To" className={`${inputBase}`}></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="filesource" className={`${inputBase} bg-white`}>
              <option value="INPRINTZ_FTP">Inprintz FTP</option>
              <option value="CLIENT_FTP">Client FTP</option>
              <option value="EMAIL">Email</option>
              <option value="NEW_JOBS_FOLDER">New Jobs Folder</option>
              <option value="VUTEK">Vutek</option>
              <option value="HP">HP</option>
              <option value="OTHER">Other</option>
            </select>
            <input type="text" name="fileFolderName" placeholder="File Folder Name" className={inputBase} />
          </div>

          <textarea name="filesourcedescription" placeholder="File Source Description" className={`${inputBase}`}></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="hardware" placeholder="Hardware" className={inputBase} />
            <input type="text" name="installation" placeholder="Installation" className={inputBase} />
          </div>

          <textarea name="additional_info_notes" placeholder="Additional Info Notes" className={`${inputBase}`}></textarea>

          <div className="flex justify-end pt-6">
            <SubmitButton
              label="Create Order"
              pendingLabel="Creating…"
              className="bg-blue-600 ring-blue-600/10 hover:bg-blue-700 focus-visible:ring-blue-400/40"
            />
          </div>
        </Form>
      </section>
    </main>
  );
}