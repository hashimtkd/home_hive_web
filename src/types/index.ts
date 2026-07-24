export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  stockStatus: 'In Stock' | 'Out of Stock';
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  state: string;
  pincode: string;
  products: CartItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Online Payment';
  paymentStatus: 'Pending (COD)' | 'Paid' | 'Failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: number;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin';
}
