// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold">Our Vision</h1>
          <p className="text-lg text-light-text mt-4">More than just a blog—we're a community of innovators.</p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-50 p-8 rounded-lg border leading-relaxed space-y-6 text-lg text-light-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p>
            The <strong>IAS UWU Blog</strong> is a student-driven initiative by the IEEE Industry Applications Society Chapter at Uva Wellassa University. Our mission is to create a dynamic, inclusive, and high-impact platform for knowledge sharing and professional development.
          </p>
          <p>
            We aim to showcase original articles, research insights, and well-formed opinions from students across all faculties, bridging the gap between IT and non-IT disciplines. This blog serves as a hub where innovative ideas are born, technical skills are shared, and the next generation of leaders can build their professional portfolio.
          </p>
          <p>
            Through this platform, we empower students to share their voice, engage in meaningful discussions, and contribute to a vibrant culture of collaboration and excellence at our university.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;