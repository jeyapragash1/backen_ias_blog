import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle, FaBell } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaBell className="text-[#00A39C] text-2xl" />
              <span className="text-[#00A39C] font-bold text-sm uppercase tracking-wider">Newsletter</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
              Stay Updated With Latest Articles
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get the latest blog posts, updates, submission opportunities, and exclusive insights delivered directly to your inbox every week.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#00A39C] text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Weekly Updates</h4>
                  <p className="text-gray-600 text-sm">Get the best articles and news every week</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#00A39C] text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">No Spam</h4>
                  <p className="text-gray-600 text-sm">We respect your inbox - unsubscribe anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#00A39C] text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Exclusive Content</h4>
                  <p className="text-gray-600 text-sm">Get insider updates and opportunities</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border-2 border-blue-200"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Subscribe Now</h3>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-[#00A39C]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-[#00A39C] focus:outline-none transition-colors text-slate-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#00A39C] to-teal-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300"
              >
                Subscribe for Free
              </motion.button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200"
                >
                  <FaCheckCircle size={18} />
                  <span className="font-semibold">Successfully subscribed!</span>
                </motion.div>
              )}

              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Your email will never be shared.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
