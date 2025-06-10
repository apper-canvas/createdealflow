import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import StatCard from '@/components/molecules/StatCard';
import ActionButton from '@/components/molecules/ActionButton';
import Card from '@/components/molecules/Card';

import companyService from '@/services/api/companyService';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';

const HomePage = () => {
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

  const statCardsData = [
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

  const quickActionsData = [
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
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <Heading level={1} className="text-2xl mb-2">Welcome to DealFlow CRM</Heading>
        <Paragraph className="text-white/90">Manage your business relationships and track deals efficiently</Paragraph>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardsData.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
            onClick={() => navigate(stat.path)}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <Heading level={2} className="text-lg mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActionsData.map((action, index) => (
            <ActionButton
              key={action.label}
              label={action.label}
              icon={action.icon}
              color={action.color}
              onClick={action.action}
              delay={index * 0.1}
            />
          ))}
        </div>
      </Card>

      {/* Recent Activity Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Heading level={2} className="text-lg">Recent Activity</Heading>
          <Button variant="ghost" className="text-sm">View All</Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <Paragraph className="text-sm font-medium text-surface-900">Deal "Enterprise Software License" closed</Paragraph>
              <Paragraph className="text-xs text-surface-500">2 hours ago</Paragraph>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Paragraph className="text-sm font-medium text-surface-900">New contact added: John Smith</Paragraph>
              <Paragraph className="text-xs text-surface-500">4 hours ago</Paragraph>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" size={16} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <Paragraph className="text-sm font-medium text-surface-900">Company "TechCorp Solutions" updated</Paragraph>
              <Paragraph className="text-xs text-surface-500">1 day ago</Paragraph>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;