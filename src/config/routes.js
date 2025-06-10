import HomePage from '@/components/pages/HomePage';
import CompaniesPage from '@/components/pages/CompaniesPage';
import ContactsPage from '@/components/pages/ContactsPage';
import DealsPage from '@/components/pages/DealsPage';
import PipelinePage from '@/components/pages/PipelinePage';
import CompanyDetailPage from '@/components/pages/CompanyDetailPage';
import ContactDetailPage from '@/components/pages/ContactDetailPage';
import DealDetailPage from '@/components/pages/DealDetailPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
component: HomePage
  },
  companies: {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: 'Building2',
component: CompaniesPage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
component: ContactsPage
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'DollarSign',
component: DealsPage
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'BarChart3',
component: PipelinePage
  }
};

export const routeArray = Object.values(routes);

export const detailRoutes = [
  {
    path: '/companies/:id',
component: CompanyDetailPage
  },
  {
    path: '/contacts/:id',
component: ContactDetailPage
  },
  {
    path: '/deals/:id',
component: DealDetailPage
  },
  {
    path: '*',
component: NotFoundPage
  }
];