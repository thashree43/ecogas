import React, { useState } from 'react';
import { validateInput, FormErrors } from '../../../validationpages/validation';
import { useForgotPasswordMutation } from '../../../store/slice/Userapislice'; // Assuming this mutation exists
import { useNavigate } from 'react-router-dom';


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

const Changepassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setEmail(value);
    setErrors({ ...errors, [name]: error });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errors.email) {
      try {
        await forgotPassword( email ).unwrap();
        setMessage('Password reset link sent to your email.');
            navigate("/")
        
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: any) {
        setMessage('An error occurred. Please try again later.');
      }
    } else {
      setMessage('Please enter a valid email.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Forgot Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    className="form-control"
                  />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>
                {message && <p style={errorStyle}>{message}</p>}
                <button type="submit" style={buttonStyle} className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
