import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { loadRazorpayScript, mockCreateRazorpayOrder } from '../services/razorpay';
import { Minus, Plus } from 'lucide-react';
import { SEO } from '../components/seo/SEO';

export function Checkout() {
  const { items, getTotalPrice, clearCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [localDirectItem, setLocalDirectItem] = useState<any>(location.state?.directItem);

  const directItem = localDirectItem;

  const checkoutItems = directItem ? [directItem] : items;
  const checkoutTotal = directItem ? (directItem.price * directItem.quantity) : getTotalPrice();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment'>('Online Payment');

  const handleUpdateQty = (id: string, qty: number) => {
    if (directItem && directItem.id === id) {
      setLocalDirectItem({ ...directItem, quantity: qty });
    } else {
      updateQuantity(id, qty);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;
    
    setLoading(true);

    if (paymentMethod === 'Online Payment') {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      try {
        const orderId = await mockCreateRazorpayOrder(checkoutTotal);
        
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
          amount: Math.round(checkoutTotal * 100), // in paise/cents
          currency: 'USD',
          name: 'Dropship Store',
          description: 'Order Payment',
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // Successful payment
              const orderRef = await addDoc(collection(db, 'orders'), {
                ...formData,
                products: checkoutItems,
                totalAmount: checkoutTotal,
                paymentMethod: 'Online Payment',
                paymentStatus: 'Paid',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: 'Pending',
                createdAt: Date.now(),
              });
              if (!directItem) clearCart();
              navigate('/order-success', { state: { orderId: orderRef.id, paymentStatus: 'Paid' } });
            } catch (error) {
              console.error('Firebase order failed:', error);
              alert('Failed to place order.');
            }
          },
          prefill: {
            name: formData.customerName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#000000',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } catch (error) {
        console.error('Error initiating payment:', error);
        alert('Failed to initiate payment.');
        setLoading(false);
      }
      // Note: we don't setLoading(false) here on success path because the modal handles it or redirect happens
    } else {
      // Cash on delivery flow
      try {
        const orderRef = await addDoc(collection(db, 'orders'), {
          ...formData,
          products: checkoutItems,
          totalAmount: checkoutTotal,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending (COD)',
          status: 'Pending',
          createdAt: Date.now(),
        });
        
        if (!directItem) clearCart();
        navigate('/order-success', { state: { orderId: orderRef.id, paymentStatus: 'Pending (COD)' } });
      } catch (error) {
        console.error('Firebase order failed:', error);
        alert('Failed to place order.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-900">Your checkout is empty</h2>
        <Button className="mt-8" onClick={() => navigate('/products')}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO title="Checkout" noIndex />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address (optional)</label>
                  <div className="mt-1">
                    <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number *</label>
                  <div className="mt-1">
                    <Input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Full name *</label>
                    <div className="mt-1">
                      <Input type="text" id="customerName" name="customerName" required value={formData.customerName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
                    <div className="mt-1">
                      <Input type="text" id="address" name="address" required value={formData.address} onChange={handleChange} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province *</label>
                    <div className="mt-1">
                      <Input type="text" id="state" name="state" required value={formData.state} onChange={handleChange} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Postal code *</label>
                    <div className="mt-1">
                      <Input type="text" id="pincode" name="pincode" required value={formData.pincode} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Payment</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="online"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'Online Payment'}
                      onChange={() => setPaymentMethod('Online Payment')}
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-700">
                      Online Payment (Razorpay)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order summary</h2>
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <ul role="list" className="divide-y divide-gray-200">
                  {checkoutItems.map((item: any) => (
                    <li key={item.id} className="flex px-4 py-6 sm:px-6">
                      <div className="flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-20 rounded-md" />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col justify-center">
                        <div className="flex justify-between">
                          <h4 className="text-sm">
                            <span className="font-medium text-gray-700">{item.name}</span>
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <p className="text-sm text-gray-500">Unit Price: ${item.price.toFixed(2)}</p>
                          <div className="flex items-center border border-gray-300 rounded-md bg-white">
                            <button
                              type="button"
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                              onClick={() => handleUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-0.5 text-xs font-medium text-gray-900 border-x border-gray-300 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                              onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">${checkoutTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium text-gray-900">Total</dt>
                    <dd className="text-base font-medium text-gray-900">${checkoutTotal.toFixed(2)}</dd>
                  </div>
                </dl>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
