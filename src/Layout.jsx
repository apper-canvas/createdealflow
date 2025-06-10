import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const NavItem = ({ route }) => (
    <NavLink
      to={route.path}
      onClick={closeMobileMenu}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-primary text-white shadow-md'
            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
        }`
      }
    >
      <ApperIcon name={route.icon} size={20} />
      <span className="font-medium">{route.label}</span>
    </NavLink>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 flex-col z-40">
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-surface-900">DealFlow CRM</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {routeArray.map(route => (
            <NavItem key={route.id} route={route} />
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 w-64 h-full bg-white border-r border-surface-200 flex flex-col z-50 lg:hidden"
            >
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-heading font-bold text-surface-900">DealFlow CRM</h1>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-1 text-surface-500 hover:text-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>
              
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {routeArray.map(route => (
                  <NavItem key={route.id} route={route} />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 lg:px-6 flex items-center justify-between z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            <div className="hidden sm:flex items-center space-x-4">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                />
                <input
                  type="text"
                  placeholder="Search companies, contacts, deals..."
                  className="pl-10 pr-4 py-2 w-80 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium shadow-sm"
            >
              <ApperIcon name="Plus" size={16} className="inline mr-2" />
              Quick Add
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
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
    </div>
  );
};

export default Layout;