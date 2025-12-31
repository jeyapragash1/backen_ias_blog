import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Kasun Thilakarathna',
      role: 'Student, Electrical Engineering',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      quote: 'Publishing my first article on the IAS UWU Blog was an amazing experience. The platform helped me share my research and gain recognition from the community.'
    },
    {
      name: 'Priya Sharma',
      role: 'Student, IoT & Embedded Systems',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      quote: 'The blog gave me a platform to showcase my IoT project. I received feedback from experienced professionals which helped me improve my skills.'
    },
    {
      name: 'David Chen',
      role: 'Student, AI & Machine Learning',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      quote: 'Being featured on the IAS UWU Blog boosted my portfolio and helped me land opportunities. Highly recommended for aspiring engineers!'
    },
  ];

  return (
    <section className="py-24 bg-slate-50 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">What Our Authors Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Success stories from published authors on the IAS UWU Blog platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
