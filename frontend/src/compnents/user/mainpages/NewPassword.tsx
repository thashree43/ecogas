import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetpasswordMutation } from '../../../store/slice/Userapislice';
import { validateInput } from '../../../validationpages/validation'; // Make sure to uncomment this import line

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [resetPassword] = useResetpasswordMutation();

  const { token } = useParams<{ token: string }>(); 

  console.log('Extracted token from useParams:', token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    const newPasswordError = validateInput('password', newPassword);
    const confirmPasswordError = validateInput('password', confirmPassword);

    if (newPasswordError) {
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: newPasswordError }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Passwords do not match.' }));
      return;
    }

    if (confirmPasswordError) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmPasswordError }));
      return;
    }

    if (!token) {
      setMessage('Invalid or expired token.');
      return;
    }

    try {
      // Ensure both 'newPassword' and 'token' are provided to the mutation
      const res = await resetPassword({ newPassword, token }).unwrap();
      if (res.success) {
        setMessage('Password has been reset successfully.');
        navigate('/');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  // Define the styles here
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const errorStyle: React.CSSProperties = {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '-5px',
    marginBottom: '5px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Reset Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors((prevErrors) => ({ ...prevErrors, newPassword: '' })); // Clear errors on input change
                    }}
                    required
                    style={inputStyle}
                    className="form-control"
                  />
                  {errors.newPassword && <p style={errorStyle}>{errors.newPassword}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' })); // Clear errors on input change
                    }}
                    required
                    style={inputStyle}
                    className="form-control"
                  />
                  {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
                </div>
                {message && <p style={errorStyle}>{message}</p>}
                <button type="submit" style={buttonStyle} className="btn btn-primary">
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
