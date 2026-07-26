import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SEO } from '../components/seo/SEO';
import { SITE_CONFIG } from '../config/seo';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { isDummyConfig } = await import('../services/firebase');
        if (isDummyConfig) {
          throw new Error('Firebase environment variables are missing. Ensure VITE_FIREBASE_* variables are set in Vercel.');
        }

        let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        if (categoryFilter && categoryFilter !== 'all') {
          q = query(collection(db, 'products'), where('category', '==', categoryFilter));
        }
        
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        
        setProducts(productsData);
      } catch (err: any) {
        console.error('Firebase fetch failed. Error details:', err);
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        setError(err.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title={categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products` : 'All Products'}
        description={categoryFilter
          ? `Browse our ${categoryFilter} collection — premium home products at HomeHive.`
          : 'Browse all premium home furnishings, decor, and lifestyle products at HomeHive.'}
        canonical={`${SITE_CONFIG.url}/products${categoryFilter ? `?category=${categoryFilter}` : ''}`}
      />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products` : 'All Products'}
        </h1>
        {/* Simple Filters Placeholder */}
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-md py-2 px-4 text-sm bg-white">
            <option>Sort by Price: Low to High</option>
            <option>Sort by Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-24 text-red-500">
          <p className="text-xl font-semibold mb-2">Error loading products</p>
          <p>{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
