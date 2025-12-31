// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Hero = () => (
  <section name="home" className="relative h-screen flex items-center p-4 overflow-hidden bg-slate-800">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471" alt="Students collaborating" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-slate-900/70"></div>
    </div>

    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center z-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center md:text-left"
      >
        <span className="text-lg font-semibold text-[#00A39C]">IAS UWU BLOG LAUNCH</span>
        <h1 className="text-4xl md:text-6xl font-extrabold my-4 leading-tight text-white">Have a Tech Story to Tell?</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-8 mx-auto md:mx-0">
          Get ready to showcase your ideas and insights! The official blog of the IEEE IAS Chapter at Uva Wellassa University is launching soon.
        </p>
        <Link to="competition" smooth={true} duration={500} offset={-80}>
          <button className="bg-[#00A39C] text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-teal-700 transition-colors">
            Join the Competition
          </button>
        </Link>
      </motion.div>
    </div>
  </section>
);
export default Hero;