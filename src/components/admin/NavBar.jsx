import React, { useState } from 'react';

const NavBar = ({ activeScreen, setActiveScreen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-slate-800 border-b border-gray-200">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT SIDE: Dynamic Breadcrumb Path */}
          <div className="flex items-center space-x-2 text-sm md:text-base">
            
            {/* Only show the "Home /" prefix if the active screen 
              is NOT the Dashboard.
            */}
            {activeScreen !== 'Dashboard' && (
              <>
                <span 
                  onClick={() => setActiveScreen('Dashboard')} 
                  className="text-slate-400 font-medium cursor-pointer hover:text-primary transition-colors"
                >
                  Home
                </span>
                <span className="text-slate-300 mx-1">/</span>
              </>
            )}

            {/* Current Active Screen Name */}
            <span className="text-[#1a355b] font-bold">
              {activeScreen === 'Dashboard' ? 'Home' : activeScreen}
            </span>
          </div>

          {/* RIGHT SIDE: Add your profile or logout buttons here if needed */}
          
        </div>
      </div>
    </nav>
  );
};

export default NavBar;