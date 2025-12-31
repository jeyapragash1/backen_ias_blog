// src/components/FeaturedSlider.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';

const FeaturedSlider = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArticles();
  }, []);

  const fetchFeaturedArticles = async () => {
    try {
      setLoading(true);
      // Fetch only approved + featured articles
      const response = await api.get('/articles/', {
        params: { status: 'approved', featured: true, limit: 10 }
      });
      setFeaturedArticles(response.data.items);
    } catch (err) {
      console.error('Error fetching featured articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section name="featured" className="w-full py-24 bg-[#030712] px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-extrabold text-white">Editor's Picks</h2>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A39C] mx-auto"></div>
            <p className="mt-4 text-white">Loading featured articles...</p>
          </div>
        ) : featuredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No featured articles yet</p>
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[EffectCoverflow, Navigation, Autoplay]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              loop={featuredArticles.length > 1}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
              navigation={{
                nextEl: '.swiper-button-next-custom-featured',
                prevEl: '.swiper-button-prev-custom-featured',
              }}
              className="!py-10"
            >
              {featuredArticles.map((article) => (
                <SwiperSlide key={article.slug} className="!w-[300px] md:!w-[400px]">
                  <div className="relative h-96 w-full rounded-xl shadow-lg overflow-hidden group">
                    <img
                      src={article.featuredImage || 'https://via.placeholder.com/400x400?text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <span className="bg-[#00A39C] text-xs font-bold px-2 py-1 rounded">{article.category}</span>
                      <h3 className="text-xl font-bold mt-2">{article.title}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="swiper-button-prev-custom-featured featured-swiper-button absolute top-1/2 -translate-y-1/2 left-0 z-10 hidden md:flex text-white text-2xl p-3 rounded-full bg-black/50 hover:bg-black transition"
              aria-label="Previous Slide"
            >
              <FaArrowLeft />
            </button>
            <button
              className="swiper-button-next-custom-featured featured-swiper-button absolute top-1/2 -translate-y-1/2 right-0 z-10 hidden md:flex text-white text-2xl p-3 rounded-full bg-black/50 hover:bg-black transition"
              aria-label="Next Slide"
            >
            <FaArrowRight />
          </button>
        </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSlider;
