import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { clearUserInfo } from '../store/slice/Authslice';
import Logo from '/photo_2024-08-05_19-22-46.jpg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface HeaderProps {
  onAccountClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAccountClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  console.log(userInfo, '76r76r6r76r');

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('userInfo');
    dispatch(clearUserInfo());
    toast.success("Loggged out successfully!")
  };
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (userInfo) {
      navigate('/'); 
    } else {
      navigate('/'); 
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <img src={Logo} alt="Gas Cylinder Logo" className="h-12" />
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
          <a
            href="/track-order"
            className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
          >
            Track Order
          </a>
          <a
            href="/contact-us"
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
