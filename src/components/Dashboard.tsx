import React from 'react';
import { TrendingUp, DollarSign, Percent, Calculator, ArrowRight, Star } from 'lucide-react';

interface DashboardProps {
  onCalculatorChange: (calculatorType: string) => void;
}

const Dashboard = ({ onCalculatorChange }: DashboardProps) => {
  return (
    <div className="space-responsive-y">
      {/* Hero section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
        <div className="animate-bounce-in">
          <h2 className="text-responsive-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
            ¡Bienvenido a tu Primera Calculadora Financiera!
          </h2>
          <p className="text-responsive-sm text-gray-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Aprende a manejar el dinero de tu negocio mientras te diviertes. 
            ¡Descubre cómo ser un empresario exitoso!
          </p>
        </div>
      </div>

      {/* Calculator cards grid */}
      <div className="dashboard-grid">
        <DashboardCard 
          title="💰 ¿Cuánto Gano?" 
          description="Descubre cuánto dinero ganas realmente con tu negocio"
          icon={<span className="text-2xl">💰</span>}
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-purple-200"
          metric="🌱 Fácil • Aprende: Utilidad y Margen"
          color="purple"
          calculatorType="profit"
          onCalculatorChange={onCalculatorChange}
        />
        
        <DashboardCard 
          title="🏷️ ¿Cuánto Me Cuesta?" 
          description="Calcula cuánto te cuesta hacer cada producto"
          icon={<span className="text-2xl">🏷️</span>}
          bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
          metric="🌱 Fácil • Aprende: Costo Unitario"
          color="yellow"
          calculatorType="unit-cost"
          onCalculatorChange={onCalculatorChange}
        />
        
        <DashboardCard 
          title="⚖️ ¿Cuándo No Pierdo?" 
          description="¿Cuánto necesitas vender para que tu negocio funcione? ¡Descúbrelo aquí!"
          icon={<span className="text-2xl">⚖️</span>}
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
          borderColor="border-blue-200"
          metric="🌿 Intermedio • Aprende: Punto de Equilibrio"
          color="blue"
          calculatorType="break-even"
          onCalculatorChange={onCalculatorChange}
        />
        
        <DashboardCard 
          title="📈 ¿Crece Mi Dinero?" 
          description="Aprende a saber si tu dinero está creciendo con tu negocio"
          icon={<span className="text-2xl">📈</span>}
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-green-200"
          metric="🌳 Avanzado • Aprende: ROI"
          color="green"
          calculatorType="roi"
          onCalculatorChange={onCalculatorChange}
        />
      </div>

      {/* How to use section */}
      <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16">
        <div className="responsive-card bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-responsive-lg font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
              ¿Cómo usar tu calculadora?
            </h3>
            <p className="text-responsive-sm text-gray-600">
              Sigue estos sencillos pasos para empezar
            </p>
          </div>
          
          <div className="responsive-grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <StepCard 
                number="1"
                title="Escoge tu calculadora"
                description="Selecciona la herramienta que necesites del menú lateral"
                color="blue"
              />
              
              <StepCard 
                number="2"
                title="Ingresa tus datos"
                description="Completa los campos con la información de tu negocio"
                color="green"
              />
            </div>
            
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <StepCard 
                number="3"
                title="Mira los resultados"
                description="Observa las gráficas y análisis de tu negocio"
                color="yellow"
              />
              
              <StepCard 
                number="4"
                title="Experimenta y aprende"
                description="Cambia los números para ver diferentes escenarios"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features highlight */}
      <div className="mt-6 sm:mt-8 md:mt-12">
        <div className="responsive-grid-3">
          <FeatureCard 
            icon={<Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500" />}
            title="Fácil de usar"
            description="Diseñado especialmente para jóvenes emprendedores"
          />
          
          <FeatureCard 
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />}
            title="Resultados visuales"
            description="Gráficas interactivas que hacen fácil entender"
          />
          
          <FeatureCard 
            icon={<Calculator className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />}
            title="Cálculos precisos"
            description="Matemáticas financieras explicadas de forma simple"
          />
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  metric: string;
  color: string;
  calculatorType: string;
  onCalculatorChange: (calculatorType: string) => void;
}

const DashboardCard = ({ 
  title, 
  description, 
  icon, 
  bgColor, 
  borderColor, 
  metric, 
  color, 
  calculatorType,
  onCalculatorChange 
}: DashboardCardProps) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-600',
    green: 'text-green-600 bg-green-600',
    yellow: 'text-yellow-600 bg-yellow-600',
    purple: 'text-purple-600 bg-purple-600'
  };

  const handleClick = () => {
    onCalculatorChange(calculatorType);
  };

  return (
    <div 
      className={`${bgColor} border ${borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group touch-feedback`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Abrir calculadora de ${title}`}
    >
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-white/80 shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 mb-1 sm:mb-2 group-hover:text-gray-900 transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-2 sm:mb-3 md:mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                {metric}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className={`text-xs sm:text-sm ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]} bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm font-medium group-hover:shadow-md transition-shadow`}>
                ¡Pruébame!
              </span>
              <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]} group-hover:translate-x-1 transition-transform`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  color: string;
}

const StepCard = ({ number, title, description, color }: StepCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200'
  };

  return (
    <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-white rounded-md sm:rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full ${colorClasses[color as keyof typeof colorClasses]} border-2 flex items-center justify-center font-bold text-xs sm:text-sm md:text-base flex-shrink-0`}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-xs sm:text-sm md:text-base text-gray-800 mb-1">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="text-center p-3 sm:p-4 md:p-6 bg-white rounded-md sm:rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 touch-feedback">
      <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg mb-2 sm:mb-3 md:mb-4">
        {icon}
      </div>
      <h4 className="font-medium text-xs sm:text-sm md:text-base text-gray-800 mb-1 sm:mb-2">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default Dashboard;