import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LoginPage from '../compnents/user/registerpart/LoginComponent';
import SignUpPage from '../compnents/user/registerpart/Usersignuppage';



const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // const handleLoginOpen = () => {
  //   setIsLoginOpen(true);
  // };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleRegisterOpen = () => {
    setIsLoginOpen(false); 
    setIsRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setIsRegisterOpen(false);
  };

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleLoginOpen = () => {
    
    if(!userInfo){
      setIsLoginOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onAccountClick={handleLoginOpen} />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
      <LoginPage isOpen={isLoginOpen} onClose={handleLoginClose} onRegisterClick={handleRegisterOpen} />
      <SignUpPage isOpen={isRegisterOpen} onClose={handleRegisterClose} />
    </div>
  );
};

export default Mainlayout;
