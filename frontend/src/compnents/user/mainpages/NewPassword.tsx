import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetpasswordMutation } from '../../../store/slice/Userapislice';
import { validateInput } from '../../../validationpages/validation';
import { Eye, EyeOff, Lock } from 'lucide-react';

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetpasswordMutation();
  const { token } = useParams<{ token: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPasswordError = validateInput('password', newPassword);
    const confirmPasswordError = validateInput('password', confirmPassword);

    if (newPasswordError) {
      setErrors((prev) => ({ ...prev, newPassword: newPasswordError }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      return;
    }

    if (confirmPasswordError) {
      setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
      return;
    }

    if (!token) {
      setMessage({ text: 'Invalid or expired token.', type: 'error' });
      return;
    }

    try {
      const res = await resetPassword({ newPassword, token }).unwrap();
      if (res.success) {
        setMessage({ text: 'Password has been reset successfully!', type: 'success' });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error: any) {
      setMessage({ 
        text: error.data?.message || 'An error occurred. Please try again later.', 
        type: 'error' 
      });
    }
  };

  const togglePassword = (field: 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8 transform transition-all duration-300 ease-in-out hover:scale-102">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <h2 className="relative text-xl md:text-2xl font-bold text-white text-center">
              Reset Password
            </h2>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors(prev => ({ ...prev, newPassword: '' }));
                    }}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 focus:ring-2 
                      transition-all duration-200 ease-in-out
                      ${errors.newPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-600 text-sm mt-1 animate-fade-in">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 focus:ring-2 
                      transition-all duration-200 ease-in-out
                      ${errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 animate-fade-in">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div className={`text-sm text-center p-3 rounded-lg animate-fade-in ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent 
                  rounded-lg text-white font-medium text-sm md:text-base
                  transform transition-all duration-200 ease-in-out
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;