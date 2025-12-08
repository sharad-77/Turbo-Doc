import { PaymentTest } from '../../components/payment-test';

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Payment Integration</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testing the connection between Frontend and Backend Payment API
        </p>
      </div>

      <PaymentTest />
    </div>
  );
}
