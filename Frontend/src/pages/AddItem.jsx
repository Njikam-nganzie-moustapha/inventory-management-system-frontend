import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { MdArrowBack, MdSave, MdClose } from 'react-icons/md';
import * as yup from 'yup';
import axios from 'axios';

export default function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get('id'); // Should be a valid ID

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    minStockLevel: '',
    location: '',
    supplier: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  // Available categories for dropdown
  const categories = ['Electronics', 'Clothing', 'Footwear', 'Furniture', 'Home', 'Office Supplies', 'Food', 'Other'];

  // Fetch item details if editing
  useEffect(() => {
    if (editId) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      setLoading(true);
      axios.get(`http://localhost:8000/api/items/${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const item = res.data.data;

          console.log('Item loaded for edit:', item);
          setFormData({
            name: item.name || '',
            sku: item.sku || '',
            category: item.category || '',
            price: item.price || '',
            stock: item.stock || '',
            minStockLevel: item.min_stock_level || '',
            location: item.location || '',
            supplier: item.supplier || '',
          });
          setLoading(false);
          navigate(`/inventory/add?id=${item.id}`);
        })
        .catch(() => {
          setLoading(false);
          alert('Could not load item for editing.');
          navigate('/inventory');
        });
    }
  }, [editId, navigate]);

  // Yup schema
  const productSchema = yup.object().shape({
    name: yup.string().required('Product name is required').max(255, 'Product name cannot exceed 255 characters'),
    sku: yup.string().required('SKU is required'),
    category: yup.string().nullable(),
    price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
    stock: yup.number().typeError('Stock must be a number').integer('Stock must be a whole number').min(0, 'Stock cannot be negative').required('Stock is required'),
    minStockLevel: yup.number().typeError('Minimum stock level must be a number').integer('Minimum stock level must be a whole number').min(0, 'Minimum stock level cannot be negative').required('Minimum stock level is required'),
    location: yup.string().nullable(),
    supplier: yup.string().nullable(),
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseInt(value, 10) || '' : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      await productSchema.validate(formData, { abortEarly: false });

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        minStockLevel: parseInt(formData.minStockLevel, 10),
        location: formData.location || null,
        supplier: formData.supplier || null,
      };

      if (editId) {
        // Update existing item
        await axios.put(`http://localhost:8000/api/items/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new item
        await axios.post('http://localhost:8000/api/items', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      navigate('/inventory');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert('Server error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/inventory');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        {/* Header with title and actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <MdArrowBack className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {editId ? 'Edit Item' : 'Add New Item'}
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors"
            >
              <MdClose className="mr-1" /> Cancel
            </button>
            <button
              type="submit"
              form="item-form"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
              disabled={isSubmitting}
            >
              <MdSave className="mr-1" /> {editId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <form id="item-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-gray-900 border-b pb-2">Basic Information</h2>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                      SKU <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className='text-red-600'>*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                  </div>
                </div>

                {/* Inventory Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-gray-900 border-b pb-2">Inventory Information</h2>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                      min="0"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                  </div>
                  <div>
                    <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Stock Level <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="number"
                      id="minStockLevel"
                      name="minStockLevel"
                      value={formData.minStockLevel}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.minStockLevel ? 'border-red-500' : 'border-gray-300'}`}
                      min="0"
                    />
                    {errors.minStockLevel && <p className="mt-1 text-sm text-red-500">{errors.minStockLevel}</p>}
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Storage Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Warehouse A, Shelf 3B"
                    />
                  </div>
                  <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier
                    </label>
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (editId ? 'Updating…' : 'Saving…') : (editId ? 'Update' : 'Save')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
