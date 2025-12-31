import React from 'react';
import { motion } from 'framer-motion';
import { FaPencilAlt, FaHeading, FaImage, FaCheckDouble } from 'react-icons/fa';

const Guidelines = () => {
  const guidelines = [
    {
      icon: FaHeading,
      title: 'Write Compelling Headlines',
      description: 'Create clear, engaging titles that accurately reflect your article content. Avoid clickbait.'
    },
    {
      icon: FaPencilAlt,
      title: 'Original Content',
      description: 'Ensure your article is original or properly attributed. Plagiarism will result in rejection.'
    },
    {
      icon: FaImage,
      title: 'Include Visuals',
      description: 'Add relevant images, diagrams, or code snippets to enhance readability and engagement.'
    },
    {
      icon: FaCheckDouble,
      title: 'Proofread & Edit',
      description: 'Review for grammar, spelling, and clarity. Quality writing is essential for acceptance.'
    },
  ];

  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Submission Guidelines</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these guidelines to maximize your chances of getting published on the IAS UWU Blog.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-[#00A39C]">
                    <Icon className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{guideline.title}</h3>
                  <p className="text-gray-600">{guideline.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-blue-50 border-l-4 border-[#00A39C] p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Article Requirements</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#00A39C] font-bold">•</span>
              <span><strong>Length:</strong> 800-3000 words recommended</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A39C] font-bold">•</span>
              <span><strong>Format:</strong> Use clear headings, bullet points, and paragraphs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A39C] font-bold">•</span>
              <span><strong>Topics:</strong> Any engineering, technology, or innovation related field</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A39C] font-bold">•</span>
              <span><strong>Code/Diagrams:</strong> Include relevant code snippets or technical diagrams</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A39C] font-bold">•</span>
              <span><strong>Author Bio:</strong> Provide a 50-100 word biography about yourself</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default Guidelines;
