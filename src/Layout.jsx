import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NavButton from '@/components/molecules/NavButton';
import { routeArray } from './config/routes';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

const MobileNavButton = ({ route }) => (
    <NavButton route={route} type="mobile" onClick={() => setIsMobileMenuOpen(false)} />
  );

  const DesktopNavButton = ({ route }) => (
    <NavButton route={route} type="desktop" />
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-surface-200 flex-shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-heading font-bold text-surface-900">
            TaskFlow Pro
          </h1>
        </div>
        
        <nav className="flex items-center gap-2">
          {routeArray.map((route) => (
            <DesktopNavButton key={route.id} route={route} />
          ))}
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200 flex-shrink-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-heading font-bold text-surface-900">
            TaskFlow Pro
          </h1>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
        >
          <ApperIcon 
            name={isMobileMenuOpen ? 'X' : 'Menu'} 
            size={20} 
            className="text-surface-600" 
          />
        </button>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-surface-200 p-4 z-50 shadow-lg"
            >
              <div className="flex justify-center gap-6">
                {routeArray.map((route) => (
                  <MobileNavButton key={route.id} route={route} />
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-center gap-6 px-4 py-3 bg-white border-t border-surface-200 flex-shrink-0">
        {routeArray.map((route) => (
          <MobileNavButton key={route.id} route={route} />
        ))}
      </nav>
    </div>
  );
};

export default Layout;