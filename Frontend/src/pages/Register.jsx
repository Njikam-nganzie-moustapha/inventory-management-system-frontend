import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { MdFileUpload } from 'react-icons/md';



const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

export default function Register() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      agreeTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('agree_terms', values.agreeTerms ? 1 : 0);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Si un fichier image est sélectionné, l'ajouter
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      try {
        const response = await axios.post('http://localhost:8000/api/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Registration successful:', response.data);
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        // Afficher une alerte plus informative
        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
          alert(`Registration failed:\n${errorMessages}`);
        } else {
          alert('Registration failed: ' + (error.response?.data?.message || error.message));
        }
      }
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img className="mx-auto h-12 w-auto" src="/clipboard-logo.svg" alt="Your Company" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4 rounded-md shadow-sm">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="w-full rounded-md border p-2"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full rounded-md border p-2"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full rounded-md border p-2"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}

            <div>
              <label htmlFor="profileImage" className="cursor-pointer inline-block py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300">
                <MdFileUpload className="inline-block" /> <span>Choose Profile picture</span>
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              {profileImage && <p className="text-sm mt-1">{profileImage.name}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.agreeTerms}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="agreeTerms" className="text-sm">
                I agree to the terms and conditions
              </label>
            </div>
            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
              <p className="text-red-500 text-sm">{formik.errors.agreeTerms}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500">
            Sign up
          </button>

          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign in now
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden sm:block h-full w-full bg-blue-50">
        <div className="flex h-full items-center justify-center p-6">
          <img src="./public/login_image.jpg" alt="Registration" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
}