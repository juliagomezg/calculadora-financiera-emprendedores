import React, { useState } from 'react';
import { Send, MessageCircle, Mail, User, MessageSquare } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';

interface ContactFormProps {
  calculatorType: string;
  reportData: any;
}

const ContactForm = ({ calculatorType, reportData }: ContactFormProps) => {
  const [email, setEmail] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { trackReportRequest, trackWhatsAppClick } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Only store contact in database if Supabase is configured
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('contacts')
          .insert([
            { 
              email, 
              business_model: businessModel, 
              message 
            }
          ]);

        if (error) throw error;
      }

      // Track analytics
      trackReportRequest(calculatorType, email);

      // Send email with PDF report (only if Supabase is configured)
      if (isSupabaseConfigured()) {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email,
            calculatorType,
            reportData
          })
        });

        if (!response.ok) throw new Error('Failed to send email');
      }

      setStatus('success');
      setEmail('');
      setBusinessModel('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick();
    const whatsappNumber = '1234567890'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent('¡Hola! Me gustaría recibir asesoría para mi negocio.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="responsive-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
            Recibe tu Reporte
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            {isSupabaseConfigured() 
              ? 'Te enviaremos un análisis detallado de tu negocio'
              : 'Contáctanos para recibir asesoría personalizada'
            }
          </p>
        </div>
        
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 touch-target hover:scale-105 active:scale-95"
          aria-label="Contactar por WhatsApp para asesoría"
        >
          <MessageCircle size={20} aria-hidden="true" />
          <span className="font-medium">Asesoría WhatsApp</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              Correo Electrónico *
            </div>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input-responsive"
            required
            placeholder="tu@email.com"
            aria-describedby="email-help"
          />
          <p id="email-help" className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {isSupabaseConfigured() 
              ? 'Te enviaremos tu reporte personalizado a este correo'
              : 'Te contactaremos a este correo para brindarte asesoría'
            }
          </p>
        </div>

        {/* Business model field */}
        <div>
          <label htmlFor="businessModel" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              Modelo de Negocio
            </div>
          </label>
          <input
            type="text"
            id="businessModel"
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value)}
            className="form-input-responsive"
            placeholder="Ej: Venta de productos artesanales, servicios de consultoría..."
            aria-describedby="business-help"
          />
          <p id="business-help" className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            Cuéntanos brevemente sobre tu negocio o idea
          </p>
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-500" />
              Mensaje (opcional)
            </div>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-input-responsive min-h-[100px] sm:min-h-[120px] resize-y"
            rows={4}
            placeholder="¿Tienes alguna pregunta específica sobre tu negocio? ¿En qué te gustaría que te ayudemos?"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSending || !email}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 rounded-lg text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-target ${
            isSending || !email 
              ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 hover:scale-105 active:scale-95'
          }`}
          aria-describedby="submit-help"
        >
          <Send size={20} aria-hidden="true" />
          <span>
            {isSending 
              ? (isSupabaseConfigured() ? 'Enviando reporte...' : 'Enviando solicitud...') 
              : (isSupabaseConfigured() ? 'Enviar Reporte Gratis' : 'Solicitar Asesoría')
            }
          </span>
        </button>

        {/* Status messages */}
        {status === 'success' && (
          <div className="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in" role="alert">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-medium text-sm sm:text-base">
                  {isSupabaseConfigured() ? '¡Reporte enviado exitosamente!' : '¡Solicitud enviada exitosamente!'}
                </p>
                <p className="text-green-700 text-xs sm:text-sm mt-1">
                  {isSupabaseConfigured() 
                    ? 'Revisa tu correo en los próximos minutos. Si no lo encuentras, revisa tu carpeta de spam.'
                    : 'Te contactaremos pronto para brindarte asesoría personalizada.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg animate-fade-in" role="alert">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-medium text-sm sm:text-base">
                  {isSupabaseConfigured() ? 'Error al enviar el reporte' : 'Error al enviar la solicitud'}
                </p>
                <p className="text-red-700 text-xs sm:text-sm mt-1">
                  Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo o contáctanos por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy notice */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Al enviar este formulario, aceptas recibir información sobre nuestros servicios. 
            <br className="hidden sm:inline" />
            Respetamos tu privacidad y no compartimos tu información con terceros.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;