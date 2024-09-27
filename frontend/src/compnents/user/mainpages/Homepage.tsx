import React, { useState, useEffect } from 'react';
import { FaRegCreditCard, FaMoneyBillAlt, FaPhoneAlt, FaFireExtinguisher } from 'react-icons/fa';
import { IoMdQrScanner } from 'react-icons/io';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../index.css';
import LottieAnimation from '../../../layouts/LootieAnimation'; 
import animationData from '../../../Animation/Animation - 1724130371624.json'; // Ensure this is your animation JSON file
import entryAnimationData from '../../../Animation/Animation - 1724145569733.json'; // Your entry animation JSON file

const Homepage: React.FC = () => {
  const [isEntryScreenVisible, setIsEntryScreenVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntryScreenVisible(false);
    }, 3000); // Entry screen lasts for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isEntryScreenVisible && (
        <div className="entry-screen">
          <LottieAnimation animationData={entryAnimationData} width="300px" height="300px" />
          <h1>Welcome to EcoGas</h1>
        </div>
      )}
      {!isEntryScreenVisible && (
        <div 
          className="container text-center my-5 pt-5"
          style={{
            backgroundImage: 'url("/path-to-gas-animation.gif")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#333'
          }}
        >
          <h1 className="mb-3">ECOGAS</h1>
          <p className="mb-5">Gas empty? Don't panic! Order your gas cylinder now and experience swift delivery.,We value your time. Select your preferred gas type and let us take care of the refill. Easy, fast, and reliable!</p>

          <div className="row">
            {/* Lottie Animation */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <LottieAnimation animationData={animationData} width="500px" height="500px" />
            </div>

            {/* Safety Tips Section */}
            <div className="col-lg-6">
              <h2 className="mb-3">Safety Tips</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center">
                  <FaFireExtinguisher className="me-3" size={30} />
                  Keep a fire extinguisher handy in your kitchen.
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaFireExtinguisher className="me-3" size={30} />
                  Always turn off the gas cylinder valve when not in use.
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaFireExtinguisher className="me-3" size={30} />
                  Ensure your kitchen is well-ventilated.
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaFireExtinguisher className="me-3" size={30} />
                  Regularly check for gas leaks using soapy water.
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaFireExtinguisher className="me-3" size={30} />
                  Do not use electrical appliances when there's a gas leak.
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaFireExtinguisher className="me-3" size={30} />
                  Educate family members about gas safety.
                </li>
              </ul>
            </div>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <div className="mx-3 text-center">
              <IoMdQrScanner size={50} />
              <p>QR Code</p>
            </div>
            <div className="mx-3 text-center">
              <FaRegCreditCard size={50} />
              <p>Bank Account</p>
            </div>
            <div className="mx-3 text-center">
              <img src="/Screenshot 2024-08-19 140501.png" alt="Gas Cylinder" className="img-fluid" style={{ width: '100px' }} />
              <p>Pay with a click,</p>
              <p>Gas at your door.</p>
            </div>
            <div className="mx-3 text-center">
              <FaMoneyBillAlt size={50} />
              <p>UPI Payment</p>
            </div>
            <div className="mx-3 text-center">
              <FaRegCreditCard size={50} />
              <p>Credit Card</p>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div className="text-center emergency-contact">
              <FaPhoneAlt size={50} className="emergency-icon" />
              <div className="emergency-details">
                <p className="emergency-title">Emergency Contact</p>
                <p className="emergency-number">1906</p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-4">
            {['HP Gas', 'Barath Gas', 'Indane Gas', 'Reliance Gas', 'Gujarat Gas', 'Super Gas'].map((gasType) => (
              <button 
                key={gasType} 
                className="btn btn-danger rounded-pill px-4"
                style={{ 
                  backgroundColor: '#ff5c5c', 
                  border: 'none', 
                  color: 'white' 
                }}
              >
                {gasType}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Homepage;
