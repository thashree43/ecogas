import React from 'react';
import { FaTruck, FaPercent, FaCheckCircle, FaEdit, FaInstagram, FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import LottieAnimation from './LootieAnimation';
import truckAnimationData from '../Animation/Animation - 1724130057483.json';

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => (
  <footer
    ref={ref} // Attach ref here
    className="bg-dark text-light py-3"
    style={{
      position: 'relative',
      overflow: 'hidden'
    }}
    {...props} // Pass down additional props
  >
    <div
      className="bg-light"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #ff5c5c, #ffd700, #5bc0de)',
        animation: 'slide 5s linear infinite'
      }}
    />
    <div className="container">
      <div className="row mb-2">
        <div className="col-md-4">
          <h6 className="text-white">About Us</h6>
          <ul className="list-unstyled">
            <li><a href="#" className="text-white">FAQ</a></li>
            <li><a href="#" className="text-white">Careers</a></li>
            <li><a href="#" className="text-white">Subscribe</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6 className="text-white">Contact Us</h6>
          <ul className="list-unstyled">
            <li>+91 9192349808</li>
            <li>+91 8129112776</li>
            <li>ecogas@gmail.com</li>
            <li><a href="https://twitter.com/ecogas" className="text-white">https://twitter.com/ecogas</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <ul className="list-unstyled">
            <li><a href="#" className="text-white d-flex align-items-center"><FaTruck className="me-2" /> Track Order</a></li>
            <li><a href="#" className="text-white d-flex align-items-center"><FaPercent className="me-2" /> Offers</a></li>
            <li><a href="#" className="text-white d-flex align-items-center"><FaCheckCircle className="me-2" /> Verified</a></li>
            <li><a href="#" className="text-white d-flex align-items-center"><FaEdit className="me-2" /> Feedback</a></li>
          </ul>
        </div>
      </div>

      {/* Truck Animation */}
      <div className="truck-animation" style={{ width: '100%', pointerEvents: 'none', marginBottom: '15px' }}>
        <LottieAnimation animationData={truckAnimationData} width="400px" height="120px" />
      </div>

      <div className="d-flex justify-content-between align-items-center border-top border-secondary pt-2">
        <div>
          <h6 className="text-white">Follow Us</h6>
          <ul className="list-inline">
            <li className="list-inline-item me-2"><a href="#" className="text-white"><FaInstagram /></a></li>
            <li className="list-inline-item me-2"><a href="#" className="text-white"><FaWhatsapp /></a></li>
            <li className="list-inline-item me-2"><a href="#" className="text-white"><FaFacebookF /></a></li>
            <li className="list-inline-item"><a href="#" className="text-white"><FaTwitter /></a></li>
          </ul>
        </div>
        <div className="text-center">
          <p style={{ fontSize: '0.85rem' }}>&copy; 2023, Thashreef Khan S, EcoGas</p>
        </div>
      </div>
    </div>
  </footer>
));

export default Footer;
