import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { MdInventory, MdShoppingBag, MdWarning, MdTrendingUp } from 'react-icons/md';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

/**
 * Composant Dashboard - Page d'accueil principale de l'application
 * Affiche un aperçu des données d'inventaire avec des statistiques clés et des graphiques
 *
 * @returns {JSX.Element} Le composant Dashboard rendu
 */
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [trendData, setTrendData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);
  const [trendPeriod, setTrendPeriod] = useState('weekly');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsLoading(true);
    axios.get(`http://localhost:8000/api/dashboard?period=${trendPeriod}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSummaryData(res.data.summary);
        // Transform categoryData for Chart.js
        setCategoryData({
          labels: res.data.categoryData.map(c => c.category),
          datasets: [{
            data: res.data.categoryData.map(c => c.count),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(156, 163, 175, 0.8)',
            ],
            borderColor: [
              'rgba(79, 70, 229, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(156, 163, 175, 1)',
            ],
            borderWidth: 1,
          }]
        });
        setTrendData(res.data.trendData);
        setTransactionData(res.data.transactionData);
        setRecentActivity(res.data.recentActivity);
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Could not load dashboard data.');
        }
      });
  }, [trendPeriod]);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Value Trends',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Transactions',
      },
    },
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        {isLoading ? (
          // État de chargement - afficher un spinner
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Section des cartes de résumé - 4 indicateurs clés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Carte 1: Nombre total d'articles */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <MdInventory className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <h3 className="text-2xl font-bold text-gray-900">{summaryData.totalItems}</h3>
                  </div>
                </div>
              </div>

              {/* Carte 2: Articles à faible stock (alerte) */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full p-3">
                    <MdWarning className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <h3 className="text-2xl font-bold text-gray-900">{summaryData.lowStock}</h3>
                  </div>
                </div>
              </div>

              {/* Carte 3: Commandes récentes */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3">
                    <MdShoppingBag className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recent Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">{summaryData.recentOrders}</h3>
                  </div>
                </div>
              </div>

              {/* Carte 4: Valeur totale de l'inventaire */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <MdTrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {summaryData.totalValue?.toLocaleString()} FCFA
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Time frame selector */}
            <div className="flex space-x-2 mb-2">
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

            {/* Section des graphiques principaux - tendances et répartition */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Graphique linéaire: tendance de la valeur d'inventaire */}
              <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
                <Line data={trendData} options={lineOptions} />
              </div>

              {/* Graphique en anneau: répartition par catégorie */}
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
                <div className="flex justify-center">
                  <div className="w-60 h-60">
                    <Doughnut data={categoryData} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section graphique à barres et activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Graphique à barres: transactions par jour de la semaine */}
              <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
                <Bar data={transactionData} options={barOptions} />
              </div>

              {/* Flux d'activité récente - liste des dernières actions */}
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start border-b border-gray-200 pb-3">
                      {/* Indicateur coloré du type d'activité */}
                      <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                        activity.type === 'added'
                          ? 'bg-green-500'  // Vert pour les ajouts
                          : activity.type === 'removed'
                            ? 'bg-red-500'  // Rouge pour les retraits
                            : 'bg-yellow-500' // Jaune pour les mises à jour
                      }`}></div>

                      {/* Détails de l'activité */}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.item}
                          <span className="text-xs text-gray-500 ml-2">({activity.quantity})</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
