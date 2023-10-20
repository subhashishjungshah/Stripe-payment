import Head from 'next/head'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  const createSubscription = async (e) => {
    e.preventDefault()
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: elements.getElement('card'),
        type: 'card',
      })
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          paymentMethod: paymentMethod.paymentMethod.id,
        }),
      })
      if (!response.ok) return alert('Payment unsuccessful!')
      const data = await response.json()
      const confirm = await stripe.confirmCardPayment(data.clientSecret)
      if (confirm.error) return alert('Payment unsuccessful!')
      alert('Payment Successful! Subscription active.')
    } catch (err) {
      console.error(err)
      alert('Payment failed! ' + err.message)
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up - TaxPal</title>
      </Head>

      <AuthLayout>
        <div className="flex flex-col">
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Finish your payment
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Already registered?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </Link>{' '}
              to your account.
            </p>
          </div>
        </div>
        <form
          action="#"
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
        >
          <TextField
            label="First name"
            id="first_name"
            name="first_name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            className="col-span-full"
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <div className="col-span-full">
            <CardElement />
          </div>
          <div className="col-span-full">
            <Button
              onClick={createSubscription}
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              <span>
                Proceed to payment <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
        </form>
      </AuthLayout>
    </>
  )
}
