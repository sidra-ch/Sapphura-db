"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Grid,
  List,
  X,
  DollarSign,
  Loader2,
  Upload,
  RefreshCcw,
  Database,
} from 'lucide-react';

type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
};

type CategoryRow = { id: number; name: string };

type CloudAsset = {
  publicId: string;
  url: string;
  format: string | null;
  size: number;
  type: 'image' | 'video';
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  isFeatured: boolean;
  imageUrls: string[];
  videoUrls: string[];
};

type ImportSummary = {
  mode: 'dry-run' | 'import';
  totalAssets?: number;
  groupedAssets?: number;
  existingMatchedAssets?: number;
  matchedExistingProducts?: number;
  relinkableProducts?: number;
  alreadyLinkedProducts?: number;
  importableGroups?: number;
  importableAssetCount?: number;
  relinked?: number;
  created?: number;
  sample?: Array<{ name: string; slug: string; category: string; mediaCount: number }>;
};

const initialFormState: ProductFormState = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  stock: '0',
  categoryId: '',
  isFeatured: false,
  imageUrls: [],
  videoUrls: [],
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [assets, setAssets] = useState<CloudAsset[]>([]);
  const [isImportingAssets, setIsImportingAssets] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);

  const categoryNames = useMemo(() => ['All', ...categories.map((c) => c.name)], [categories]);

  const loadData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch('/api/products', { cache: 'no-store' }),
      fetch('/api/categories', { cache: 'no-store' }),
    ]);

    const [productsData, categoriesData] = await Promise.all([productsRes.json(), categoriesRes.json()]);

    if (Array.isArray(productsData.products)) {
      setProducts(
        productsData.products.map(
          (p: {
            id: number;
            name: string;
            category: string;
            price: number;
            stock: number;
            status: string;
            image: string;
          }) => ({
            id: p.id,
            name: p.name,
            category: p.category || 'Uncategorized',
            price: p.price,
            stock: p.stock,
            status: p.stock > 0 ? 'Active' : 'Out of Stock',
            image: p.image,
          })
        )
      );
    }

    if (Array.isArray(categoriesData.categories)) {
      setCategories(categoriesData.categories.map((c: CategoryRow) => ({ id: c.id, name: c.name })));
    }
  };

  const loadCloudinaryAssets = async () => {
    setIsLoadingAssets(true);
    setFormError('');
    try {
      const res = await fetch('/api/media/cloudinary/assets?prefix=all', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch cloud assets');
      }

      const mappedImages: CloudAsset[] = Array.isArray(data.images)
        ? data.images.map((item: { publicId: string; url: string; format: string | null; size: number }) => ({
            ...item,
            type: 'image' as const,
          }))
        : [];
      const mappedVideos: CloudAsset[] = Array.isArray(data.videos)
        ? data.videos.map((item: { publicId: string; url: string; format: string | null; size: number }) => ({
            ...item,
            type: 'video' as const,
          }))
        : [];

      setAssets([...mappedImages, ...mappedVideos]);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to load Cloudinary assets');
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const previewCloudinaryImport = async () => {
    setIsImportingAssets(true);
    setFormError('');
    setFormMessage('');
    try {
      const res = await fetch('/api/products/import-cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to preview import');
      }
      setImportSummary(data);
      setFormMessage(`Preview ready: ${data.importableGroups || 0} product groups can be imported from Cloudinary.`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to preview import');
    } finally {
      setIsImportingAssets(false);
    }
  };

  const importCloudinaryAssets = async () => {
    const defaultPriceRaw = window.prompt('Default price for imported products', '99');
    if (defaultPriceRaw === null) return;

    const defaultStockRaw = window.prompt('Default stock for imported products', '1');
    if (defaultStockRaw === null) return;

    const defaultPrice = Number(defaultPriceRaw);
    const defaultStock = Number(defaultStockRaw);

    if (!Number.isFinite(defaultPrice) || defaultPrice <= 0 || !Number.isInteger(defaultStock) || defaultStock < 0) {
      setFormError('Import cancelled: default price or stock was invalid.');
      return;
    }

    setIsImportingAssets(true);
    setFormError('');
    setFormMessage('');
    try {
      const res = await fetch('/api/products/import-cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dryRun: false,
          defaultPrice,
          defaultStock,
          status: 'active',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to import products');
      }
      setImportSummary(data);
      setFormMessage(`Imported ${data.created || 0} products from Cloudinary media.`);
      await loadData();
      await loadCloudinaryAssets();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to import products');
    } finally {
      setIsImportingAssets(false);
    }
  };

  const addAssetToForm = (asset: CloudAsset) => {
    setForm((prev) => {
      if (asset.type === 'image') {
        return prev.imageUrls.includes(asset.url)
          ? prev
          : { ...prev, imageUrls: [...prev.imageUrls, asset.url] };
      }
      return prev.videoUrls.includes(asset.url)
        ? prev
        : { ...prev, videoUrls: [...prev.videoUrls, asset.url] };
    });
  };

  const removeMedia = (url: string, type: 'image' | 'video') => {
    setForm((prev) =>
      type === 'image'
        ? { ...prev, imageUrls: prev.imageUrls.filter((item) => item !== url) }
        : { ...prev, videoUrls: prev.videoUrls.filter((item) => item !== url) }
    );
  };

  const uploadFilesToCloudinary = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setFormError('');

    try {
      const signatureRes = await fetch('/api/media/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'products' }),
      });
      const signatureData = await signatureRes.json();
      if (!signatureRes.ok) {
        throw new Error(signatureData.error || 'Failed to prepare Cloudinary upload');
      }

      const uploadedImages: string[] = [];
      const uploadedVideos: string[] = [];

      for (const file of Array.from(files)) {
        const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('api_key', String(signatureData.apiKey));
        uploadFormData.append('timestamp', String(signatureData.timestamp));
        uploadFormData.append('signature', String(signatureData.signature));
        uploadFormData.append('folder', String(signatureData.folder));

        const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;
        const uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadFormData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error?.message || 'Cloudinary upload failed');
        }

        if (resourceType === 'video') {
          uploadedVideos.push(uploadData.secure_url);
        } else {
          uploadedImages.push(uploadData.secure_url);
        }
      }

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedImages],
        videoUrls: [...prev.videoUrls, ...uploadedVideos],
      }));

      setFormMessage('Media uploaded successfully.');
      await loadCloudinaryAssets();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Media upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModalState = () => {
    setForm(initialFormState);
    setAssets([]);
    setFormError('');
    setFormMessage('');
  };

  const openAddModal = () => {
    setShowAddModal(true);
    resetModalState();
    void loadCloudinaryAssets();
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetModalState();
  };

  const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setFormMessage('');

    if (!form.name.trim() || !form.description.trim() || !form.price || !form.categoryId) {
      setFormError('Please fill required fields: name, description, price, and category.');
      return;
    }

    if (form.imageUrls.length === 0) {
      setFormError('Please select or upload at least one image.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : undefined,
          stock: Number(form.stock || 0),
          categoryId: Number(form.categoryId),
          isFeatured: form.isFeatured,
          imageUrls: form.imageUrls,
          videoUrls: form.videoUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      setFormMessage('Product added successfully.');
      await loadData();
      setTimeout(() => closeAddModal(), 600);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (productId: number, productName: string) => {
    const confirmed = window.confirm(`Delete "${productName}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setFormError('');
    setFormMessage('');

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      setFormMessage('Product deleted successfully.');
      await loadData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const quickEditProduct = async (product: ProductRow) => {
    const nextName = window.prompt('Product name', product.name);
    if (nextName === null) {
      return;
    }

    const nextPriceRaw = window.prompt('Price', String(product.price));
    if (nextPriceRaw === null) {
      return;
    }

    const nextStockRaw = window.prompt('Stock', String(product.stock));
    if (nextStockRaw === null) {
      return;
    }

    const nextPrice = Number(nextPriceRaw);
    const nextStock = Number(nextStockRaw);

    if (!nextName.trim()) {
      setFormError('Product name cannot be empty.');
      return;
    }

    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      setFormError('Price must be a number greater than zero.');
      return;
    }

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      setFormError('Stock must be a non-negative integer.');
      return;
    }

    setFormError('');
    setFormMessage('');

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nextName.trim(),
          price: nextPrice,
          stock: nextStock,
          status: nextStock > 0 ? 'active' : 'inactive',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }
      setFormMessage('Product updated successfully.');
      await loadData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to update product');
    }
  };

  useEffect(() => {
    let mounted = true;
    async function boot() {
      try {
        await loadData();
      } catch {
        // keep page stable
      }
    }

    if (mounted) {
      void boot();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Products</h1>
              <p className="text-white/50">Manage your product catalog</p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categoryNames.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-gold text-[#0a0a23]'
                    : 'bg-[#1a1a40] text-white/70 hover:bg-gold/20 hover:text-gold border border-gold/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-[#1a1a40] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gold text-[#0a0a23]' : 'text-white/70'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gold text-[#0a0a23]' : 'text-white/70'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={String(product.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden group hover:border-gold transition"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button className="p-2 bg-gold text-[#0a0a23] rounded-full hover:scale-110 transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => void quickEditProduct(product)}
                      className="p-2 bg-white text-[#0a0a23] rounded-full hover:scale-110 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => void deleteProduct(product.id, product.name)}
                      className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span
                    className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                      product.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-white/50 text-xs">{product.category}</p>
                  <h3 className="text-gold font-semibold text-sm truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white font-bold">${product.price}</span>
                    <span
                      className={`text-xs ${
                        product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={closeAddModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a40] border border-gold/20 rounded-2xl p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gold">Add New Product</h2>
                  <button onClick={closeAddModal} className="text-white/70 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={createProduct}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Product Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Category</label>
                      <select
                        value={form.categoryId}
                        onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Stock Quantity</label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Sale Price (optional)</label>
                      <input
                        type="number"
                        value={form.salePrice}
                        onChange={(e) => setForm((prev) => ({ ...prev, salePrice: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-white/80">
                        <input
                          type="checkbox"
                          checked={form.isFeatured}
                          onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        />
                        Mark as featured product
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Description</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                      placeholder="Product description..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="block text-white/70 text-sm">Cloudinary Media Library</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void previewCloudinaryImport()}
                          className="inline-flex items-center gap-1 text-xs text-gold border border-gold/40 rounded px-2 py-1 hover:bg-gold/10 disabled:opacity-60"
                          disabled={isImportingAssets}
                        >
                          <Database className="w-3.5 h-3.5" /> Preview Import
                        </button>
                        <button
                          type="button"
                          onClick={() => void importCloudinaryAssets()}
                          className="inline-flex items-center gap-1 text-xs text-gold border border-gold/40 rounded px-2 py-1 hover:bg-gold/10 disabled:opacity-60"
                          disabled={isImportingAssets}
                        >
                          <Plus className="w-3.5 h-3.5" /> Import Missing
                        </button>
                        <button
                          type="button"
                          onClick={() => void loadCloudinaryAssets()}
                          className="inline-flex items-center gap-1 text-xs text-gold border border-gold/40 rounded px-2 py-1 hover:bg-gold/10"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" /> Refresh
                        </button>
                      </div>
                    </div>

                    {importSummary && (
                      <div className="mb-3 rounded-lg border border-gold/20 bg-[#111736] p-3 text-xs text-white/75">
                        {importSummary.mode === 'dry-run' ? (
                          <>
                            <p>Cloudinary assets: {importSummary.totalAssets ?? 0}</p>
                            <p>Grouped media sets: {importSummary.groupedAssets ?? 0}</p>
                            <p>Already linked assets: {importSummary.existingMatchedAssets ?? 0}</p>
                            <p>Matched existing products: {importSummary.matchedExistingProducts ?? 0}</p>
                            <p>Products needing relink: {importSummary.relinkableProducts ?? 0}</p>
                            <p>Importable product groups: {importSummary.importableGroups ?? 0}</p>
                          </>
                        ) : (
                          <>
                            <p>Relinked products: {importSummary.relinked ?? 0}</p>
                            <p>Imported products: {importSummary.created ?? 0}</p>
                          </>
                        )}
                      </div>
                    )}

                    <div className="border border-gold/20 rounded-lg p-3 max-h-56 overflow-y-auto bg-[#0a0a23]">
                      {isLoadingAssets ? (
                        <div className="flex items-center justify-center py-8 text-white/60 gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading assets...
                        </div>
                      ) : assets.length === 0 ? (
                        <p className="text-white/50 text-sm">No Cloudinary assets found in the connected library.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {assets.map((asset) => (
                            <button
                              type="button"
                              key={asset.publicId}
                              onClick={() => addAssetToForm(asset)}
                              className="relative border border-gold/20 rounded-md overflow-hidden hover:border-gold"
                            >
                              {asset.type === 'video' ? (
                                <video src={asset.url} className="w-full h-20 object-cover" muted />
                              ) : (
                                <img src={asset.url} alt={asset.publicId} className="w-full h-20 object-cover" loading="lazy" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Direct Upload (Image/Video)</label>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-lg p-5 text-center cursor-pointer hover:bg-gold/5">
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-gold" /> : <Upload className="w-5 h-5 text-gold" />}
                      <span className="text-white/70 text-sm">{isUploading ? 'Uploading...' : 'Click to upload files to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => void uploadFilesToCloudinary(e.target.files)}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#0a0a23] border border-gold/20 rounded-lg p-3">
                      <p className="text-gold text-xs mb-2">Selected Images ({form.imageUrls.length})</p>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {form.imageUrls.map((url) => (
                          <div key={url} className="flex items-center justify-between gap-2 text-white/70 text-xs">
                            <span className="truncate">{url}</span>
                            <button type="button" onClick={() => removeMedia(url, 'image')} className="text-red-400">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0a0a23] border border-gold/20 rounded-lg p-3">
                      <p className="text-gold text-xs mb-2">Selected Videos ({form.videoUrls.length})</p>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {form.videoUrls.map((url) => (
                          <div key={url} className="flex items-center justify-between gap-2 text-white/70 text-xs">
                            <span className="truncate">{url}</span>
                            <button type="button" onClick={() => removeMedia(url, 'video')} className="text-red-400">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {formError && <p className="text-red-400 text-sm">{formError}</p>}
                  {formMessage && <p className="text-green-400 text-sm">{formMessage}</p>}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="flex-1 py-3 border border-gold/30 text-white rounded-lg hover:bg-gold/10 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-60"
                    >
                      {isSaving ? 'Saving...' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
