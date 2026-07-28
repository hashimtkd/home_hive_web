import { useEffect, useState } from 'react';
import api from '../../services/api';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import type { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Edit, Plus } from 'lucide-react';
import { ImageUploader } from '../../components/ui/ImageUploader';
import type { CompressedImageResult } from '../../utils/imageCompression';

export function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    stockStatus: 'In Stock',
  });
  
  // Image handling state
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<CompressedImageResult[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/products');
      const productsData = (res.data.products || res.data) as Product[];
      setProducts(productsData.map(p => {
        const { _id, id, ...rest } = p;
        return {
          id: _id || id,
          ...rest,
        } as Product;
      }));
    } catch (error) {
      console.error('API products fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress({});
    
    try {
      // 1. Upload new images sequentially to track progress cleanly
      const uploadedUrls: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const result = newImages[i];
        const url = await uploadImageToCloudinary(result.file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [i]: progress }));
        });
        uploadedUrls.push(url);
      }

      // 2. Combine existing images and newly uploaded images
      const allImages = [...existingImages, ...uploadedUrls];

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        description: formData.description,
        stockStatus: formData.stockStatus,
        images: allImages,
      };

      if (editingId) {
        await api.put(`/api/v1/admin/products/${editingId}`, productData);
      } else {
        await api.post('/api/v1/admin/products', productData);
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/v1/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };


  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      description: p.description,
      stockStatus: p.stockStatus,
    });
    setExistingImages(p.images || []);
    setNewImages([]);
    setUploadProgress({});
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: '', originalPrice: '', description: '', stockStatus: 'In Stock' });
    setExistingImages([]);
    setNewImages([]);
    setUploadProgress({});
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={uploading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} disabled={uploading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <Input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} disabled={uploading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price (optional)</label>
                  <Input type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} disabled={uploading} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  required 
                  className="w-full mt-1 border border-gray-300 rounded-md p-2" 
                  rows={4}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <ImageUploader 
                  existingImages={existingImages}
                  onExistingImagesChange={setExistingImages}
                  onNewImagesChange={setNewImages}
                  uploadProgress={uploadProgress}
                  disabled={uploading}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={uploading}>Cancel</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Saving Product...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
