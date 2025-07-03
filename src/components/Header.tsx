import React from 'react';
import { Calculator, Menu, X } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 safe-area-inset-top">
      <div className="responsive-container">
        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden touch-target p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>

          {/* Logo and title - responsive layout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:flex-none justify-center lg:justify-start">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Calculator className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 leading-tight">
                <span className="hidden xs:inline sm:hidden md:inline">Mi Primera Calculadora</span>
                <span className="xs:hidden sm:inline md:hidden">Calculadora</span>
                <span className="sm:hidden">Calc</span>
              </h1>
              <p className="text-xs sm:text-sm text-blue-600 hidden sm:block lg:block leading-tight">
                <span className="hidden md:inline">¡Aprende finanzas mientras juegas!</span>
                <span className="md:hidden">¡Aprende finanzas!</span>
              </p>
            </div>
          </div>

          {/* Balance space for mobile layout */}
          <div className="w-8 sm:w-10 lg:hidden"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;