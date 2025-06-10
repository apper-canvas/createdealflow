import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import companyService from '../services/api/companyService';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';

const MainFeature = () => {
  const [stats, setStats] = useState({
    companies: 0,
    contacts: 0,
    deals: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const [companies, contacts, deals] = await Promise.all([
          companyService.getAll(),
          contactService.getAll(),
          dealService.getAll()
        ]);

        const totalRevenue = deals
          .filter(deal => deal.stage === 'closed-won')
          .reduce((sum, deal) => sum + deal.value, 0);

        setStats({
          companies: companies.length,
          contacts: contacts.length,
          deals: deals.length,
          revenue: totalRevenue
        });
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Total Companies',
      value: stats.companies,
      icon: 'Building2',
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/companies'
    },
    {
      label: 'Total Contacts',
      value: stats.contacts,
      icon: 'Users',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      path: '/contacts'
    },
    {
      label: 'Active Deals',
      value: stats.deals,
      icon: 'DollarSign',
      color: 'text-accent',
      bg: 'bg-accent/10',
      path: '/deals'
    },
    {
      label: 'Revenue (Closed)',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: 'TrendingUp',
      color: 'text-success',
      bg: 'bg-success/10',
      path: '/pipeline'
    }
  ];

  const quickActions = [
    {
      label: 'Add Company',
      icon: 'Plus',
      color: 'bg-primary',
      action: () => navigate('/companies')
    },
    {
      label: 'Add Contact',
      icon: 'UserPlus',
      color: 'bg-secondary',
      action: () => navigate('/contacts')
    },
    {
      label: 'Create Deal',
      icon: 'CirclePlus',
      color: 'bg-accent',
      action: () => navigate('/deals')
    },
    {
      label: 'View Pipeline',
      icon: 'BarChart3',
      color: 'bg-gradient-primary',
      action: () => navigate('/pipeline')
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-heading font-bold mb-2">Welcome to DealFlow CRM</h1>
        <p className="text-white/90">Manage your business relationships and track deals efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-lg p-6 shadow-sm cursor-pointer border border-surface-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={24} className={stat.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 font-medium hover:shadow-lg transition-shadow`}
            >
              <ApperIcon name={action.icon} size={24} />
              <span className="text-sm">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-surface-900">Recent Activity</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            View All
          </motion.button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900">Deal "Enterprise Software License" closed</p>
              <p className="text-xs text-surface-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900">New contact added: John Smith</p>
              <p className="text-xs text-surface-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" size={16} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900">Company "TechCorp Solutions" updated</p>
              <p className="text-xs text-surface-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;