import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Wireless Headphones',
    category: 'Electronics',
    price: 129.99,
    originalPrice: 199.99,
    description: 'Experience premium sound quality with our minimalist wireless headphones. Features active noise cancellation and up to 30 hours of battery life.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now()
  },
  {
    id: 'prod-2',
    name: 'Classic Leather Watch',
    category: 'Accessories',
    price: 89.99,
    description: 'A timeless classic. This elegant watch features a genuine leather strap and a precision quartz movement.',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 100000
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: 249.99,
    originalPrice: 349.99,
    description: 'Work in comfort all day with our ergonomic office chair. Adjustable lumbar support, breathable mesh back, and smooth-rolling casters.',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 200000
  },
  {
    id: 'prod-4',
    name: 'Smart Fitness Tracker',
    category: 'Electronics',
    price: 59.99,
    description: 'Track your steps, heart rate, and sleep patterns with our sleek smart fitness tracker. Water-resistant and syncs seamlessly with your phone.',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 300000
  },
  {
    id: 'prod-5',
    name: 'Ceramic Coffee Mug Set',
    category: 'Home',
    price: 34.99,
    originalPrice: 49.99,
    description: 'Start your morning right with these minimalist ceramic coffee mugs. Set of 4, microwave and dishwasher safe.',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 400000
  },
  {
    id: 'prod-6',
    name: 'Premium Canvas Backpack',
    category: 'Accessories',
    price: 79.99,
    description: 'Durable, water-resistant canvas backpack with genuine leather accents. Perfect for daily commutes or weekend getaways.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 500000
  },
  {
    id: 'prod-7',
    name: 'Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 109.99,
    originalPrice: 149.99,
    description: 'RGB mechanical keyboard with tactile switches for responsive typing and gaming. Customizable lighting and macros.',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 600000
  },
  {
    id: 'prod-8',
    name: 'Modern Table Lamp',
    category: 'Furniture',
    price: 45.00,
    description: 'Add a warm glow to your space with this modern brass table lamp. Features a dimmable LED bulb and cloth shade.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    createdAt: Date.now() - 700000
  }
];
