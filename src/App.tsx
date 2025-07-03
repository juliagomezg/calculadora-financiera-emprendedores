import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BreakEvenCalculator from './components/calculators/BreakEvenCalculator';
import ROICalculator from './components/calculators/ROICalculator';
import UnitCostCalculator from './components/calculators/UnitCostCalculator';
import ProfitCalculator from './components/calculators/ProfitCalculator';
import Dashboard from './components/Dashboard';

function App() {
  const [activeCalculator, setActiveCalculator] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobile-sidebar');
        const target = event.target as Node;
        
        if (sidebar && !sidebar.contains(target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

  const handleCalculatorChange = (calculatorType: string) => {
    setActiveCalculator(calculatorType);
    setIsSidebarOpen(false);
  };

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'break-even':
        return <BreakEvenCalculator />;
      case 'roi':
        return <ROICalculator />;
      case 'unit-cost':
        return <UnitCostCalculator />;
      case 'profit':
        return <ProfitCalculator />;
      default:
        return <Dashboard onCalculatorChange={handleCalculatorChange} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-blue-50 to-purple-50 safe-area-inset-all">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        
        <div className="responsive-container py-3 sm:py-4 md:py-6 lg:py-8">
          <div className="calculator-grid relative">
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
                aria-hidden="true"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div 
              id="mobile-sidebar"
              className={`
                lg:block lg:relative lg:z-auto
                ${isSidebarOpen 
                  ? 'fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white shadow-xl animate-slide-in-left overflow-y-auto mobile-scroll' 
                  : 'hidden'
                }
              `}
            >
              <div className="h-full p-3 sm:p-4 lg:p-0">
                <Sidebar 
                  activeCalculator={activeCalculator} 
                  setActiveCalculator={handleCalculatorChange}
                  isMobile={window.innerWidth < 1024}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            </div>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <div className="responsive-card min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] transition-all duration-300 ease-in-out">
                <div className="h-full overflow-y-auto mobile-scroll">
                  {renderCalculator()}
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="responsive-container py-3 sm:py-4 md:py-6 text-center text-gray-500 text-xs sm:text-sm safe-area-inset-bottom">
          <div className="border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
            <p>© 2025 Mi Primera Calculadora Financiera</p>
            <p className="mt-1 text-xs text-gray-400">
              Hecho con ❤️ por Julia Gómez
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;