import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-gray-600 hover:text-black">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="text-xl font-bold tracking-tight text-black">
            DROPSHIP
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Shop All
          </Link>
          <Link to="/products?category=trending" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Trending
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-black">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-black">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
