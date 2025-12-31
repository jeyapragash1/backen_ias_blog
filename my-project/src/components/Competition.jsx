// src/components/Competition.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { FaTrophy, FaPencilAlt, FaUsers } from 'react-icons/fa';

const CountdownItem = ({ value, label }) => (
  <div className="flex flex-col items-center bg-white border border-gray-200 shadow-inner p-4 rounded-lg w-24">
    <span className="text-4xl font-bold text-slate-800">{String(value).padStart(2, '0')}</span>
    <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</span>
  </div>
);

const Competition = () => {
  const [days, hours, minutes, seconds] = useCountdown('2024-12-01T00:00:00');

  return (
    <section name="competition" className="py-24 bg-slate-100 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Join Our Launch Competition</h2>
        <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">This is your moment to shine. We invite students from all faculties across Sri Lanka to share their voice and contribute to a growing community of innovators.</p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <FaPencilAlt className="text-3xl text-[#00A39C] mb-4" />
            <h3 className="font-bold text-xl text-slate-800">Share Your Articles</h3>
            <p className="text-gray-500 mt-2">Submit your original technical articles, research, or opinions.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <FaUsers className="text-3xl text-[#00A39C] mb-4" />
            <h3 className="font-bold text-xl text-slate-800">Get Featured</h3>
            <p className="text-gray-500 mt-2">Have your work published on our official international-standard platform.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <FaTrophy className="text-3xl text-[#00A39C] mb-4" />
            <h3 className="font-bold text-xl text-slate-800">Win Exciting Rewards</h3>
            <p className="text-gray-500 mt-2">The best submissions during our launch month will be recognized and rewarded.</p>
          </div>
        </div>
        
        {days + hours + minutes + seconds > 0 && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Competition Closes In:</h3>
              <div className="flex justify-center gap-4 md:gap-8">
                <CountdownItem value={days} label="Days" />
                <CountdownItem value={hours} label="Hours" />
                <CountdownItem value={minutes} label="Minutes" />
                <CountdownItem value={seconds} label="Seconds" />
              </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default Competition;