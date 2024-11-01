import React from 'react';
import { FaTruck, FaPercent, FaCheckCircle, FaEdit, FaInstagram, FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import LottieAnimation from './LootieAnimation';
import truckAnimationData from '../Animation/Animation - 1724130057483.json';

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => (
  <footer
    ref={ref}
    className="bg-dark text-light py-4 w-100"
    style={{
      position: 'relative',
      overflow: 'hidden'
    }}
    {...props}
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
      <div className="row gy-4">
        <div className="col-12 col-md-4">
          <h6 className="text-white border-bottom pb-2 mb-3">About Us</h6>
          <ul className="list-unstyled mb-0">
            <li className="mb-2"><a href="#" className="text-white text-decoration-none">FAQ</a></li>
            <li className="mb-2"><a href="#" className="text-white text-decoration-none">Careers</a></li>
            <li className="mb-2"><a href="#" className="text-white text-decoration-none">Subscribe</a></li>
          </ul>
        </div>
        
        <div className="col-12 col-md-4">
          <h6 className="text-white border-bottom pb-2 mb-3">Contact Us</h6>
          <ul className="list-unstyled mb-0">
            <li className="mb-2">+91 9192349808</li>
            <li className="mb-2">+91 8129112776</li>
            <li className="mb-2">ecogas@gmail.com</li>
            <li className="mb-2">
              <a href="https://twitter.com/ecogas" className="text-white text-decoration-none">
                https://twitter.com/ecogas
              </a>
            </li>
          </ul>
        </div>
        
        <div className="col-12 col-md-4">
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <a href="#" className="text-white text-decoration-none d-flex align-items-center">
                <FaTruck className="me-2" /> Track Order
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-white text-decoration-none d-flex align-items-center">
                <FaPercent className="me-2" /> Offers
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-white text-decoration-none d-flex align-items-center">
                <FaCheckCircle className="me-2" /> Verified
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-white text-decoration-none d-flex align-items-center">
                <FaEdit className="me-2" /> Feedback
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="truck-animation d-none d-md-block my-4" style={{ width: '100%', pointerEvents: 'none' }}>
        <LottieAnimation animationData={truckAnimationData} width="100%" height="120px" />
      </div>

      <div className="row border-top border-secondary pt-3">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h6 className="text-white mb-3">Follow Us</h6>
          <ul className="list-inline mb-0">
            <li className="list-inline-item me-3">
              <a href="#" className="text-white">
                <FaInstagram size={20} />
              </a>
            </li>
            <li className="list-inline-item me-3">
              <a href="#" className="text-white">
                <FaWhatsapp size={20} />
              </a>
            </li>
            <li className="list-inline-item me-3">
              <a href="#" className="text-white">
                <FaFacebookF size={20} />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="#" className="text-white">
                <FaTwitter size={20} />
              </a>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-6 text-center text-md-end">
          <p className="mb-0" style={{ fontSize: '0.85rem' }}>
            &copy; 2023, Thashreef Khan S, EcoGas
          </p>
        </div>
      </div>
    </div>
  </footer>
));

export default Footer;