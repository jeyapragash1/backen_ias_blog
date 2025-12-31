// src/components/Vision.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaGlobe } from 'react-icons/fa';

const Vision = () => {
  return (
    <section name="vision" className="py-24 bg-slate-100 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h2 className="text-4xl font-extrabold text-slate-800 mb-6">Our Vision</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    The <strong>IAS UWU Blog</strong> is a student-driven initiative to create a dynamic, inclusive, and high-impact platform for knowledge sharing and professional development.
                </p>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <FaBullseye className="text-2xl text-[#00A39C] mt-1" />
                        <div>
                            <h3 className="font-bold text-slate-800">Our Mission</h3>
                            <p className="text-gray-600">To showcase original articles and research from students across all faculties, bridging disciplines and fostering a culture of excellence.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <FaGlobe className="text-2xl text-[#00A39C] mt-1" />
                        <div>
                            <h3 className="font-bold text-slate-800">International Standard</h3>
                            <p className="text-gray-600">We are committed to maintaining a professional platform that reflects the high standards of IEEE and our global community.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1470" alt="Vision" className="rounded-lg shadow-xl" />
            </motion.div>
        </div>
    </section>
  );
};
export default Vision;