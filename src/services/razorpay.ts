export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Mock Backend function to generate a Razorpay Order ID.
 * In a real application, this MUST be called from a secure backend (e.g. Node.js or Cloud Functions)
 * using the Razorpay Key Secret.
 */
export const mockCreateRazorpayOrder = async (_amount: number): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a mock order ID
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `order_${randomStr}`;
};
