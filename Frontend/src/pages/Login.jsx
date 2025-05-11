// src/pages/Login.jsx
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';

// Schéma de validation avec Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("L'e-mail est requis"),
  password: Yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est requis"),
});

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      {/* Illustration */}
      <div className="hidden sm:block h-full w-full bg-blue-50">
        <div className="flex h-full items-center justify-center p-6">
          <img
            src="./public/login_image.jpg"
            alt="Inventory Management"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Formulaire */}
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/clipboard-logo.svg"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <Formik
          initialValues={{ email: '', password: '', rememberMe: false }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              // Appel login qui renvoie { user, token }
              const response = await api.post('/login', {
                email: values.email,
                password: values.password,
              });
              // Stocke le token en localStorage ou sessionStorage
              const token = response.data.token;
              if (values.rememberMe) {
                localStorage.setItem('token', token); // Persistent
                sessionStorage.removeItem('token');
              } else {
                sessionStorage.setItem('token', token); // Session only
                localStorage.removeItem('token');
              }
              // Redirection
              navigate('/dashboard');
            } catch (err) {
              const message = err.response?.data?.message || 'Erreur de connexion';
              setFieldError('password', message);
            }
          }}
        >
          <Form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className="relative w-full rounded-md border-0 py-2 px-1.5 text-gray-900
                             ring-1 ring-inset ring-gray-300 placeholder-gray-400
                             focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                             sm:text-sm sm:leading-6"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  className="relative w-full rounded-md border-0 py-2 px-1.5 text-gray-900
                             ring-1 ring-inset ring-gray-300 placeholder-gray-400
                             focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                             sm:text-sm sm:leading-6"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Field
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600
                           py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Sign in
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or Don’t have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Register now
                </Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
