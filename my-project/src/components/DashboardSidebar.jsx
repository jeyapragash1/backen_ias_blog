import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaFileAlt, FaPlus, FaChartBar, FaComments, FaCog, FaSignOutAlt, FaTimes, FaBars, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'articles', label: 'My Articles', icon: FaFileAlt },
    { id: 'create', label: 'Create Article', icon: FaPlus },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'comments', label: 'Comments', icon: FaComments },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleLogout = () => {
    // Use centralized auth logout to clear token and user
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:hidden fixed top-24 left-4 z-40 bg-[#00A39C] text-white p-2 rounded-lg"
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isMobile && !sidebarOpen ? -300 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white z-30 shadow-2xl`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#00A39C] mb-8">Author Hub</h2>

          {/* Menu Items */}
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-[#00A39C] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-slate-700 my-6"></div>

          {/* Back to Home & Logout */}
          <div className="space-y-3">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#00A39C]/20 hover:text-[#00A39C] transition-all duration-300"
            >
              <FaArrowLeft size={20} />
              <span className="font-semibold">Back to Home</span>
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              <FaSignOutAlt size={20} />
              <span className="font-semibold">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default DashboardSidebar;
