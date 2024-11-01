import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { clearUserInfo } from '../store/slice/Authslice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu, X } from 'lucide-react';
import Logo from './Logocomponent';
import {useLogoutMutation} from "../store/slice/Userapislice"

interface HeaderProps {
  onAccountClick: () => void;
  footerRef: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({ onAccountClick, footerRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = async() => {
    await logout().unwrap()
    console.log('User logged out');
    localStorage.removeItem('userInfo');
    dispatch(clearUserInfo());
    toast.success("Logged out successfully!");
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <div className="h-12">
            <Logo />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4">
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
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
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
                href="/contact-us"
                onClick={handleContactClick}
                className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
              >
                Contact Us
              </a>
              {userInfo ? (
                <>
                  <div className="text-gray-800 font-semibold">
                    Welcome, {userInfo?.user?.username || userInfo?.username}
                  </div>
                  <a
                    href="/profile"
                    className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onAccountClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-800 font-semibold hover:text-gray-600 transition-colors duration-300"
                >
                  My Account
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;