import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MdBrightness4, MdBrightness7, MdSupervisorAccount } from 'react-icons/md';
import axios from 'axios';

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch users (demo: only if you are admin)
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUsers(res.data.data || res.data.users || []);
        // Prepare roles state
        const roles = {};
        (res.data.data || res.data.users || []).forEach(u => {
          roles[u.id] = u.role || 'user';
        });
        setUserRoles(roles);
      })
      .catch(() => {});
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme === 'dark' ? 'dark' : '';
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    localStorage.setItem('role', e.target.value);
    // In real app, send to backend!
  };

  // Handle role change for a selected user (admin)
  const handleUserRoleChange = (newRole) => {
    if (!selectedUser) return;
    setUserRoles(r => ({ ...r, [selectedUser]: newRole }));
    setMessage('Role updated! (demo only)');
    // In real app, send to backend:
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  };

  return (
    <Layout>
      <div className="container mx-auto max-w-xl">
        <div className="py-10">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          {/* Theme Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MdBrightness4 className="mr-2" /> Theme
            </h2>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleThemeChange('light')}
              >
                <MdBrightness7 className="inline mr-1" /> Light
              </button>
              <button
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleThemeChange('dark')}
              >
                <MdBrightness4 className="inline mr-1" /> Dark
              </button>
            </div>
          </div>

          {/* Role Management Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MdSupervisorAccount className="mr-2" /> Role Management
            </h2>
            <label className="block mb-2 text-gray-700">Select your role:</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="border rounded px-3 py-2"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <div className="mt-2 text-gray-500 text-sm">
            </div>
          </div>

          {/* User List & Role Change (Admin Demo) */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MdSupervisorAccount className="mr-2" /> User List & Role Change
              </h2>
              {message && <div className="mb-2 text-green-600">{message}</div>}
              <table className="min-w-full text-sm mb-2">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-1">Select</th>
                    <th className="text-left px-2 py-1">Name</th>
                    <th className="text-left px-2 py-1">Email</th>
                    <th className="text-left px-2 py-1">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className={selectedUser === u.id ? 'bg-indigo-50' : ''}>
                      <td className="px-2 py-1">
                        <input
                          type="radio"
                          name="selectedUser"
                          checked={selectedUser === u.id}
                          onChange={() => setSelectedUser(u.id)}
                        />
                      </td>
                      <td className="px-2 py-1">{u.name}</td>
                      <td className="px-2 py-1">{u.email}</td>
                      <td className="px-2 py-1">
                        <select
                          value={userRoles[u.id] || 'user'}
                          onChange={e => handleUserRoleChange(e.target.value)}
                          className="border rounded px-2 py-1"
                          disabled={selectedUser !== u.id}
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-gray-500 text-sm">
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}