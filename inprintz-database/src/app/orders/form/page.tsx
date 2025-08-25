import { createOrder } from '@/actions/actions'
import Form from 'next/form'

export default function form() {
  return (
    <Form action={createOrder}>
      <input
        type="text"
        name="job name" 
        placeholder="Job Name"
      />
      <button
        type="submit"
      >
        Create Order
      </button>
    </Form>
  )
}