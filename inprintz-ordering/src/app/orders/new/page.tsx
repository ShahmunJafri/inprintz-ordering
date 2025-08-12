'use client'

import { useFormState } from 'react-dom'
import {useFormStatus} from 'react-dom'
import Link from 'next/link'
import prisma from '../../lib/prisma'
import { createOrder, deleteOrder } from '../../actions'

const initialState = {
  message: null,
}

export default function OrderForm() {
  const [state, formAction] = useFormState(createOrder, initialState)
  return (
    <form action={formAction}>
      <label htmlFor="todo"> Enter Order </label>
      <input type="text" id="Order" name="Order" required />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
