import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaFileAlt, FaEye, FaThumbsUp, FaComments } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Write Your Article',
      description: 'Prepare your technical article or research paper on any engineering topic. Include examples, code, and diagrams.',
      icon: FaFileAlt
    },
    {
      step: '02',
      title: 'Submit & Review',
      description: 'Submit your article through our submission form. Our editorial team will review it for quality and relevance.',
      icon: FaCheckCircle
    },
    {
      step: '03',
      title: 'Get Published',
      description: 'Once approved, your article gets published and featured on our blog for the community to read.',
      icon: FaEye
    },
    {
      step: '04',
      title: 'Gain Recognition',
      description: 'Receive likes, comments, and feedback from readers. Build your professional portfolio and reputation.',
      icon: FaThumbsUp
    },
  ];

  return (
    <section name="howitworks" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to get your article published on the IAS UWU Blog.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="bg-[#00A39C] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3 w-6 h-1 bg-[#00A39C]"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
