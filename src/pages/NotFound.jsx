import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ApperIcon name="Search" size={64} className="text-surface-300 mx-auto mb-4" />
          <h1 className="text-4xl font-heading font-bold text-surface-900 mb-2">Page Not Found</h1>
          <p className="text-surface-600 text-lg">
            The page you're looking for doesn't exist.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium shadow-sm"
          >
            <ApperIcon name="Home" size={16} className="inline mr-2" />
            Go Home
          </motion.button>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/companies')}
              className="px-4 py-2 text-primary hover:text-primary/80 font-medium"
            >
              Companies
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contacts')}
              className="px-4 py-2 text-primary hover:text-primary/80 font-medium"
            >
              Contacts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/deals')}
              className="px-4 py-2 text-primary hover:text-primary/80 font-medium"
            >
              Deals
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;