// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-[#030712] text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-bold text-white text-xl mb-4">IAS UWU Blog</h3>
          <p className="text-gray-400 max-w-md">A student-driven initiative by the IEEE Industry Applications Society Chapter at Uva Wellassa University.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Navigate</h3>
          <ul className="space-y-2">
            <li><Link to="home" smooth={true} duration={500} className="text-gray-400 hover:text-white cursor-pointer">Home</Link></li>
            <li><Link to="articles" smooth={true} duration={500} offset={-80} className="text-gray-400 hover:text-white cursor-pointer">Articles</Link></li>
            <li><Link to="team" smooth={true} duration={500} offset={-80} className="text-gray-400 hover:text-white cursor-pointer">The Team</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 pt-8 mt-8 border-t border-gray-800">
        <p>© {new Date().getFullYear()} UWU IEEE IAS Student Branch. All Rights Reserved.</p>
        <div className="mt-4 space-x-6">
          <button 
            onClick={() => navigate('/terms')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms & Conditions
          </button>
          <span className="text-gray-600">|</span>
          <a href="mailto:iasuwu@blog.com" className="text-gray-400 hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;