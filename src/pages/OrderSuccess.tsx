import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">Order placed successfully!</h2>
      <p className="mt-2 text-lg text-gray-500 text-center">
        Thank you for your purchase. We will process it shortly.
      </p>
      {orderId && (
        <div className="mt-6 bg-gray-50 px-6 py-4 rounded-md text-center space-y-2">
          <p className="text-sm text-gray-700">
            Order Reference: <span className="font-mono font-medium">{orderId}</span>
          </p>
          {location.state?.paymentStatus && (
            <p className="text-sm text-gray-700">
              Payment Status: <span className={`font-medium ${location.state.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {location.state.paymentStatus}
              </span>
            </p>
          )}
        </div>
      )}
      <div className="mt-10">
        <Link to="/">
          <Button size="lg">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
