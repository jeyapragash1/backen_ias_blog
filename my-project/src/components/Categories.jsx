// src/components/Categories.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { categoriesData } from '../data';

const Categories = ({ selectedCategory, setSelectedCategory }) => (
  <section name="categories" className="py-12 bg-white px-4">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl font-extrabold text-slate-800 text-center mb-12">Browse by Category</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {categoriesData.map((category, index) => (
          <motion.button 
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`font-semibold px-6 py-3 rounded-full transition-all duration-300
              ${selectedCategory === category
                ? 'bg-[#00A39C] text-white'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);
export default Categories;