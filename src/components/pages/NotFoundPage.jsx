import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
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
          <Heading level={1} className="text-4xl mb-2">Page Not Found</Heading>
          <Paragraph className="text-lg">
            The page you're looking for doesn't exist.
          </Paragraph>
        </motion.div>

        <div className="space-y-4">
          <Button onClick={() => navigate('/')} primaryButtonIcon="Home">
            <ApperIcon name="Home" size={16} className="inline mr-2" />
            Go Home
          </Button>

          <div className="flex justify-center space-x-4">
            <Button variant="ghost" className="px-4 py-2" onClick={() => navigate('/companies')}>
              Companies
            </Button>
            <Button variant="ghost" className="px-4 py-2" onClick={() => navigate('/contacts')}>
              Contacts
            </Button>
            <Button variant="ghost" className="px-4 py-2" onClick={() => navigate('/deals')}>
              Deals
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;