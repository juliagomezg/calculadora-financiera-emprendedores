import React, { useState } from 'react';
import { MessageSquare, Star, Send, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { useGoogleDriveAnalytics } from '../hooks/useGoogleDriveAnalytics';

interface UserFeedbackProps {
  calculatorType?: string;
  onClose?: () => void;
}

const UserFeedbackGoogleDrive = ({ calculatorType, onClose }: UserFeedbackProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { trackUserFeedback, trackFeatureUsage, trackButtonClick } = useGoogleDriveAnalytics();

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'usability', label: 'Facilidad de uso' },
    { id: 'accuracy', label: 'Precisión de cálculos' },
    { id: 'design', label: 'Diseño' },
    { id: 'feature_request', label: 'Solicitud de función' },
    { id: 'bug', label: 'Reportar error' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await trackUserFeedback({
        calculatorType,
        rating,
        feedback,
        category,
        userAgent: navigator.userAgent,
      });

      await trackFeatureUsage('feedback_submitted', {
        rating,
        category,
        calculatorType,
        feedbackLength: feedback.length,
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setFeedback('');
        setCategory('general');
        onClose?.();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error al enviar el comentario. Se guardó localmente como respaldo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFeedback = async (type: 'positive' | 'negative') => {
    await trackButtonClick(`quick_feedback_${type}`, { calculatorType });
    
    try {
      await trackUserFeedback({
        calculatorType,
        rating: type === 'positive' ? 5 : 1,
        feedback: `Quick feedback: ${type}`,
        category: 'general',
        userAgent: navigator.userAgent,
      });

      await trackFeatureUsage('quick_feedback', { type, calculatorType });
    } catch (error) {
      console.error('Error submitting quick feedback:', error);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col gap-2">
          {/* Quick feedback buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickFeedback('positive')}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Me gusta esta calculadora"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => handleQuickFeedback('negative')}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="No me gusta esta calculadora"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
          
          {/* Main feedback button */}
          <button
            onClick={() => {
              setIsOpen(true);
              trackButtonClick('open_feedback_form', { calculatorType });
            }}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 animate-pulse"
            aria-label="Enviar comentarios detallados"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Gracias!</h3>
            <p className="text-gray-600">Tu comentario se guardó en Google Sheets.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Tu Opinión Importa</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onClose?.();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué te parece esta calculadora?
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuéntanos más (opcional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="¿Qué te gustó? ¿Qué podríamos mejorar? ¿Tienes alguna sugerencia?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y"
                  rows={4}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
              >
                <Send size={16} />
                {isSubmitting ? 'Guardando en Google Sheets...' : 'Enviar Comentario'}
              </button>

              {/* Google Sheets info */}
              <div className="text-center text-xs text-gray-500">
                Los datos se guardan de forma segura en Google Sheets
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserFeedbackGoogleDrive;