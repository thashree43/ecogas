import React, { useState, useEffect } from 'react';
import { FaRegCreditCard, FaMoneyBillAlt, FaPhoneAlt, FaFireExtinguisher } from 'react-icons/fa';
import { IoMdQrScanner } from 'react-icons/io';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../index.css';
import LottieAnimation from '../../../layouts/LootieAnimation';
import animationData from '../../../Animation/Animation - 1724130371624.json';
import entryAnimationData from '../../../Animation/Animation - 1724145569733.json';

const Homepage: React.FC = () => {
  const [isEntryScreenVisible, setIsEntryScreenVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntryScreenVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {isEntryScreenVisible ? (
        <div className="entry-screen">
          <LottieAnimation animationData={entryAnimationData} width="300px" height="300px" />
          <h1>Welcome to EcoGas</h1>
        </div>
      ) : (
        <>
          <main className="flex-grow-1">
            <div className="container text-center my-5 pt-5">
              <h1 className="mb-3">ECOGAS</h1>
              <p className="mb-5">Gas empty? Don't panic! Order your gas cylinder now and experience swift delivery. We value your time. Select your preferred gas type and let us take care of the refill. Easy, fast, and reliable!</p>

              <div className="row g-4 mb-5">
                {/* Lottie Animation */}
                <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                  <LottieAnimation animationData={animationData} width="100%" height="500px" />
                </div>

                {/* Safety Tips Section */}
                <div className="col-12 col-lg-6">
                  <h2 className="mb-3">Safety Tips</h2>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex align-items-center">
                      <FaFireExtinguisher className="me-3" size={30} />
                      <span>Keep a fire extinguisher handy in your kitchen.</span>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <FaFireExtinguisher className="me-3" size={30} />
                      <span>Always turn off the gas cylinder valve when not in use.</span>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <FaFireExtinguisher className="me-3" size={30} />
                      <span>Ensure your kitchen is well-ventilated.</span>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <FaFireExtinguisher className="me-3" size={30} />
                      <span>Regularly check for gas leaks using soapy water.</span>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <FaFireExtinguisher className="me-3" size={30} />
                      <span>Do not use electrical appliances when there's a gas leak.</span>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <FaFireExtinguisher className="me-3" size={30} />
                      <span>Educate family members about gas safety.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="row justify-content-center mb-4">
                <div className="col-12">
                  <div className="d-flex flex-wrap justify-content-center gap-4">
                    <div className="text-center">
                      <IoMdQrScanner size={50} />
                      <p className="mt-2 mb-0">QR Code</p>
                    </div>
                    <div className="text-center">
                      <FaRegCreditCard size={50} />
                      <p className="mt-2 mb-0">Bank Account</p>
                    </div>
                    <div className="text-center">
                      <img 
                        src="/Screenshot 2024-08-19 140501.png" 
                        alt="Gas Cylinder" 
                        className="img-fluid" 
                        style={{ width: '100px', height: '50px', objectFit: 'contain' }} 
                      />
                      <p className="mt-2 mb-0">Pay with a click,<br />Gas at your door.</p>
                    </div>
                    <div className="text-center">
                      <FaMoneyBillAlt size={50} />
                      <p className="mt-2 mb-0">UPI Payment</p>
                    </div>
                    <div className="text-center">
                      <FaRegCreditCard size={50} />
                      <p className="mt-2 mb-0">Credit Card</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center mb-4">
                <div className="col-auto">
                  <div className="text-center emergency-contact">
                    <FaPhoneAlt size={50} className="emergency-icon" />
                    <div className="emergency-details">
                      <p className="emergency-title mb-0">Emergency Contact</p>
                      <p className="emergency-number mb-0">1906</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {['HP Gas', 'Barath Gas', 'Indane Gas', 'Reliance Gas', 'Gujarat Gas', 'Super Gas'].map((gasType) => (
                      <button 
                        key={gasType} 
                        className="btn btn-danger rounded-pill px-4 mb-2"
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
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Homepage;