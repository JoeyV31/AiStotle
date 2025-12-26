import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { LessonDisplay } from './components/LessonDisplay';
import { analyzeImageWithGemini, LessonContent } from './services/geminiService';
import { COLORS, TYPOGRAPHY } from './constants';

function App() {
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setLesson(null);

    try {
      const result = await analyzeImageWithGemini(file);
      setLesson(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setLesson(null);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.pennBlue} 0%, #023a7a 100%)`,
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            animation: 'fadeIn 0.6s ease-in',
          }}
        >
          <h1
            style={{
              fontFamily: TYPOGRAPHY.heading,
              fontSize: '3rem',
              color: COLORS.white,
              margin: '0 0 0.5rem 0',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            AIstotle
          </h1>
          <p
            style={{
              fontFamily: TYPOGRAPHY.body,
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              fontWeight: 300,
            }}
          >
            Transform your notes into structured lessons with AI-powered OCR
          </p>
        </header>

        {/* Main Content */}
        <main>
          {!lesson ? (
            <InputPanel onImageUpload={handleImageUpload} isProcessing={isProcessing} />
          ) : (
            <div>
              <button
                onClick={handleReset}
                style={{
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: COLORS.pennRed,
                  color: COLORS.white,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '2rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                }}
              >
                ← Upload New Notes
              </button>
              <LessonDisplay lesson={lesson} />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(153, 0, 0, 0.1)',
                border: `2px solid ${COLORS.pennRed}`,
                borderRadius: '12px',
                color: COLORS.pennRed,
                fontFamily: TYPOGRAPHY.body,
                fontSize: '1rem',
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease-in',
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

