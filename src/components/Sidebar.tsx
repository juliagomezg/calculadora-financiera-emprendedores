import React from 'react';
import { Calculator, TrendingUp, DollarSign, Percent, BarChart3, X } from 'lucide-react';

type SidebarProps = {
  activeCalculator: string;
  setActiveCalculator: (calculator: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ activeCalculator, setActiveCalculator, isMobile = false, onClose }: SidebarProps) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Inicio', 
      shortLabel: 'Inicio',
      mobileLabel: 'Inicio',
      icon: <BarChart3 size={16} className="sm:w-[18px] sm:h-[18px]" />,
      description: 'Vista general',
      difficulty: '',
      concept: ''
    },
    { 
      id: 'profit', 
      label: '💰 ¿Cuánto Gano?', 
      shortLabel: 'Ganancias',
      mobileLabel: 'Ganancias',
      icon: <Percent size={16} className="sm:w-[18px] sm:h-[18px]" />,
      description: 'Aprende: Utilidad y Margen',
      difficulty: '🌱 Fácil',
      concept: 'Utilidad y Margen de Ganancia'
    },
    { 
      id: 'unit-cost', 
      label: '🏷️ ¿Cuánto Me Cuesta?', 
      shortLabel: 'Costos',
      mobileLabel: 'Costos',
      icon: <DollarSign size={16} className="sm:w-[18px] sm:h-[18px]" />,
      description: 'Aprende: Costo Unitario',
      difficulty: '🌱 Fácil',
      concept: 'Costo Unitario y Estructura de Costos'
    },
    { 
      id: 'break-even', 
      label: '⚖️ ¿Cuándo No Pierdo?', 
      shortLabel: 'Equilibrio',
      mobileLabel: 'Equilibrio',
      icon: <Calculator size={16} className="sm:w-[18px] sm:h-[18px]" />,
      description: 'Aprende: Punto de Equilibrio',
      difficulty: '🌿 Intermedio',
      concept: 'Punto de Equilibrio (Break-Even)'
    },
    { 
      id: 'roi', 
      label: '📈 ¿Crece Mi Dinero?', 
      shortLabel: 'ROI',
      mobileLabel: 'ROI',
      icon: <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />,
      description: 'Aprende: ROI',
      difficulty: '🌳 Avanzado',
      concept: 'ROI (Retorno de Inversión)'
    }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveCalculator(itemId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className="sidebar-responsive">
      <div className="responsive-card-sm">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Calculadoras</h2>
            <button
              onClick={onClose}
              className="touch-target-sm p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Desktop header */}
        {!isMobile && (
          <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 mb-3 sm:mb-4 px-1 sm:px-2">
            Calculadoras
          </h2>
        )}

        <nav>
          <ul className="space-y-1 sm:space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3 md:py-2.5 rounded-md sm:rounded-lg transition-all duration-200 text-left touch-target group ${
                    activeCalculator === item.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  aria-current={activeCalculator === item.id ? 'page' : undefined}
                >
                  <span className={`flex-shrink-0 transition-colors ${
                    activeCalculator === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.icon}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm md:text-base font-medium truncate">
                      {/* Mobile: use mobileLabel */}
                      <span className="xs:hidden">{item.mobileLabel}</span>
                      {/* Small screens: use shortLabel */}
                      <span className="hidden xs:inline sm:hidden">{item.shortLabel}</span>
                      {/* Medium screens and up: use full label */}
                      <span className="hidden sm:inline lg:hidden">{item.shortLabel}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 hidden lg:block">
                      {item.description}
                    </div>
                    {item.difficulty && (
                      <div className="text-xs text-blue-600 mt-1 hidden sm:block lg:hidden">
                        {item.difficulty}
                      </div>
                    )}
                    {item.concept && (
                      <div className="text-xs text-purple-600 mt-1 hidden lg:block bg-purple-50 px-2 py-1 rounded-md">
                        📚 {item.concept}
                      </div>
                    )}
                  </div>

                  {/* Active indicator */}
                  {activeCalculator === item.id && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full flex-shrink-0 animate-pulse-soft"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile footer */}
        {isMobile && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm transition-colors touch-target">
                Ayuda
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm transition-colors touch-target">
                Contacto
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;