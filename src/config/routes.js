import Home from '../pages/Home';
import Companies from '../pages/Companies';
import Contacts from '../pages/Contacts';
import Deals from '../pages/Deals';
import Pipeline from '../pages/Pipeline';
import CompanyDetail from '../pages/CompanyDetail';
import ContactDetail from '../pages/ContactDetail';
import DealDetail from '../pages/DealDetail';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Home
  },
  companies: {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: 'Building2',
    component: Companies
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'DollarSign',
    component: Deals
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'BarChart3',
    component: Pipeline
  }
};

export const routeArray = Object.values(routes);

export const detailRoutes = [
  {
    path: '/companies/:id',
    component: CompanyDetail
  },
  {
    path: '/contacts/:id',
    component: ContactDetail
  },
  {
    path: '/deals/:id',
    component: DealDetail
  },
  {
    path: '*',
    component: NotFound
  }
];