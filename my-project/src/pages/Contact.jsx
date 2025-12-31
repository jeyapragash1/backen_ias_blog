// src/pages/Contact.jsx
import React from 'react';
const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-8">Get In Touch</h1>
      <p className="text-lg text-light-text">
        For inquiries about article submissions, collaborations, or the IEEE IAS UWU Student Branch, please contact us.
      </p>
      <a href="mailto:ias.uwu@ieee.org" className="text-xl text-ieee-blue font-bold hover:underline mt-4 inline-block">
        ias.uwu@ieee.org
      </a>
    </div>
  );
};
export default Contact;