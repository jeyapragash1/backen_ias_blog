// src/components/Contact.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const Contact = () => {
  // IMPORTANT: For the form to work, you need a free account from https://formspree.io/
  // Create a new form, and replace "YOUR_FORM_ID" with your actual form ID.
  const formspreeEndpoint = "https://formspree.io/f/YOUR_FORM_ID";

  return (
    <section name="contact" className="relative py-24 bg-[#030712] px-4 overflow-hidden">
      {/* Aurora background effect */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-[radial-gradient(circle_at_center,_rgba(0,163,156,0.15),_transparent_50%)] animate-pulse" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Get In Touch</h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Have a question, a suggestion, or want to collaborate? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Contact Details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-2xl text-[#00A39C] mt-1" />
              <div>
                <h3 className="font-bold text-white text-xl">General Inquiries</h3>
                <a href="mailto:ias.uwu@ieee.org" className="text-gray-400 hover:text-[#00A39C] transition-colors">
                  ias.uwu@ieee.org
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaUsers className="text-2xl text-[#00A39C] mt-1" />
              <div>
                <h3 className="font-bold text-white text-xl">The Organizing Team</h3>
                <p className="text-gray-400">Reach out to our project lead for collaboration opportunities.</p>
                <a href="mailto:kasun.thilakarathna@example.com" className="text-gray-400 hover:text-[#00A39C] transition-colors">
                  kasun.thilakarathna@example.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-2xl text-[#00A39C] mt-1" />
              <div>
                <h3 className="font-bold text-white text-xl">Our University</h3>
                <p className="text-gray-400">Uva Wellassa University of Sri Lanka, Badulla, Sri Lanka.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.form
            action={formspreeEndpoint}
            method="POST"
            className="space-y-6"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <input 
              type="text" name="name" placeholder="Your Name" required
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A39C]"
            />
            <input 
              type="email" name="email" placeholder="Your Email" required
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A39C]"
            />
            <textarea 
              name="message" placeholder="Your Message" rows="5" required
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A39C]"
            />
            <button
              type="submit"
              className="w-full bg-[#00A39C] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#00A39C]/30 transform hover:scale-105 transition-all"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;