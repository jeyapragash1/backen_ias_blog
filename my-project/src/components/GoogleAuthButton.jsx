// src/components/GoogleAuthButton.jsx
import React, { useEffect, useRef } from 'react';

const GoogleAuthButton = ({ text = 'Continue with Google', onSuccess }) => {
  const buttonDiv = useRef(null);
  
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Skip if no client ID is configured
    if (!googleClientId) {
      console.warn('Google Client ID not configured');
      return;
    }
    
    if (window.google && buttonDiv.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (onSuccess) onSuccess(response.credential);
          },
        });
        window.google.accounts.id.renderButton(buttonDiv.current, {
          theme: 'outline',
          size: 'large',
          text: text === 'signup' ? 'signup_with' : 'signin_with',
          width: 260,
        });
      } catch (error) {
        console.error('Google Auth initialization failed:', error);
      }
    }
  }, [onSuccess, text]);
  
  return <div ref={buttonDiv} />;
};

export default GoogleAuthButton;
