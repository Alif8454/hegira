/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { PageName } from '../HegraApp';

interface FooterProps {
  onNavigate: (page: PageName) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const quickLinks = [
    { name: 'Tentang Hegra', target: 'landing' as PageName },
    { name: 'Pusat Bantuan', target: 'help' as PageName },
    { name: 'Event Terbaru', target: 'events' as PageName },
    // { name: 'Business Matching', target: 'business' as PageName }, // Removed
  ];

  const legalLinks = [
    { name: 'Syarat & Ketentuan', href: '#' },
    { name: 'Kebijakan Privasi', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ];

  const socialMedia = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Youtube', href: '#', icon: Youtube },
  ];

  return (
    <footer className="bg-hegra-turquoise text-hegra-deep-navy pt-16 pb-8"> {/* Main background updated to solid turquoise, default text remains deep-navy for unstyled elements */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <button 
              onClick={() => onNavigate('landing')} 
              className="inline-block focus:outline-none mb-2" 
              aria-label="Hegra Beranda"
            >
              <Logo className="h-10 w-auto text-hegra-white" useGradient={true} /> {/* Logo text white for contrast */}
            </button>
            <p className="text-sm leading-relaxed text-hegra-white"> {/* Updated: Description text to white */}
              Platform terintegrasi untuk event dan ticketing. Menghubungkan peluang, menciptakan pengalaman.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialMedia.map(social => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Hegra di ${social.name}`}
                  className="text-hegra-white hover:text-hegra-yellow transition-colors duration-300 transform hover:scale-110" // Updated: Social icons White, hover Yellow
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="text-lg font-semibold text-hegra-yellow mb-5">Navigasi</h5> {/* Updated: Headings Yellow */}
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <button 
                    onClick={() => link.target && onNavigate(link.target)} 
                    className="text-sm text-hegra-white hover:underline transition-colors duration-300" /* Updated: Links White */
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h5 className="text-lg font-semibold text-hegra-yellow mb-5">Legal & Bantuan</h5> {/* Updated: Headings Yellow */}
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-hegra-white hover:underline transition-colors duration-300"> {/* Updated: Links White */}
                    {link.name}
                  </a>
                </li>
              ))}
               <li>
                  <button 
                    onClick={() => onNavigate('help')} 
                    className="text-sm text-hegra-white hover:underline transition-colors duration-300" /* Updated: Links White */
                  >
                    FAQ
                  </button>
                </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h5 className="text-lg font-semibold text-hegra-yellow mb-5">Hubungi Kami</h5> {/* Updated: Headings Yellow */}
            <ul className="space-y-3 text-sm text-hegra-white"> {/* Updated: Default text color white for items */}
              <li className="flex items-start">
                <Mail size={18} className="mr-3 mt-1 text-hegra-white flex-shrink-0" /> {/* Updated: Icons White */}
                <a href="mailto:asiakaryalumina@gmail.com" className="hover:underline transition-colors">asiakaryalumina@gmail.com</a> {/* Ensured link text is white */}
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-3 mt-1 text-hegra-white flex-shrink-0" /> {/* Updated: Icons White */}
                <a href="tel:+622112345678" className="hover:underline transition-colors">+62 21 1234 5678</a> {/* Ensured link text is white */}
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-hegra-white flex-shrink-0" /> {/* Updated: Icons White */}
                <span>Jl. Sudirman No.1, Jakarta Pusat, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-hegra-white/30 pt-8 mt-8 text-center text-sm text-hegra-white"> {/* Border White-alpha, copyright text changed to white */}
          <p>&copy; 2025 asia karya lumina. Semua hak cipta dilindungi.</p>
          {/* Removed: <p className="mt-1">Dirancang dengan ❤️ di Indonesia.</p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;