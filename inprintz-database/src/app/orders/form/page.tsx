import { createOrder } from '@/actions/actions'
import Form from 'next/form'

export default function form() {

  return (
    <Form action={createOrder}>
      <input type="text" name="job_name" placeholder="Job Name" />
      <input type="text" name="client" placeholder="Client" />
      <input type="text" name="contact" placeholder="Contact" />
      <input type="text" name="po_number" placeholder="PO Number" />
      <input type="text" name="sales_rep" placeholder="Sales Rep" />

      <label>
        <input type="checkbox" name="proofingIsRequired" />
        Proofing Required?
      </label>
      <input type="datetime-local" name="proofDueDate" placeholder="Proof Due Date" />
      <textarea name="notes" placeholder="Notes"></textarea>
      <select name="proof_type">
        <option value="PDF">PDF</option>
        <option value="HARD_COPY">HARD COPY</option>
      </select>
      <input type="text" name="color_match_info" placeholder="Color Match Info" />

      <input type="datetime-local" name="shippingDueDate" placeholder="Shipping Due Date" />
      <input type="text" name="shipTo" placeholder="Ship To" />
      <input type="text" name="shipMethod" placeholder="Shipping Method" />
      <input type="text" name="account" placeholder="Account" />

      <select name="filesource">
        <option value="INPRINTZ_FTP">Inprintz FTP</option>
        <option value="CLIENT_FTP">Client FTP</option>
        <option value="EMAIL">Email</option>
        <option value="NEW_JOBS_FOLDER">New Jobs Folder</option>
        <option value="VUTEK">Vutek</option>
        <option value="HP">HP</option>
        <option value="OTHER">Other</option>
      </select>
      <textarea name="filesourcedescription" placeholder="File Source Description"></textarea>
      <input type="text" name="fileFolderName" placeholder="File Folder Name" />

      <input type="text" name="hardware" placeholder="Hardware" />
      <input type="text" name="installation" placeholder="Installation" />

      <textarea name="additional_info_notes" placeholder="Additional Info Notes"></textarea>

      <button type="submit"> Create Order </button>
    </Form>
  )
}