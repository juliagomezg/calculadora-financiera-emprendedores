import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';

const GoogleDriveSetup = () => {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already configured
    const savedApiKey = localStorage.getItem('google_api_key');
    const savedClientId = localStorage.getItem('google_client_id');
    const savedSpreadsheetId = localStorage.getItem('google_spreadsheet_id');

    if (savedApiKey && savedClientId && savedSpreadsheetId) {
      setApiKey(savedApiKey);
      setClientId(savedClientId);
      setSpreadsheetId(savedSpreadsheetId);
      setIsConnected(true);
      setStep(4);
    }
  }, []);

  const saveConfiguration = () => {
    localStorage.setItem('google_api_key', apiKey);
    localStorage.setItem('google_client_id', clientId);
    localStorage.setItem('google_spreadsheet_id', spreadsheetId);
    
    // Set environment variables (for development)
    if (typeof window !== 'undefined') {
      (window as any).VITE_GOOGLE_API_KEY = apiKey;
      (window as any).VITE_GOOGLE_CLIENT_ID = clientId;
      (window as any).VITE_GOOGLE_SPREADSHEET_ID = spreadsheetId;
    }
    
    setIsConnected(true);
    setStep(4);
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Test the connection by trying to access the spreadsheet
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`
      );
      
      if (response.ok) {
        saveConfiguration();
      } else {
        throw new Error('Failed to connect to Google Sheets');
      }
    } catch (error) {
      alert('Error connecting to Google Sheets. Please check your credentials.');
      console.error('Connection test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSpreadsheetTemplate = () => {
    const templateUrl = 'https://docs.google.com/spreadsheets/d/1234567890/copy';
    window.open(templateUrl, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const steps = [
    {
      title: 'Crear Proyecto en Google Cloud',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Primero necesitas crear un proyecto en Google Cloud Console y habilitar las APIs necesarias.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Pasos a seguir:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>Crea un nuevo proyecto o selecciona uno existente</li>
              <li>Habilita la API de Google Sheets</li>
              <li>Habilita la API de Google Drive</li>
              <li>Ve a "Credenciales" y crea una API Key</li>
              <li>Crea un OAuth 2.0 Client ID para aplicación web</li>
            </ol>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      )
    },
    {
      title: 'Configurar Credenciales',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSyC..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiKey)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Client ID
            </label>
            <div className="relative">
              <input
                type={showClientId ? 'text' : 'password'}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="123456789-abc.apps.googleusercontent.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <button
                  type="button"
                  onClick={() => setShowClientId(!showClientId)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showClientId ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(clientId)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!apiKey || !clientId}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Continuar
          </button>
        </div>
      )
    },
    {
      title: 'Configurar Google Sheets',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Ahora necesitas crear una hoja de cálculo de Google Sheets para almacenar los datos.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Opción 1: Usar plantilla</h4>
            <p className="text-sm text-green-700 mb-3">
              Usa nuestra plantilla prediseñada con todas las hojas necesarias.
            </p>
            <button
              onClick={createSpreadsheetTemplate}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <ExternalLink size={16} />
              Crear desde plantilla
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Opción 2: Crear manualmente</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Crea una nueva hoja de cálculo y añade estas hojas:
            </p>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>UserSessions</li>
              <li>CalculatorUsage</li>
              <li>UserBehaviors</li>
              <li>UserFeedback</li>
              <li>SessionUpdates</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de la Hoja de Cálculo
            </label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes encontrar el ID en la URL de tu hoja de cálculo
            </p>
          </div>

          <button
            onClick={testConnection}
            disabled={!spreadsheetId || isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Probando conexión...' : 'Probar y Guardar'}
          </button>
        </div>
      )
    },
    {
      title: '¡Configuración Completa!',
      content: (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            ¡Google Drive Analytics está configurado!
          </h3>
          <p className="text-gray-600">
            Tu calculadora ahora guardará todos los datos de analytics en Google Sheets.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">¿Qué datos se guardarán?</h4>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1 text-left">
              <li>Sesiones de usuario y tiempo de uso</li>
              <li>Uso de calculadoras y resultados</li>
              <li>Comportamiento del usuario (clics, navegación)</li>
              <li>Feedback y calificaciones</li>
              <li>Errores y problemas técnicos</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Datos en Google Sheets
            </button>
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reconfigurar
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Configuración de Google Drive Analytics</h2>
              <p className="text-blue-100">Conecta tu calculadora con Google Sheets para analytics</p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > stepNumber ? <CheckCircle size={16} /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Paso {step}: {steps[step - 1].title}
          </h3>
          {steps[step - 1].content}
        </div>

        {/* Status indicator */}
        {isConnected && (
          <div className="bg-green-50 border-t border-green-200 p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle size={20} />
              <span className="font-medium">Conectado a Google Drive Analytics</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleDriveSetup;