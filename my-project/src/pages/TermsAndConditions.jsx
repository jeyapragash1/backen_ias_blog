import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the IAS UWU Blog website (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. We reserve the right to modify these terms and conditions at any time. Your continued use of the Service implies your acceptance of any updated terms.`
    },
    {
      title: '2. Use License',
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on the IAS UWU Blog for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
• Modifying or copying the materials
• Using the materials for any commercial purpose or for any public display
• Attempting to decompile or reverse engineer any software contained on the IAS UWU Blog
• Removing any copyright or other proprietary notations from the materials
• Transferring the materials to another person or "mirroring" the materials on any other server`
    },
    {
      title: '3. Disclaimer',
      content: `The materials on the IAS UWU Blog are provided on an 'as is' basis. The IAS UWU Blog makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`
    },
    {
      title: '4. Limitations',
      content: `In no event shall the IAS UWU Blog or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the IAS UWU Blog, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.`
    },
    {
      title: '5. Accuracy of Materials',
      content: `The materials appearing on the IAS UWU Blog could include technical, typographical, or photographic errors. The IAS UWU Blog does not warrant that any of the materials on its website are accurate, complete, or current. The IAS UWU Blog may make changes to the materials contained on its website at any time without notice.`
    },
    {
      title: '6. Materials and Content',
      content: `The IAS UWU Blog does not claim ownership of the materials you provide to the IAS UWU Blog (including feedback and suggestions) or post, upload, input or submit to any IAS UWU Blog services or affiliates for review by the general public, or by the members of any web-based community, (each a "Submission" and collectively "Submissions"). However, by posting, uploading, inputting, providing or submitting your Submission you are granting the IAS UWU Blog and its affiliated companies a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt and publish the Submission in any media.`
    },
    {
      title: '7. Intellectual Property Rights',
      content: `All content on the IAS UWU Blog, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of the IAS UWU Blog or its content suppliers and is protected by international copyright laws. Users may not reproduce, republish, or transmit any content from the website without proper attribution and permission from the copyright holder.`
    },
    {
      title: '8. User Conduct',
      content: `You agree not to use the IAS UWU Blog for any unlawful purposes or in any way that could damage, disable, overburden, or impair the Service. You agree not to:
• Harass or cause distress or inconvenience to any person
• Transmit obscene or offensive content
• Disrupt the normal flow of dialogue within our website
• Attempt to gain unauthorized access to our systems
• Post spam or advertisements
• Infringe upon any intellectual property rights`
    },
    {
      title: '9. Article Submissions',
      content: `When submitting articles to the IAS UWU Blog:
• You represent that you are the original author or have obtained proper permissions
• Your article must not violate any applicable laws or regulations
• Your article must not contain defamatory, obscene, or offensive content
• The IAS UWU Blog reserves the right to edit, reject, or remove any submitted content
• By submitting, you grant the IAS UWU Blog the right to publish and distribute your work
• You retain the copyright to your original work`
    },
    {
      title: '10. User Accounts',
      content: `If you create an account on the IAS UWU Blog, you are responsible for maintaining the confidentiality of your login credentials and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. The IAS UWU Blog reserves the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: '11. Third-Party Links',
      content: `The IAS UWU Blog may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of external websites. Your use of third-party websites is at your own risk and subject to their terms and conditions. We do not endorse or assume liability for any third-party content.`
    },
    {
      title: '12. Limitation of Liability',
      content: `In no circumstances shall the IAS UWU Blog, its officers, directors, or employees be liable to you in relation to the contents of or use of, or otherwise in connection with, any of the IAS UWU Blog's websites for any indirect, special or consequential loss, or for any business losses, loss of revenue, income, profits or anticipated savings.`
    },
    {
      title: '13. Indemnification',
      content: `You agree to indemnify and hold harmless the IAS UWU Blog, its officers, directors, employees, and agents from any claim, suit, action, demand, proceeding, or cost incurred by any third party arising from your use of the Service or violation of these Terms and Conditions.`
    },
    {
      title: '14. Governing Law',
      content: `These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka, and you irrevocably submit to the exclusive jurisdiction of the courts in Badulla, Sri Lanka.`
    },
    {
      title: '15. Contact Information',
      content: `If you have any questions about these Terms and Conditions, please contact us at:
Email: iasuwu@blog.com
Address: Department of Electrical and Electronic Engineering, Uva Wellassa University of Sri Lanka, Badulla, Sri Lanka
Phone: +94-XXXX-XXXXX`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#00A39C] hover:text-teal-700 font-semibold mb-6 transition-colors"
          >
            <FaArrowLeft size={18} />
            Back to Home
          </button>

          <div className="bg-gradient-to-r from-[#00A39C] to-teal-600 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms & Conditions</h1>
            <p className="text-teal-100 text-lg">
              Please read these terms carefully before using the IAS UWU Blog. Your use of this website constitutes your acceptance of these terms.
            </p>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-[#00A39C]"
        >
          <p className="text-gray-600">
            <strong>Last Updated:</strong> December 2024
          </p>
          <p className="text-gray-500 text-sm mt-2">
            These terms and conditions may be updated at any time without notice. Your continued use of the website implies acceptance of any changes.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-[#00A39C] text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Acceptance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg shadow-lg p-8 border-2 border-[#00A39C]"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Acceptance & Agreement</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            By using the IAS UWU Blog website, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions stated herein. If you do not agree with any part of these terms, you must immediately stop using this website.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-[#00A39C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              I Agree & Continue
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-200 text-slate-800 px-8 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>
            © 2024 IEEE IAS Chapter - Uva Wellassa University. All rights reserved.
          </p>
          <p className="mt-2">
            If you have questions about these Terms & Conditions, please contact us at iasuwu@blog.com
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
