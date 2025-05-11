import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { MdEdit, MdEmail, MdPerson, MdAccountCircle } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('http://localhost:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setUser(res.data.data || res.data.user || res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>User information could not be loaded.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl py-10">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="mb-6">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow"
              />
            ) : (
              <MdAccountCircle className="w-32 h-32 text-gray-300" />
            )}
          </div>
          {/* User Info */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <MdPerson className="mr-2 text-indigo-600" />
            {user.name || user.username || 'User'}
          </h2>
          <div className="text-gray-600 mb-4 flex items-center">
            <MdEmail className="mr-2" />
            {user.email || 'No email provided'}
          </div>
          {/* Additional Info */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <span className="block text-gray-500 text-sm mb-1">Role</span>
              <span className="font-medium text-gray-800">{user.role || 'User'}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-sm mb-1">Joined</span>
              <span className="font-medium text-gray-800">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
              </span>
            </div>
          </div>
          {/* Edit Button */}
          <Link
            to="/edit-profile"
            className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
          >
            <MdEdit className="mr-2" /> Edit Profile
          </Link>
        </div>
      </div>
    </Layout>
  );
}