import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { MdSave, MdDelete, MdLock, MdEmail, MdPerson, MdAccountCircle, MdPhotoCamera, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', profile_image: null });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const u = res.data.data || res.data.user || res.data;
        setUser(u);
        setForm({ name: u.name, email: u.email, profile_image: null });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (form.profile_image) formData.append('profile_image', form.profile_image);

      await axios.post('http://localhost:8000/api/user/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Profile updated!');
    } catch (err) {
      setError('Could not update profile.');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(f => ({ ...f, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (passwordForm.new !== passwordForm.confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post('http://localhost:8000/api/user/password', {
        current: passwordForm.current,
        new: passwordForm.new
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Password updated!');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError('Could not update password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/user/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      window.location.href = '/register';
    } catch (err) {
      setError('Could not delete account.');
    }
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
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

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl py-10">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Profile Update */}
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center"><MdPerson className="mr-2" /> Profile</h2>
          <div className="flex flex-col items-center mb-4">
            {user.profile_image ? (
              <img src={user.profile_image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200 shadow mb-2" />
            ) : (
              <MdAccountCircle className="w-24 h-24 text-gray-300 mb-2" />
            )}
            <label className="relative mt-2 cursor-pointer flex items-center space-x-2 text-indigo-600 hover:text-indigo-800">
              <MdPhotoCamera className="w-6 h-6" />
              <span className="underline">Change photo</span>
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleProfileChange}
                className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors">
            <MdSave className="mr-2" /> Save Changes
          </button>
        </form>

        {/* Password Update */}
        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center"><MdLock className="mr-2" /> Change Password</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="current"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => togglePassword('current')}
              >
                {showPassword.current ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="new"
                value={passwordForm.new}
                onChange={handlePasswordChange}
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => togglePassword('new')}
              >
                {showPassword.new ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirm"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => togglePassword('confirm')}
              >
                {showPassword.confirm ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors">
            <MdSave className="mr-2" /> Update Password
          </button>
        </form>

        {/* Delete Account */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-red-600"><MdDelete className="mr-2" /> Danger Zone</h2>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-red-700 transition-colors"
            onClick={handleDeleteAccount}
          >
            <MdDelete className="mr-2" /> Delete Account
          </button>
        </div>
      </div>
    </Layout>
  );
}