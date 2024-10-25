import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { clearUserInfo } from '../store/slice/Authslice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface HeaderProps {
  onAccountClick: () => void;
  footerRef: React.RefObject<HTMLDivElement>; // Add footerRef prop
}

const Header: React.FC<HeaderProps> = ({ onAccountClick , footerRef}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('userInfo');
    dispatch(clearUserInfo());
    toast.success("Logged out successfully!")
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
  };
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // Modern Cooking Gas Cylinder Logo Component

  const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      className="h-12"
    >
      <defs>
        {/* New Gradients for Modern Look */}
        <linearGradient id="cylinder-gradient-new" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28B5B5" />
          <stop offset="100%" stopColor="#0A9396" />
        </linearGradient>
        <linearGradient id="flame-gradient-new" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#F77F00" />
        </linearGradient>
        <radialGradient id="glow-gradient-new" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFDD00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFDD00" stopOpacity="0" />
        </radialGradient>
      </defs>
  
      {/* Advanced Gas Cylinder Design */}
      <g transform="translate(60, 20)">
        {/* Cylinder Base */}
        <path
          d="M 30,150 
             h 100 
             q 5,0 5,5 
             v 5 
             h -110 
             v -5 
             q 0,-5 5,-5"
          fill="#0A9396"
        />
  
        {/* Main Cylinder */}
        <path
          d="M 35,50 
             h 90 
             q 10,0 10,10 
             v 90 
             q 0,10 -10,10 
             h -90 
             q -10,0 -10,-10 
             v -90 
             q 0,-10 10,-10"
          fill="url(#cylinder-gradient-new)"
          stroke="#0A9396"
          strokeWidth="2"
        />
  
        {/* Cylinder Top */}
        <path
          d="M 50,40 
             h 60 
             q 5,0 5,5 
             v 5 
             h -70 
             v -5 
             q 0,-5 5,-5"
          fill="#0A9396"
        />
  
        {/* Valve */}
        <path
          d="M 70,30 
             h 20 
             q 5,0 5,5 
             v 5 
             h -30 
             v -5 
             q 0,-5 5,-5"
          fill="#0A9396"
        />
  
        {/* Glow Effect */}
        <circle
          cx="80"
          cy="20"
          r="20"
          fill="url(#glow-gradient-new)"
        />
  
        {/* Flame */}
        <path
          d="M 70,10 
             q 10,-20 20,0 
             q 5,10 -10,20 
             q -15,-10 -10,-20"
          fill="url(#flame-gradient-new)"
        />
  
        {/* Cylinder Details */}
        <path
          d="M 40,70 h 80"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <path
          d="M 40,110 h 80"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>
  
      {/* Text "ECOGAS" */}
      <g transform="translate(180, 20)">
        <text 
          x="80"
          y="90"
          textAnchor="middle"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '48px',
            letterSpacing: '2px',
          }}
          fill="#0A9396"
        >
          ECO
        </text>
        <text 
          x="80"
          y="140"
          textAnchor="middle"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '48px',
            letterSpacing: '2px',
          }}
          fill="#28B5B5"
        >
          GAS
        </text>
  
        {/* Leaf for Eco-Friendly Theme */}
        <path
          d="M 140,70 
             q 15,-20 30,0 
             q -15,20 -30,0"
          fill="#28B5B5"
          transform="rotate(-30, 140, 70)"
        />
      </g>
    </svg>
  );
  
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <div className="h-12">
          <Logo />
        </div>
        <nav className="flex gap-4">
          <a
            href="/home"
            onClick={handleHomeClick}
            className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="/book-gas"
            className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
          >
            Book Gas
          </a>
          {/* <a
            href="/track-order"
            className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
          >
            Track Order
          </a> */}
          <a
            href="/contact-us"
            onClick={handleContactClick} 
            className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
          >
            Contact Us
          </a>
          <div className="relative">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown();
                onAccountClick();
              }}
              className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
            >
              {userInfo ? `Welcome, ${userInfo?.user?.username || userInfo?.username}` : 'My Account'}
            </a>
            {userInfo && isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
                <a
                  href="/profile"
                  className="block text-gray-800 font-semibold py-2 px-3 hover:bg-gray-100 transition-colors duration-300"
                >
                  Profile
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="block text-gray-800 font-semibold py-2 px-3 hover:bg-gray-100 transition-colors duration-300"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;