import React, { useState } from 'react';
import Modal from './Registermodal';
import { validateInput, FormErrors } from '../../../validationpages/validation';
import { useLoginMutation, useGoogleregisterMutation } from '../../../store/slice/Userapislice';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../store/slice/Authslice';
import { Link, useNavigate } from 'react-router-dom';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const LoginComponent: React.FC<LoginPageProps> = ({ isOpen, onClose, onRegisterClick }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPost, { isLoading }] = useLoginMutation();
  const [googleregister] = useGoogleregisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateInput(name, value) });
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.email || errors.password) {
      setLoginError('Please correct the highlighted errors.');
      toast.error('Please correct the highlighted errors.');
      return;
    }

    try {
      const user = await loginPost({ email, password }).unwrap();
      dispatch(setUserInfo(user)); // Ensure user object has the token
      localStorage.setItem('userInfo', JSON.stringify(user)); // Store user info including token
      navigate('/');
      onClose();
      toast.success('Successfully logged in!');
    } catch (error: any) {
      setLoginError(error?.data?.message || 'An error occurred during login.');
    }
};

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (token: TokenResponse) => {
      try {
        const response = await googleregister(token.access_token).unwrap();
        dispatch(setUserInfo(response.user));
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        navigate('/');
        onClose();
        toast.success('Successfully logged in with Google!');
      } catch (error: any) {
        setLoginError('Google login failed.');
        toast.error('Google login failed.');
      }
    },
    onError: (error) => {
      console.log('Google login error', error);
      toast.error('Google login error occurred.');
    },
  });

  const handleGoogleButtonClick = () => {
    handleGoogleLogin();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Login">
        <div className="p-8 max-w-md mx-auto space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome Back!</h2>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleButtonClick}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition focus:outline-none"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Icon" className="h-6 w-6" />
              Log in with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Email"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Password"
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Additional Options */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-blue-500 bg-gray-100 border-gray-400 focus:ring-blue-500" />
                <span className="ml-2">Remember me</span>
              </label>
              <Link to="/resetpassword" className="text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign in to your account'}
            </button>

            {/* Display Login Error */}
            {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
          </form>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Don't have an account?{' '}
              <span onClick={onRegisterClick} className="text-blue-500 hover:underline cursor-pointer">
                Sign up here
              </span>
            </p>
          </div>
        </div>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default LoginComponent;
