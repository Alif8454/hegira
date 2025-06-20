/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Logo from '../../components/Logo';
import { X, User, Briefcase } from 'lucide-react';
import { UserRole } from '../../HegraApp';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const handleRoleSelection = (role: UserRole) => {
    onLoginSuccess(role);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      aria-labelledby="login-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-hegra-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors"
          aria-label="Tutup modal login"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <Logo className="h-10 w-auto text-hegra-navy mb-3" />
          <h2 id="login-modal-title" className="text-2xl font-bold text-center">Masuk ke Akun Hegra</h2>
          <p className="text-gray-600 text-center text-sm mt-1">Pilih peran Anda untuk melanjutkan.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('visitor')}
            className="w-full flex items-center justify-center gap-3 bg-hegra-turquoise text-hegra-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hegra-yellow focus:ring-offset-2 shadow-md hover:shadow-lg"
            aria-label="Masuk sebagai Visitor"
          >
            <User size={20} />
            Masuk sebagai Visitor
          </button>
          <button
            onClick={() => handleRoleSelection('creator')}
            className="w-full flex items-center justify-center gap-3 bg-hegra-navy text-hegra-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hegra-yellow focus:ring-offset-2 shadow-md hover:shadow-lg"
            aria-label="Masuk sebagai Event Creator"
          >
            <Briefcase size={20} />
            Masuk sebagai Event Creator
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Belum punya akun? <a href="#" className="text-hegra-turquoise hover:underline">Daftar sekarang</a>.
          <br />
          Dengan melanjutkan, Anda menyetujui <a href="#" className="text-hegra-turquoise hover:underline">Syarat & Ketentuan</a> kami.
        </p>
      </div>
      <style>{`
        @keyframes modal-appear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;