import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/Button';
import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error('Firebase fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <Button className="mt-8" onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { directItem: { ...product, quantity } } });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col-reverse">
          <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
            <div className="grid grid-cols-4 gap-6">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50 ${
                    selectedImage === idx ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-transparent'
                  }`}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <img src={img} alt="" className="h-full w-full object-cover object-center" />
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="aspect-h-1 aspect-w-1 w-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <div className="flex flex-col gap-1">
              <p className="text-xl text-gray-500">Unit Price: ${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
              <p className="text-3xl font-bold text-gray-900 mt-2">Total: ${(product.price * quantity).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          <div className="mt-10">
            <div className="flex items-center mb-6">
              <span className="mr-4 text-sm font-medium text-gray-700">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium text-gray-900 border-x border-gray-300 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md active:scale-95" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Button 
                size="lg" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95" 
                onClick={handleBuyNow}
              >
                <Zap className="h-5 w-5" /> Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
