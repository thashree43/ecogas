import React, { useState } from 'react';
import { validateInput, FormErrors } from '../../../validationpages/validation';
import { useForgotPasswordMutation } from '../../../store/slice/Userapislice';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Changepassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setEmail(value);
    setErrors({ ...errors, [name]: error });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ text: 'Please enter your email address.', type: 'error' });
      return;
    }

    if (!errors.email) {
      try {
        await forgotPassword(email).unwrap();
        setMessage({ 
          text: 'Password reset link has been sent to your email address.', 
          type: 'success' 
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error: any) {
        setMessage({ 
          text: error.data?.message || 'An error occurred. Please try again later.', 
          type: 'error' 
        });
      }
    } else {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white text-center">
              Forgot Password
            </h2>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <form onSubmit={handleResetPassword} noValidate className="space-y-6">
              {/* Email Input Group */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-gray-900 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                      }
                      disabled:bg-gray-100 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div className={`text-sm text-center font-medium ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent 
                  rounded-lg text-white font-medium
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }
                  transition-colors duration-200`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changepassword;