// src/components/AboutBlog.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AboutBlog = () => (
<section name="about" className="py-24 bg-[#1E293B] px-4">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-extrabold text-white">Our Vision</h2>
        <p className="text-lg text-gray-400 mt-6 leading-relaxed">
          The <strong>IAS UWU Blog</strong> is a student-driven initiative by the IEEE Industry Applications Society Chapter at Uva Wellassa University. Our mission is to create a dynamic, inclusive, and high-impact platform for knowledge sharing and professional development. We aim to showcase original articles and research from students across all faculties, bridging the gap between disciplines and fostering a vibrant culture of collaboration and excellence.
        </p>
      </motion.div>
    </div>
  </section>
);
export default AboutBlog;