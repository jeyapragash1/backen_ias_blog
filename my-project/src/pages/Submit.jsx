// src/pages/Submit.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Submit = () => {
  const googleFormLink = "YOUR_GOOGLE_FORM_LINK_HERE";

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold mb-4">Share Your Voice</h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Become a contributor to the IAS UWU Blog. We welcome original articles, research insights, and thought-provoking opinions from students of all faculties.
          </p>
        </motion.div>
      
        <motion.div 
          className="bg-gray-50 p-8 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-dark-text">Submission Guidelines</h2>
          <ul className="list-disc list-inside text-left mx-auto max-w-lg space-y-3 text-light-text">
            <li><strong>Originality:</strong> Articles must be your original work and not published elsewhere.</li>
            <li><strong>Citations:</strong> Properly cite all sources, data, and images used. Plagiarism will not be tolerated.</li>
            <li><strong>Content:</strong> Submissions should be technical, insightful, or a well-formed opinion relevant to IT or non-IT fields of study.</li>
            <li><strong>Review:</strong> All submissions will be reviewed by our editorial team before publication.</li>
            <li><strong>Rewards:</strong> Special recognition and rewards will be given for the best articles during our launch month!</li>
          </ul>
          <div className="text-center">
            <a 
              href={googleFormLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-10 bg-[#00A39C] text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-teal-700 transition-colors transform hover:scale-105"
            >
              Go to Submission Form
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Submit;