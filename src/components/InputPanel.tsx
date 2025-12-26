import { useState, useRef } from 'react';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants';

interface InputPanelProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export function InputPanel({ onImageUpload, isProcessing }: InputPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        border: `2px dashed ${dragActive ? COLORS.pennRed : COLORS.pennBlue}`,
        borderRadius: BORDER_RADIUS.lg,
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: isProcessing ? 'wait' : 'pointer',
        backgroundColor: dragActive ? 'rgba(1, 31, 91, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: SHADOWS.md,
        opacity: isProcessing ? 0.6 : 1,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={isProcessing}
      />
      
      {isProcessing ? (
        <>
          <div
            style={{
              width: '60px',
              height: '60px',
              border: `4px solid ${COLORS.lightGray}`,
              borderTopColor: COLORS.pennBlue,
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ 
            fontFamily: TYPOGRAPHY.body, 
            fontSize: '1.1rem', 
            color: COLORS.textSecondary,
            margin: 0,
          }}>
            Analyzing your notes...
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              opacity: 0.7,
            }}
          >
            📸
          </div>
          <h2 style={{
            fontFamily: TYPOGRAPHY.heading,
            fontSize: '1.5rem',
            color: COLORS.pennBlue,
            margin: '0 0 0.5rem 0',
            fontWeight: 600,
          }}>
            Upload Your Notes
          </h2>
          <p style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '1rem',
            color: COLORS.textSecondary,
            margin: '0 0 1rem 0',
          }}>
            Drag and drop an image or click to browse
          </p>
          <p style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '0.875rem',
            color: COLORS.textSecondary,
            margin: 0,
            fontStyle: 'italic',
          }}>
            Supports JPG, PNG, and other image formats
          </p>
        </>
      )}
    </div>
  );
}

