import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/seo/SEO';
import { SITE_CONFIG } from '../config/seo';

export function Home() {
  return (
    <div className="flex flex-col">
      <SEO
        canonical={SITE_CONFIG.url}
        ogImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
      />
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Discover Your Style
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Shop the latest trends and exclusive collections. Minimalist design, maximum impact.
          </p>
          <Link to="/products">
            <Button size="lg" className="group">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Categories / Info */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mx-auto mb-6">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-500 text-sm">Free shipping on all orders over $50.</p>
            </div>
            <div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mx-auto mb-6">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-500 text-sm">30-day return policy for peace of mind.</p>
            </div>
            <div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mx-auto mb-6">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-500 text-sm">100% secure payment processing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
