import React, { useState, useEffect } from 'react';
import Modal from './Registermodal';
import { validateInput } from "../../../validationpages/validation";
import { useVerifyOtpMutation, useResendOtpMutation } from '../../../store/slice/Userapislice';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../store/slice/Authslice';

interface UserOtpProps {
  isOpen: boolean; 
  onClose: () => void;
  email: string;  
}

const Userotp: React.FC<UserOtpProps> = ({ isOpen, onClose, email }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(60); 
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (!isOtpExpired) {
      countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setIsOtpExpired(true); // Mark OTP as expired
            setCanResend(true); // Allow resend after expiration
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown); // Clean up interval on component unmount
  }, [isOtpExpired]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setOtp(value);
    const validationError = validateInput('otp', value);
    setError(validationError);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!error && otp) {
      try {
        const response = await verifyOtp({ otp, email }).unwrap(); 
        if (response.success) {
          console.log('userInfo', response);
          dispatch(setUserInfo(response));
          window.location.href = '/';
        } else {
          setError('Invalid OTP. Please try again.');
        }
      } catch (err) {
        console.error('OTP verification failed:', err);
        setError('Verification failed. Please try again.');
      }
    } else {
      console.error('OTP is invalid');
    }
  };

  const handleResendOtp = async () => {
    if (canResend && isOtpExpired) {
      try {
        await resendOtp(email).unwrap(); 
        setResendMessage('OTP has been resent. Please check your email.');
        setCanResend(false); // Prevent immediate resend
        setTimer(60); // Reset timer
        setIsOtpExpired(false); // Reset OTP expiration state
      } catch (err) {
        console.error('Failed to resend OTP:', err);
        setResendMessage('Failed to resend OTP. Please try again.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter OTP">
      <form onSubmit={handleOtpSubmit} style={{ width: '100%' }}>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          required
          style={inputStyle}
          disabled={isOtpExpired} // Disable input if OTP has expired
        />
        {error && <p style={errorStyle}>{error}</p>}
        {isOtpExpired && <p style={errorStyle}>The OTP has expired. Please request a new one.</p>}
        <button type="submit" style={buttonStyle} disabled={isVerifying || isOtpExpired}>
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>
        <div style={resendContainerStyle}>
          <button
            type="button"
            onClick={handleResendOtp}
            style={resendButtonStyle}
            disabled={!canResend || isResending}
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
          {timer > 0 && !isOtpExpired && <p style={resendMessageStyle}>You can resend OTP in {timer}s</p>}
          {resendMessage && <p style={resendMessageStyle}>{resendMessage}</p>}
        </div>
      </form>
    </Modal>
  );
};

// Style objects
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  marginBottom: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  marginBottom: '8px'
};

const resendContainerStyle: React.CSSProperties = {
  marginTop: '16px'
};

const resendButtonStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const resendMessageStyle: React.CSSProperties = {
  marginTop: '8px'
};

export default Userotp;
