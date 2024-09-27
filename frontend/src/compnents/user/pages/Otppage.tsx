import React, { useState } from 'react';
import Userotp from '../Registerpart/Userotp';
import { useLocation } from 'react-router-dom';

const Otppage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const location = useLocation(); 
  const email = location.state?.email; 
  const handleCloseModal = () => setIsModalOpen(false);



  return (
    <div>
     
      <Userotp isOpen={isModalOpen} onClose={handleCloseModal} email={email} />
    </div>
  );
};

export default Otppage;
