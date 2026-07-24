import type { Order } from '../types';
import { mockProducts } from './mockProducts';

export const mockOrders: Order[] = [
  {
    id: 'ord-mock1',
    customerName: 'John Doe',
    phone: '555-0100',
    email: 'john@example.com',
    address: '123 Main St',
    state: 'CA',
    pincode: '90210',
    products: [{ ...mockProducts[0], quantity: 1 }],
    totalAmount: 129.99,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending (COD)',
    status: 'Pending',
    createdAt: Date.now() - 50000,
  },
  {
    id: 'ord-mock2',
    customerName: 'Jane Smith',
    phone: '555-0101',
    address: '456 Elm St',
    state: 'NY',
    pincode: '10001',
    products: [{ ...mockProducts[1], quantity: 2 }],
    totalAmount: 179.98,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending (COD)',
    status: 'Shipped',
    createdAt: Date.now() - 150000,
  }
];
