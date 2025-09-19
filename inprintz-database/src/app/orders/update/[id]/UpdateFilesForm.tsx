"use client";

import { useRef } from "react";
import FilesField from "../../form/files";
import { addAttachmentsToOrder } from "@/actions/attachments";

export default function UpdateFilesForm({ orderId }: { orderId: string }) {
  const packRef = useRef<(() => void) | null>(null);

  return (
    <form
      action={async (formData) => {
        await addAttachmentsToOrder(orderId, formData);
      }}
      onSubmit={() => packRef.current?.()}
      className="mt-6 space-y-4"
    >
      <h3 className="text-sm font-semibold text-slate-800">Add Files</h3>
      <FilesField packRef={packRef} />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Upload & Attach
      </button>
    </form>
  );
}
