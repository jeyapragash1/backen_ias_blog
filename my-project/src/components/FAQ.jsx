import React from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const faqs = [
    {
      question: 'Who can submit articles to the IAS UWU Blog?',
      answer: 'Any student, researcher, or professional with knowledge in engineering, technology, or related fields can submit articles. We welcome submissions from students across all faculties and backgrounds.'
    },
    {
      question: 'What types of articles do you accept?',
      answer: 'We accept technical tutorials, research papers, project reports, opinion pieces, reviews, case studies, and any content related to engineering and technology innovation.'
    },
    {
      question: 'How long does the review process take?',
      answer: 'Our editorial team typically reviews submissions within 5-7 business days. You will receive an email notification about the status of your submission.'
    },
    {
      question: 'Can I edit my article after it\'s published?',
      answer: 'Yes, you can request edits or corrections after publication. Contact our editorial team with your requested changes and we\'ll update the article promptly.'
    },
    {
      question: 'Is there any payment for publishing?',
      answer: 'Currently, publishing on the IAS UWU Blog is unpaid. However, you gain exposure, build your portfolio, and establish yourself as an expert in your field.'
    },
    {
      question: 'Can I republish articles from other blogs?',
      answer: 'We prefer original content. If you want to republish, please obtain permission from the original publisher and provide proper attribution.'
    },
  ];

  const [expanded, setExpanded] = React.useState(null);

  return (
    <section name="faq" className="py-24 bg-white px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Find answers to common questions about submitting to the IAS UWU Blog.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="border-2 border-slate-200 rounded-lg overflow-hidden hover:border-[#00A39C] transition-all duration-300"
            >
              <button
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 flex items-center justify-between transition-all duration-300"
              >
                <div className="flex items-center gap-4 text-left">
                  <FaQuestionCircle className="text-[#00A39C] text-xl flex-shrink-0" />
                  <h3 className="font-bold text-slate-800">{faq.question}</h3>
                </div>
                <span className={`text-[#00A39C] text-2xl transition-transform duration-300 ${expanded === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {expanded === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4 bg-white border-t-2 border-slate-200"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
