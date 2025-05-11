import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // ou là où tu as défini ton axios configuré
import {
  MdDashboard,
  MdInventory,
  MdAddBox,
  MdPerson,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';

/**
 * Composant de mise en page principal qui encadre toutes les pages de l'application
 * après l'authentification. Fournit une barre latérale de navigation et une mise en page réactive.
 *
 * @param {Object} props - Les propriétés du composant
 * @param {ReactNode} props.children - Les composants enfants à afficher dans la zone de contenu principale
 * @returns {JSX.Element} Le composant Layout rendu
 */
export default function Layout({ children }) {
  // État local pour gérer l'ouverture/fermeture de la barre latérale sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hooks React Router pour la navigation et pour connaître l'URL actuelle
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Configuration des liens de navigation affichés dans la barre latérale
   * Chaque élément contient un nom, un lien et une icône
   */
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Inventory', href: '/inventory', icon: MdInventory },
    { name: 'Profile', href: '/profile', icon: MdPerson },
    { name: 'Settings', href: '/settings', icon: MdSettings },
  ];

  /**
   * Gère la déconnexion de l'utilisateur
   * Dans une application réelle, cela effacerait les tokens d'authentification
   */
  // const handleLogout = () => {
  //   // Dans une véritable application, vous feriez ici la logique de déconnexion
  //   navigate('/login');
  // };
  const handleLogout = async () => {
    try {
      await axios.post('/logout'); // appel API Laravel Sanctum
      localStorage.removeItem('token'); // suppression du token local
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error.response?.data);
    }

    // Redirection inchangée
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Arrière-plan semi-transparent qui apparaît derrière la barre latérale mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Barre latérale pour les appareils mobiles - s'affiche comme un tiroir latéral */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* En-tête de la barre latérale mobile avec logo et bouton de fermeture */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <div className="flex items-center">
            {/* Logo de l'application */}
            <img
              src="/clipboard-logo.svg"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-gray-800">InventoryApp</span>
          </div>
          {/* Bouton pour fermer la barre latérale */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer le menu"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation pour mobile - liste des liens */}
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location.pathname === item.href
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-4 h-6 w-6 ${
                  location.pathname === item.href
                    ? 'text-indigo-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bouton de déconnexion en bas de la barre latérale mobile */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <MdLogout className="mr-4 h-6 w-6 text-gray-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Barre latérale pour les ordinateurs de bureau - visible en permanence */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          {/* En-tête avec logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <img
              src="/clipboard-logo.svg"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-gray-800">InventoryApp</span>
          </div>

          {/* Zone principale de navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 ${
                      location.pathname === item.href
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bouton de déconnexion en bas de la barre latérale desktop */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <MdLogout className="mr-3 h-6 w-6 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Barre supérieure visible uniquement sur mobile avec bouton de menu */}
        <div className="sticky top-0 z-10 bg-white md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 border-b">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <span className="sr-only">Ouvrir la barre latérale</span>
            <MdMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Zone de contenu principal où les enfants seront rendus */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
