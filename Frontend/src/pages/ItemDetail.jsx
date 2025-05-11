import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MdEdit, MdArrowBack, MdHistoryToggleOff, MdAddShoppingCart, MdRemoveShoppingCart } from 'react-icons/md';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const navigate = useNavigate();
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockType, setStockType] = useState('in'); // 'in' or 'out'
  const [stockQty, setStockQty] = useState('');
  const [stockError, setStockError] = useState('');
  const [trendPeriod, setTrendPeriod] = useState('weekly');
  const [trendData, setTrendData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get(`http://localhost:8000/api/items/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setItem(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setItem(null);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get(`http://localhost:8000/api/items/${id}/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log('History:', res.data.data); // <--- Add this
        setHistory(res.data.data);
        setHistoryLoading(false);
      })
      .catch(() => setHistoryLoading(false));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get(`http://localhost:8000/api/items/${id}/trend?period=${trendPeriod}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTrendData(res.data));
  }, [id, trendPeriod]);

  const openStockModal = (type) => {
    setStockType(type);
    setStockQty('');
    setStockError('');
    setShowStockModal(true);
  };

  const handleStockSubmit = async () => {
    const qty = parseInt(stockQty, 10);
    if (isNaN(qty) || qty <= 0) {
      setStockError('Please enter a valid quantity.');
      return;
    }
    setStockError('');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:8000/api/items/${id}/stock`,
        { type: stockType, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowStockModal(false);
      // Refresh item and history after backend update
      setIsLoading(true);
      setHistoryLoading(true);
      // Fetch updated item
      axios.get(`http://localhost:8000/api/items/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setItem(res.data.data);
          setIsLoading(false);
        });
      // Fetch updated history
      axios.get(`http://localhost:8000/api/items/${id}/history`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setHistory(res.data.data);
          setHistoryLoading(false);
        });
    } catch (err) {
      setStockError('Failed to update stock. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Item not found. The item with ID {id} does not exist.</p>
            <Link to="/inventory" className="text-indigo-600 hover:underline mt-2 inline-block">
              Return to inventory
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto">
        {/* Header with navigation and actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <MdArrowBack className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">{item.name}</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => openStockModal('in')}
              className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors"
            >
              <MdAddShoppingCart className="mr-1" /> Stock In
            </button>
            <button
              onClick={() => openStockModal('out')}
              className="bg-red-600 text-white px-3 py-2 rounded-md flex items-center hover:bg-red-700 transition-colors"
            >
              <MdRemoveShoppingCart className="mr-1" /> Stock Out
            </button>
            <Link
              to={`/inventory/add?id=${id}`}
              className="bg-indigo-600 text-white px-3 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
            >
              <MdEdit className="mr-1" /> Edit
            </Link>
          </div>
        </div>

        {/* Item details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" >
          {/* Left column: Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow h-10 overflow-hidden">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="w-full h-auto object-cover text-center p-2"
              />
            </div>
          </div>

          {/* Middle + Right columns: Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className=" md:grid-cols-2 gap-6">
                {/* Basic details */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 border-b pb-2">Product Information</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{item.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span>{item.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span>
                        {item.price !== undefined && item.price !== null ? `${Number(item.price).toLocaleString()} FCFA` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className={`font-medium ${item.stock < (item.min_stock_level ?? 0) ? 'text-red-600' : 'text-green-600'}`}>
                        {item.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Stock Level:</span>
                      <span>{item.min_stock_level} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span>{item.location || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supplier:</span>
                      <span>{item.supplier || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span>{item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Trend Graph */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold">Stock Movements</h2>
            <div className="ml-auto flex space-x-2">
              {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded ${trendPeriod === period ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setTrendPeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {trendData && trendData.labels && trendData.datasets ? (
            <Line data={trendData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Stock In/Out Trends' }
              }
            }} />
          ) : (
            <div className="text-gray-400">No trend data available.</div>
          )}
        </div>

        {/* Stock History */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <MdHistoryToggleOff className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold">Stock History</h2>
          </div>
          <div className="overflow-x-auto">
            {historyLoading ? (
              <div className="text-gray-400">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-gray-400">No stock history available.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-1">Date</th>
                    <th className="text-left px-2 py-1">Type</th>
                    <th className="text-left px-2 py-1">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td className="px-2 py-1">{new Date(h.created_at).toLocaleString()}</td>
                      <td className="px-2 py-1">{h.type}</td>
                      <td className="px-2 py-1">{h.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Stock In/Out Modal */}
        {showStockModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold mb-4">
                {stockType === 'in' ? 'Stock In' : 'Stock Out'}
              </h2>
              <p className="mb-4">
                How many units do you want to {stockType === 'in' ? 'add to' : 'remove from'} <span className="font-semibold">{item.name}</span>?
              </p>
              <input
                type="number"
                min="1"
                value={stockQty}
                onChange={e => setStockQty(e.target.value)}
                className="border rounded px-3 py-2 w-full mb-2"
                placeholder="Quantity"
              />
              {stockError && <div className="text-red-600 mb-2">{stockError}</div>}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowStockModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded ${stockType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                  onClick={handleStockSubmit}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
