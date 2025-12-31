import React from 'react';
import { motion } from 'framer-motion';
import { FaFeather, FaUsers, FaGlobe, FaLightbulb, FaTrophy, FaRocket } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: FaFeather,
      title: 'Share Knowledge',
      description: 'Publish your technical articles and research to a growing community of engineers and innovators.'
    },
    {
      icon: FaUsers,
      title: 'Connect & Network',
      description: 'Build relationships with peers, mentors, and industry professionals in the engineering field.'
    },
    {
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'Your articles can reach students and professionals worldwide interested in technology and innovation.'
    },
    {
      icon: FaLightbulb,
      title: 'Innovative Ideas',
      description: 'Exchange ideas, discuss trends, and collaborate on solutions to real-world engineering challenges.'
    },
    {
      icon: FaTrophy,
      title: 'Recognition',
      description: 'Get featured, win awards, and build your professional portfolio as a published author.'
    },
    {
      icon: FaRocket,
      title: 'Career Growth',
      description: 'Boost your career prospects with published content and demonstrated expertise in your field.'
    },
  ];

  return (
    <section name="features" className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Why Write for Us?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The IAS UWU Blog provides the perfect platform for engineering students to share their expertise and grow professionally.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-slate-200"
              >
                <div className="bg-gradient-to-br from-[#00A39C] to-teal-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
