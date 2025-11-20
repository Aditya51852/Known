import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { NavigationTabs } from '../components/NavigationTabs';
import { FindTheMatch } from '../components/FindTheMatch';
import { CarGrid } from '../components/CarGrid';
import { Compare } from '../components/Compare';
import { NewsAndBrowse } from '../components/NewsAndBrowse';
import { BrowseByBrand } from '../components/BrowseByBrand';
import { 
  Shield, 
  Users, 
  Handshake, 
  Car as CarIcon, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  Target, 
  Star
} from 'lucide-react';

export const Homepage: React.FC = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleToggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  // Close search when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchExpanded(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSearchExpanded && !target.closest('.search-container')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  const launchingNewCars = [
    { name: "BMW iX3", price: "$55,000", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop" },
    { name: "Audi e-tron GT", price: "$85,000", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop" },
    { name: "Mercedes EQS", price: "$95,000", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop" },
    { name: "Tesla Model S", price: "$80,000", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop" }
  ];

  const mostSoldCars = [
    { name: "Toyota Camry", price: "$35,000", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop" },
    { name: "Honda Accord", price: "$32,000", image: "https://images.unsplash.com/photo-1606016159991-d3bdc9d2991b?w=300&h=200&fit=crop" },
    { name: "Ford F-150", price: "$45,000", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=200&fit=crop" },
    { name: "Chevrolet Silverado", price: "$48,000", image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=300&h=200&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {isSearchExpanded && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" style={{ backdropFilter: 'blur(8px)' }} />
      )}

      <main>
        {/* Hero Section - Gradient + Motion + Search overlay */}
        <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />

          {/* Decorative rings */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-16 left-12 w-24 h-24 border border-primary/30 rounded-full" />
            <div className="absolute top-36 right-24 w-20 h-20 border border-accent/30 rounded-full" />
            <div className="absolute bottom-28 left-28 w-36 h-36 border border-primary/20 rounded-full" />
            <div className="absolute bottom-16 right-16 w-24 h-24 border border-accent/20 rounded-full" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm"
              >
                <Zap className="w-4 h-4" />
                Revolutionary Car Buying Experience
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Find Your Perfect <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">Car</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Search thousands of cars with our intelligent matching system
              </motion.p>

              {/* Search overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="pt-4 flex justify-center"
              >
                <div className="w-full max-w-2xl search-container">
                  <SearchBar isExpanded={isSearchExpanded} onToggleExpanded={handleToggleSearch} />
                </div>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="pt-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                  {[
                    { number: '50K+', label: 'Successful Deals' },
                    { number: '2,000+', label: 'Verified Dealers' },
                    { number: '₹12Cr+', label: 'Money Saved' },
                    { number: '4.9★', label: 'User Rating' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-medium text-primary mb-1">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="pt-4"
              >
                <Link to="/bargein" className="inline-flex items-center gap-3 primary-gradient text-white px-8 py-3 text-lg rounded-xl shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <Target className="w-5 h-5" />
                  Enter Bargain Arena
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA bottom */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-medium">Ready to Get the <span className="text-primary">Best Deal</span>?</h2>
              <p className="text-lg md:text-xl text-muted-foreground">Join thousands of satisfied customers who saved money with Bargain Arena</p>
              <Link to="/bargein" className="inline-flex items-center gap-3 primary-gradient text-white px-8 py-3 text-lg rounded-xl shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <Target className="w-5 h-5" />
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Keep existing product discovery sections for continuity */}
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <NavigationTabs />
          </div>
        </section>
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <FindTheMatch />
          </div>
        </section>
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <CarGrid title="Launching New" cars={launchingNewCars} />
          </div>
        </section>
        <section className="px-6 md:px-8 py-12 bg-card">
          <div className="max-w-7xl mx-auto">
            <CarGrid title="Most Sold Cars" showSearch cars={mostSoldCars} />
          </div>
        </section>
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <Compare />
          </div>
        </section>
        <section className="px-6 md:px-8 py-12 bg-card">
          <div className="max-w-7xl mx-auto">
            <NewsAndBrowse />
          </div>
        </section>
        <section id="brands" className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <BrowseByBrand />
          </div>
        </section>
      </main>
    </div>
  );
};
