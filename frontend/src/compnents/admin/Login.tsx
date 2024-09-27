import React, { ChangeEvent, useState } from 'react';
import { validateInput, FormErrors, isFormEmpty } from '../../validationpages/validation'; // Adjust import path as needed
import { useAdminloginMutation } from '../../store/slice/Userapislice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate()
  const [adminlogin] = useAdminloginMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    const formErrors: FormErrors = {
      email: validateInput('email', email),
      password: validateInput('password', password),
    };

    if (isFormEmpty({ email, password })) {
      formErrors.global = "All fields are required.";
    }

    setErrors(formErrors);

    
    if (!Object.values(formErrors).some(error => error !== "")) {
      setIsSubmitting(true); 
      try {
        const res = await adminlogin({ email, password }).unwrap();
        console.log("the res from the backend ",res);
        
        if (res.success) {
          console.log("The admin has been logged in successfully",res.success);
          localStorage.setItem("adminToken",res.admin)
          navigate('/admin/dashboard')
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally { 
        setIsSubmitting(false); 
      }
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '24px'
      }}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.email ? '#dc3545' : '#ccc'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          {errors.email && <p style={{ color: '#dc3545', marginTop: '5px' }}>{errors.email}</p>}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"

            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.password ? '#dc3545' : '#ccc'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          {errors.password && <p style={{ color: '#dc3545', marginTop: '5px' }}>{errors.password}</p>}
        </div>
        {errors.global && <p style={{ color: '#dc3545', marginBottom: '15px' }}>{errors.global}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
