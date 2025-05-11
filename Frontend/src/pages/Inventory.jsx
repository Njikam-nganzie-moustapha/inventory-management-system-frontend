import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility, MdFilterList } from 'react-icons/md';
import axios from 'axios';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('http://localhost:8000/api/items', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setItems(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getItems = () => {
    let filtered = [...items];

    if (category !== 'All') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    if (sort.key) {
      filtered.sort((a, b) => {
        if (a[sort.key] < b[sort.key]) return sort.direction === 'asc' ? -1 : 1;
        if (a[sort.key] > b[sort.key]) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredItems = getItems();

  const sortArrow = (key) =>
    sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '';

  // Handle edit: redirect to add page with item id as query param
  const handleEdit = (item) => {
    navigate(`/inventory/add?id=${item.id}`);
  };

  // Handle delete: show confirmation popup
  const handleDeleteClick = (item) => {
    setDeleteId(item.id);
    setDeleteName(item.name);
    setShowConfirm(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.delete(`http://localhost:8000/api/items/${deleteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setItems(items.filter(i => i.id !== deleteId));
        setShowConfirm(false);
        setDeleteId(null);
        setDeleteName('');
      })
      .catch(() => {
        setShowConfirm(false);
        setDeleteId(null);
        setDeleteName('');
        alert('Failed to delete item.');
      });
  };

  return (
    <Layout>
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Items</h1>
          <Link
            to="/inventory/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
          >
            <MdAdd className="mr-1" /> Add New Item
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <MdFilterList className="mr-2 text-gray-500" />
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="text-right md:text-left text-sm text-gray-600 flex items-center justify-end md:justify-start">
            {loading
              ? "Loading..."
              : `Showing ${filteredItems.length} of ${items.length} items`}
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'name', label: 'Product Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'stock', label: 'Stock' },
                  { key: 'price', label: 'Price' },
                  { key: 'sku', label: 'SKU' }
                ].map(col => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center">
                      {col.label} {sortArrow(col.key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className={item.stock < item.min_stock_level ? 'text-red-600 font-medium' : 'text-gray-500'}>
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span>
                      {item.price !== undefined && item.price !== null ? `${Number(item.price).toLocaleString()} FCFA` : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link to={`/inventory/${item.id}`} className="text-indigo-600 hover:text-indigo-800" title="View">
                        <MdVisibility className="h-5 w-5" />
                      </Link>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        onClick={() => handleEdit(item)}
                      >
                        <MdEdit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Confirmation Popup */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteName}</span>? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
