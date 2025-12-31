import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaFileAlt, FaAward, FaTrophy, FaChartLine, FaClock } from 'react-icons/fa';
import { metricsAPI } from '../services/api';

const Stats = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await metricsAPI.getPublicMetrics();
        if (!cancelled) {
          setMetrics(data);
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load metrics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fmt = (n) => {
    if (n === null || n === undefined) return '—';
    if (typeof n !== 'number') return String(n);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  };

  const mainStats = [
    { icon: FaUsers, value: fmt(metrics?.active_contributors), label: 'Active Contributors', color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { icon: FaFileAlt, value: fmt(metrics?.published_articles), label: 'Published Articles', color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
    { icon: FaAward, value: fmt(metrics?.featured_authors), label: 'Featured Authors', color: 'from-orange-500 to-orange-600', bgLight: 'bg-orange-50' },
    { icon: FaChartLine, value: fmt(metrics?.article_categories), label: 'Article Categories', color: 'from-cyan-500 to-cyan-600', bgLight: 'bg-cyan-50' },
  ];

  const impactStats = [
    { icon: FaClock, value: metrics?.average_review_time_days != null ? `${metrics.average_review_time_days} Days` : '—', label: 'Average Review Time', color: 'from-pink-400 to-pink-500' },
    { icon: FaTrophy, value: fmt(metrics?.published_last_30_days), label: 'Published Last 30 Days', color: 'from-yellow-400 to-yellow-500' },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm"
          >
            <FaChartLine /> Growth Metrics
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-6">By The Numbers</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform's rapid growth and impact on the engineering community
          </p>
        </motion.div>

        {/* Main Stats Grid (real data) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {(loading ? Array.from({ length: 4 }) : mainStats).map((stat, index) => {
            if (loading) {
              return (
                <div key={index} className="rounded-2xl p-8 shadow-lg bg-slate-100 animate-pulse h-48" />
              );
            }
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`${stat.bgLight} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#00A39C] group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-3">{stat.value}</h3>
                <p className="text-gray-700 font-semibold text-lg">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-transparent via-[#00A39C] to-transparent mb-16"
        />

        {/* Impact Section (only real data) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center mb-12">Our Platform Impact</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {(loading ? Array.from({ length: 2 }) : impactStats).map((stat, index) => {
              if (loading) {
                return <div key={index} className="rounded-2xl p-8 shadow-lg bg-white animate-pulse h-44" />;
              }
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-slate-200 hover:border-[#00A39C] group"
                >
                  <div className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-125 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <p className="text-4xl font-extrabold text-slate-800 mb-3">{stat.value}</p>
                  <p className="text-gray-600 font-semibold">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-[#00A39C] via-teal-500 to-teal-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative"
        >
          {/* Animated background elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">Why Join Our Community?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-3">🚀</div>
                <p className="text-lg font-semibold mb-2">Rapid Growth</p>
                <p className="text-teal-100">Fastest growing engineering blog platform</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-3">⭐</div>
                <p className="text-lg font-semibold mb-2">Quality Content</p>
                <p className="text-teal-100">Peer-reviewed articles from experts</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-3">🌍</div>
                <p className="text-lg font-semibold mb-2">Global Reach</p>
                <p className="text-teal-100">Readers from 150+ countries worldwide</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
