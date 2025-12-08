'use client';

import Script from 'next/script';
import { useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function PaymentTest() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handlePayment = async () => {
    setLoading(true);
    setStatus('Creating order...');

    try {
      // 1. Create Order
      const response = await fetch('http://localhost:4000/api/v1/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planId: 'cmivysjrs00010ghp9yjntf84',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error creating order: ${response.statusText}`);
      }

      const orderEndpointResponse = await response.json();

      setStatus('Order created. Opening Razorpay...');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        config_id: 'config_Rp7vASLMJQxAHQ',
        amount: orderEndpointResponse.amount,
        currency: orderEndpointResponse.currency,
        name: 'Turbo-Doc',
        description: 'Test Transaction',
        order_id: orderEndpointResponse.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          console.log('Payment Successful', response);
          setStatus(
            `Payment Successful! Payment ID: ${response.razorpay_payment_id}. Verifying...`
          );

          try {
            const verifyRes = await fetch('http://localhost:4000/api/v1/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setStatus('Payment Verified & Subscription Activated!');
            } else {
              setStatus(`Verification Failed: ${verifyData.error}`);
            }
          } catch (err) {
            console.error(err);
            setStatus('Verification Request Failed');
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp1.on('payment.failed', function (response: any) {
        console.error('Payment Failed', response.error);
        setStatus(`Payment Failed: ${response.error.description}`);
      });

      rzp1.open();
      setLoading(false);
    } catch (error: unknown) {
      console.error('Payment Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setStatus(`Error: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-sm bg-white dark:bg-zinc-900">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <h2 className="text-xl font-bold mb-4">Payment Test</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">
          Click below to initiate a test payment for &apos;plan_12345&apos;.
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : 'Buy Test Plan'}
      </button>

      {status && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-zinc-800 rounded text-sm break-words">
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
}
