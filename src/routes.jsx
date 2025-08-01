import { lazy } from 'react';
import { Navigate } from 'react-router';
import Login from './pages/Auth/Login';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Admins = lazy(() => import('./pages/Admins'));
const Reports = lazy(() => import('./pages/Reports'));

// Lazy load transaction components
const DepositsTable = lazy(() => import('./components/transactions/DepositsTable'));
const WithdrawalsTable = lazy(() => import('./components/transactions/WithdrawalsTable'));
const BillsTable = lazy(() => import('./components/transactions/BillsTable'));
const BonusTable = lazy(() => import('./components/transactions/BonusTable'));

export const routes = [

  {
    path: '/',
    element: <Navigate to="/dashboard" /> ,
    name: 'Home',
    showInNav: false,
  },
    {
    path: '/dashboard',
    element: <Dashboard />,
    name: 'Dashboard',
    showInNav: true,
  },
  {
    path: '/users',
    element: <Users />,
    name: 'Users',
    showInNav: true,
  },
    {
    path: '/login',
    element: <Login />,
    name: 'Login',
    showInNav: false,
  },
  {
    path: '/reports',
    element: <Reports />,
    name: 'Reports',
    showInNav: true,
  },
  {
    path: '/admins',
    element: <Admins />,
    name: 'Admins',
    showInNav: true,
  },
  {
    path: '/transactions',
    element: <Transactions />,
    name: 'Transactions',
    showInNav: true,
    children: [
      {
        index: true,
        element: <DepositsTable />,
      },
      {
        path: 'withdrawals',
        element: <WithdrawalsTable />,
      },
      {
        path: 'bills',
        element: <BillsTable />,
      },
      {
        path: 'bonus',
        element: <BonusTable />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
    name: 'Not Found',
    showInNav: false,
  },
];