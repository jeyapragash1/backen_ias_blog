// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Competition from './components/Competition';
import Categories from './components/Categories';
import ArticleFeed from './components/ArticleFeed';
import Features from './components/Features';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Guidelines from './components/Guidelines';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Vision from './components/Vision';
import Newsletter from './components/Newsletter';
import Submit from './components/Submit';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TermsAndConditions from './pages/TermsAndConditions';
import ArticleSubmission from './pages/ArticleSubmission';
import SingleArticle from './pages/SingleArticle';
import Articles from './pages/Articles';

function HomeContent({ selectedCategory, setSelectedCategory, selectedArticle, setSelectedArticle }) {
  return (
    <div className="bg-slate-50">
      <main>
        <Hero />
        <Competition />
        <Features />
        <Stats />
        <Categories 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
        <ArticleFeed 
          selectedCategory={selectedCategory} 
          selectedArticle={selectedArticle} 
          setSelectedArticle={setSelectedArticle}
        />
        <HowItWorks />
        <Guidelines />
        <Testimonials />
        <Team />
        <Vision />
        <Newsletter />
        <Submit />
      </main>
    </div>
  );
}

function AppContent({ selectedCategory, setSelectedCategory, selectedArticle, setSelectedArticle }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';
  const isAdminDashboard = location.pathname === '/admin';

  return (
    <div className="bg-slate-50">
      {!isDashboard && !isAdminDashboard && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={
            <HomeContent 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedArticle={selectedArticle}
              setSelectedArticle={setSelectedArticle}
            />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit" element={<ArticleSubmission />} />
        <Route path="/article/:slug" element={<SingleArticle />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/articles" element={<Articles />} />
      </Routes>
      {!isAuthPage && !isDashboard && !isAdminDashboard && <Footer />}
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
          />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;