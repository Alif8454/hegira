/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, LogOut, UserCircle } from 'lucide-react'; 
import { PageName } from '../HegraApp'; 

interface NavbarProps {
  onNavigate: (page: PageName) => void;
  currentPage: PageName;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, isLoggedIn, onLogout, onOpenLoginModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Beranda', target: 'landing' as PageName },
    { name: 'Event', target: 'events' as PageName },
    // { name: 'Business Matching', target: 'business' as PageName }, // Removed
  ];

  const handleLinkClick = (target: PageName) => {
    onNavigate(target);
    setIsMobileMenuOpen(false); 
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      onNavigate('dashboard');
    } else {
      onOpenLoginModal();
    }
    setIsMobileMenuOpen(false);
  };
  
  const handleLogoutClick = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  }

  // Navbar colors & styles
  const navbarBgColor = 'bg-hegra-white'; 
  const navbarBorderColor = 'border-b border-hegra-turquoise/10'; // Updated border color
  const logoTextColor = 'text-hegra-turquoise'; // Green logo
  
  const mobileIconColor = `text-hegra-deep-navy hover:bg-gray-100`; 
  const mobileMenuBorderColor = 'border-hegra-chino';

  // Login/Logout button styles (pill shape, outline with light green bg)
  const authButtonStyles = `bg-hegra-turquoise/10 text-hegra-turquoise border border-hegra-turquoise px-5 py-2.5 rounded-full text-sm font-semibold 
                            hover:bg-hegra-turquoise/20 transition-colors flex items-center justify-center gap-2`;

  // Base style for navigation links (desktop)
  const desktopNavLinkBaseClasses = "relative px-3 py-2 text-sm transition-colors"; // removed rounded-full from base
  // Base style for navigation links (mobile)
  const mobileNavLinkBaseClasses = "block w-full text-left px-4 py-3 text-base transition-colors"; // removed rounded-full from base


  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out 
                     ${navbarBgColor} ${navbarBorderColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => handleLinkClick('landing')} aria-label="Hegra Beranda" className="focus:outline-none">
              <Logo 
                className={`font-bold italic text-2xl h-9 sm:h-10 w-auto transition-colors duration-300 ${logoTextColor}`} 
                useGradient={false} 
              />
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleLinkClick(item.target)}
                className={`${desktopNavLinkBaseClasses} ${
                  (currentPage === item.target && !(isLoggedIn && currentPage === 'dashboard'))
                    ? 'font-semibold text-hegra-turquoise bg-hegra-turquoise/10 rounded-full' // Active
                    : 'font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise' // Default + Hover (no background on hover)
                }`}
                aria-current={(currentPage === item.target && !(isLoggedIn && currentPage === 'dashboard')) ? 'page' : undefined}
                aria-label={item.name}
              >
                {item.name}
              </button>
            ))}
             {isLoggedIn && (
                <button
                onClick={() => handleLinkClick('dashboard')}
                className={`${desktopNavLinkBaseClasses} ${
                  currentPage === 'dashboard'
                    ? 'font-semibold text-hegra-turquoise bg-hegra-turquoise/10 rounded-full' // Active
                    : 'font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise' // Default + Hover (no background on hover)
                }`}
                aria-current={currentPage === 'dashboard' ? 'page' : undefined}
                >
                Dashboard
                </button>
            )}
          </div>

          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogoutClick}
                className={authButtonStyles}
                aria-label="Logout"
              >
                <LogOut size={16} className="text-hegra-turquoise" /> Logout
              </button>
            ) : (
              <button
                onClick={handleAuthAction}
                className={authButtonStyles}
                aria-label="Login atau Masuk"
              >
                 <UserCircle size={18} className="text-hegra-turquoise" /> Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors
                          ${mobileIconColor}`}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              {isMobileMenuOpen ? <X className="block h-7 w-7" /> : <Menu className="block h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-0 inset-x-0 min-h-screen ${navbarBgColor}/95 backdrop-blur-lg p-4 pt-20 space-y-2 sm:px-6 z-[-1] flex flex-col animate-fade-in`} id="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLinkClick(item.target)}
              className={`${mobileNavLinkBaseClasses} ${
                  (currentPage === item.target && !(isLoggedIn && currentPage === 'dashboard'))
                    ? 'font-semibold text-hegra-turquoise bg-hegra-turquoise/10 rounded-full' // Active
                    : 'font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise' // Default + Hover (no background on hover)
                }`}
              aria-current={(currentPage === item.target && !(isLoggedIn && currentPage === 'dashboard')) ? 'page' : undefined}
            >
              {item.name}
            </button>
          ))}
           {isLoggedIn && (
                <button
                onClick={() => handleLinkClick('dashboard')}
                className={`${mobileNavLinkBaseClasses} ${
                  currentPage === 'dashboard'
                    ? 'font-semibold text-hegra-turquoise bg-hegra-turquoise/10 rounded-full' // Active
                    : 'font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise' // Default + Hover (no background on hover)
                }`}
                aria-current={currentPage === 'dashboard' ? 'page' : undefined}
                >
                Dashboard
                </button>
            )}
          <div className={`pt-4 pb-3 border-t ${mobileMenuBorderColor} space-y-4`}>
            {isLoggedIn ? (
               <button
                onClick={handleLogoutClick}
                className={`w-full text-center ${authButtonStyles} py-3`}
                aria-label="Logout"
              >
                 <LogOut size={16} className="text-hegra-turquoise" /> Logout
              </button>
            ) : (
              <button
                onClick={handleAuthAction}
                className={`w-full text-center ${authButtonStyles} py-3`}
                aria-label="Login atau Masuk"
              >
                <UserCircle size={18} className="text-hegra-turquoise" /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;