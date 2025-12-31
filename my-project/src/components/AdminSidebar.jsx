import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaUsers, FaFileAlt, FaComments, FaFlag, FaCog, FaSignOutAlt, FaTimes, FaBars, FaDatabase, FaArrowLeft } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
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
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'users', label: 'Manage Users', icon: FaUsers },
    { id: 'articles', label: 'Manage Articles', icon: FaFileAlt },
    { id: 'comments', label: 'Comments', icon: FaComments },
    { id: 'reports', label: 'Reported Content', icon: FaFlag },
    { id: 'database', label: 'Database', icon: FaDatabase },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:hidden fixed top-4 left-4 z-40 bg-[#00A39C] text-white p-2 rounded-lg"
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isMobile && !sidebarOpen ? -300 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-30 shadow-2xl`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#00A39C] rounded-lg flex items-center justify-center font-bold text-white">
              IAS
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#00A39C]">Admin Panel</h2>
              <p className="text-xs text-gray-400">IAS UWU Blog</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Menu Items */}
          <nav className="space-y-2">
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
                      ? 'bg-[#00A39C] text-white shadow-lg font-semibold'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-slate-700 my-6"></div>

          {/* Back to Home & Logout */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#00A39C]/20 hover:text-[#00A39C] transition-all duration-300 mb-3"
          >
            <FaArrowLeft size={20} />
            <span>Back to Home</span>
          </motion.button>
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-300"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </motion.button>
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

export default AdminSidebar;
