// src/components/GoogleAuthButton.jsx
import React, { useEffect, useRef } from 'react';

const GoogleAuthButton = ({ text = 'Continue with Google', onSuccess }) => {
  const buttonDiv = useRef(null);
  useEffect(() => {
    if (window.google && buttonDiv.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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
    }
  }, [onSuccess, text]);
  return <div ref={buttonDiv} />;
};
export default GoogleAuthButton;
