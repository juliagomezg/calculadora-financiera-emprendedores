import React, { useState } from 'react';
import { Key, Shield, Database, CheckCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';

const GoogleCredentialsSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const steps = [
    {
      id: 1,
      title: 'Crear Proyecto en Google Cloud',
      icon: <Shield className="w-6 h-6" />,
      description: 'Configura tu proyecto y habilita las APIs necesarias'
    },
    {
      id: 2,
      title: 'Obtener API Key',
      icon: <Key className="w-6 h-6" />,
      description: 'Crea una clave de API para acceder a Google Sheets'
    },
    {
      id: 3,
      title: 'Crear OAuth Client ID',
      icon: <Shield className="w-6 h-6" />,
      description: 'Configura la autenticación de usuarios'
    },
    {
      id: 4,
      title: 'Configurar Google Sheets',
      icon: <Database className="w-6 h-6" />,
      description: 'Crea la hoja de cálculo para almacenar datos'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testConnection = async () => {
    if (!apiKey || !clientId || !spreadsheetId) {
      setConnectionStatus('error');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Test API Key by trying to access the spreadsheet
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`
      );

      if (response.ok) {
        // Save to localStorage
        localStorage.setItem('google_api_key', apiKey);
        localStorage.setItem('google_client_id', clientId);
        localStorage.setItem('google_spreadsheet_id', spreadsheetId);
        
        setConnectionStatus('success');
      } else {
        throw new Error('Failed to access spreadsheet');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const openGoogleCloudConsole = () => {
    window.open('https://console.cloud.google.com/', '_blank');
  };

  const openSheetsTemplate = () => {
    window.open('https://docs.google.com/spreadsheets/create', '_blank');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Google Cloud Console
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-blue-800">Crear Proyecto</p>
                    <p className="text-blue-700 text-sm">Ve a Google Cloud Console y crea un nuevo proyecto</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-blue-800">Habilitar APIs</p>
                    <p className="text-blue-700 text-sm">Habilita Google Sheets API y Google Drive API</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-blue-800">Configurar Credenciales</p>
                    <p className="text-blue-700 text-sm">Crea API Key y OAuth 2.0 Client ID</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={openGoogleCloudConsole}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir Google Cloud Console
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Importante</p>
                  <p className="text-yellow-700 text-sm">Asegúrate de habilitar tanto Google Sheets API como Google Drive API en tu proyecto.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Crear API Key
              </h4>
              
              <div className="space-y-4">
                <div className="text-sm text-green-700">
                  <p className="mb-2">En Google Cloud Console:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Ve a "APIs y servicios" → "Credenciales"</li>
                    <li>Haz clic en "+ CREAR CREDENCIALES"</li>
                    <li>Selecciona "Clave de API"</li>
                    <li>Copia la clave generada</li>
                    <li>Restringe la clave a Google Sheets API y Google Drive API</li>
                  </ol>
                </div>
              </div>
            </div>

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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Crear OAuth 2.0 Client ID
              </h4>
              
              <div className="space-y-4">
                <div className="text-sm text-purple-700">
                  <p className="mb-2">En Google Cloud Console:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Ve a "APIs y servicios" → "Pantalla de consentimiento de OAuth"</li>
                    <li>Configura la información básica de tu aplicación</li>
                    <li>Ve a "Credenciales" → "+ CREAR CREDENCIALES"</li>
                    <li>Selecciona "ID de cliente de OAuth 2.0"</li>
                    <li>Selecciona "Aplicación web"</li>
                    <li>Agrega tus dominios autorizados</li>
                  </ol>
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Dominios Autorizados</p>
                  <p className="text-yellow-700 text-sm">Asegúrate de agregar estos dominios:</p>
                  <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                    <li>• http://localhost:5173</li>
                    <li>• https://tu-dominio.com</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Configurar Google Sheets
              </h4>
              
              <div className="space-y-4">
                <div className="text-sm text-orange-700">
                  <p className="mb-2">Crea una hoja de cálculo con estas pestañas:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>UserSessions</li>
                    <li>CalculatorUsage</li>
                    <li>UserBehaviors</li>
                    <li>UserFeedback</li>
                    <li>SessionUpdates</li>
                  </ul>
                </div>
                
                <button
                  onClick={openSheetsTemplate}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Crear Hoja de Cálculo
                </button>
              </div>
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
                Copia el ID desde la URL de tu hoja de cálculo (la parte entre /d/ y /edit)
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={testConnection}
                disabled={!apiKey || !clientId || !spreadsheetId || isTestingConnection}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Probando conexión...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Probar y Guardar Configuración
                  </>
                )}
              </button>

              {connectionStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">¡Conexión exitosa!</p>
                      <p className="text-green-700 text-sm">Tu configuración se ha guardado correctamente.</p>
                    </div>
                  </div>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Error de conexión</p>
                      <p className="text-red-700 text-sm">Verifica tus credenciales e intenta de nuevo.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Configuración de Credenciales de Google</h2>
          <p className="text-blue-100">Configura tu acceso a Google Drive Analytics paso a paso</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-24">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Paso {currentStep}: {steps[currentStep - 1].title}
          </h3>
          
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                disabled={connectionStatus !== 'success'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-800 mb-3">¿Necesitas ayuda?</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• Asegúrate de habilitar las APIs antes de crear las credenciales</p>
          <p>• Verifica que los dominios estén correctamente configurados</p>
          <p>• Si tienes errores, revisa la consola del navegador</p>
          <p>• Consulta la guía completa en el archivo GUIA_CREDENCIALES_GOOGLE.md</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCredentialsSetup;