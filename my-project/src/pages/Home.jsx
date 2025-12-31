// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articlesData } from '../data';
import ArticleCard from '../components/ArticleCard';
import { useCountdown } from '../hooks/useCountdown';
import { FaTrophy, FaPencilAlt, FaUsers } from 'react-icons/fa';

const CountdownItem = ({ value, label }) => (
  <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg w-24">
    <span className="text-4xl font-bold text-white">{String(value).padStart(2, '0')}</span>
    <span className="text-xs text-gray-300 mt-1 uppercase tracking-wider">{label}</span>
  </div>
);

const Home = () => {
  // Find the first featured article (or fallback to first)
  const featuredArticle = articlesData.find(a => a.isFeatured) || articlesData[0];
  const [showAllArticles, setShowAllArticles] = React.useState(false);
  // Only show 6 non-featured articles by default, all after button click
  const nonFeaturedArticles = articlesData.filter(a => a !== featuredArticle);
  const otherArticles = showAllArticles ? nonFeaturedArticles : nonFeaturedArticles.slice(0, 6);
  const [days, hours, minutes, seconds] = useCountdown('2024-12-01T00:00:00');
  const googleFormLink = "https://forms.gle/A5K4WozmuZxkqDzw9";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-slate-900 text-white flex items-center p-4 overflow-hidden">
        <div className="absolute -inset-40 bg-[radial-gradient(circle_at_20%_30%,_rgba(0,163,156,0.3),_transparent_40%)]" />
        <div className="absolute -inset-40 bg-[radial-gradient(circle_at_80%_70%,_rgba(0,98,155,0.3),_transparent_40%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-lg font-semibold text-[#00A39C]">IAS UWU BLOG LAUNCH</span>
            <h1 className="text-4xl md:text-6xl font-extrabold my-4 leading-tight">Have a Tech Story to Tell?</h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-8">
              The official blog of the IEEE IAS Chapter at Uva Wellassa University is launching soon. Share your ideas, get published, and win exciting rewards.
            </p>
            <a href={googleFormLink} target="_blank" rel="noopener noreferrer" className="bg-[#00A39C] text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-teal-700 transition-colors">
              Submit Now
            </a>
          </motion.div>
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <ArticleCard article={featuredArticle} index={0} />
          </motion.div>
        </div>
      </section>

      {/* Competition Section */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Join Our Launch Competition</h2>
          <p className="text-lg text-gray-500 mb-12">This is your moment to shine. All students from IT and non-IT faculties across Sri Lanka are invited.</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <FaPencilAlt className="text-3xl text-[#00A39C] mb-4" />
              <h3 className="font-bold text-xl text-slate-800">Share Your Articles</h3>
              <p className="text-gray-500">Submit your original technical articles, research, or opinions.</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <FaUsers className="text-3xl text-[#00A39C] mb-4" />
              <h3 className="font-bold text-xl text-slate-800">Get Featured</h3>
              <p className="text-gray-500">Have your work published on our official international-standard platform.</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <FaTrophy className="text-3xl text-[#00A39C] mb-4" />
              <h3 className="font-bold text-xl text-slate-800">Win Exciting Rewards</h3>
              <p className="text-gray-500">The best submissions during our launch month will be rewarded.</p>
            </div>
          </div>
          
          {days + hours + minutes + seconds > 0 && (
            <div className="bg-slate-900 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Competition Closes In:</h3>
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
      
      {/* Latest Articles Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">Explore Our Articles</h2>
          <p className="text-lg text-center text-gray-500 mb-10">Dive into our archive of student-written articles, from deep dives into AI to the latest in web technology and power systems.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index} />
            ))}
          </div>
          <div className="text-center mt-16">
            {!showAllArticles && nonFeaturedArticles.length > 6 && (
              <button
                className="bg-[#00A39C] text-white px-6 py-2 rounded-full font-bold text-lg hover:bg-teal-700 transition-colors"
                onClick={() => setShowAllArticles(true)}
              >
                Explore More Articles
              </button>
            )}
            {showAllArticles && (
              <Link to="/articles" className="text-[#00A39C] font-bold text-lg hover:underline transition-all duration-300 inline-block group mt-4">
                Explore All Articles <span className="inline-block transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;