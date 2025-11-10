import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Banner } from '../components/Banner';
import { NavigationTabs } from '../components/NavigationTabs';
import { FindTheMatch } from '../components/FindTheMatch';
import { CarGrid } from '../components/CarGrid';
import { Compare } from '../components/Compare';
import { NewsAndBrowse } from '../components/NewsAndBrowse';
import { BrowseByBrand } from '../components/BrowseByBrand';

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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Background Blur Overlay */}
      {isSearchExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          style={{ backdropFilter: 'blur(8px)' }}
        />
      )}

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section with full-bleed Banner and Search overlay */}
        <section className="relative pb-12">
          <Banner />

          {/* Search Bar Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-50 px-8">
            <div className="w-full max-w-2xl search-container">
              <SearchBar 
                isExpanded={isSearchExpanded}
                onToggleExpanded={handleToggleSearch}
              />
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="px-8">
          <div className="max-w-7xl mx-auto">
            <NavigationTabs />
          </div>
        </section>

        {/* Bargein Arena CTA */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-1">Ready to Bargein?</h3>
                <p className="text-blue-800/80">Enter the Bargein Arena to get competing offers from authorized dealers while keeping your identity private.</p>
              </div>
              <a href="/bargein" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Enter Bargein Arena</a>
            </div>
          </div>
        </section>

        {/* Find the Match Section */}
        <section className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <FindTheMatch />
          </div>
        </section>

        {/* Launching New Section */}
        <section className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <CarGrid 
              title="Launching New"
              cars={launchingNewCars}
            />
          </div>
        </section>

        {/* Most Sold Cars Section */}
        <section className="px-8 py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <CarGrid 
              title="Most Sold Cars"
              showSearch={true}
              cars={mostSoldCars}
            />
          </div>
        </section>

        {/* Compare Section */}
        <section className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <Compare />
          </div>
        </section>

        {/* News + Browse by Type Section */}
        <section className="px-8 py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <NewsAndBrowse />
          </div>
        </section>

        {/* Browse by Brand Section */}
        <section id="brands" className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <BrowseByBrand />
          </div>
        </section>
      </main>
    </div>
  );
};
