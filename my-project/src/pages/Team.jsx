// src/pages/Team.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { blogTeamData } from '../data';

const Team = () => {
  return (
    <div className="pt-32 pb-16 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold text-slate-800">Meet the Team</h1>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">The dedicated student organizers behind the IAS UWU Blog initiative.</p>
        </motion.div>

        <div className="space-y-12">
          {blogTeamData.map((member, index) => (
            <motion.div
              key={member.name}
              className="grid md:grid-cols-3 gap-8 items-center"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className={`flex justify-center ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <img src={member.img} alt={member.name} className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white" />
              </div>
              <div className={`md:col-span-2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <h2 className="text-3xl font-bold text-slate-800">{member.name}</h2>
                <p className="text-xl font-semibold text-[#00A39C] mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Team;