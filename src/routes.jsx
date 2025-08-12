import { lazy } from 'react';
import { Navigate } from 'react-router';
import Chats from './pages/Chats';

const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Admins = lazy(() => import('./pages/Admins'));
const Reports = lazy(() => import('./pages/Reports'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Login = lazy(() => import('./pages/Auth/Login'));
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
    protected: false,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    name: 'Dashboard',
    showInNav: true,
    protected: true,
  },
  {
    path: '/users',
    element: <ProtectedRoute> <Users /> </ProtectedRoute>,
    name: 'Users',
    showInNav: true,
    protected: true,
  },
    {
    path: '/login',
    element: <Login />,
    name: 'Login',
    showInNav: false,
    protected: false,
  },
  {
    path: '/game-reports',
    element: <ProtectedRoute> <Reports /> </ProtectedRoute>,
    name: 'Reports',
    showInNav: true,
    protected: true,
  },
  {
    path: '/admins',
    element: <ProtectedRoute> <Admins /> </ProtectedRoute>,
    name: 'Admins',
    showInNav: true,
    protected: true,
  },
    {
    path: '/chats',
    element: <ProtectedRoute> <Chats /> </ProtectedRoute>,
    name: 'Chats',
    showInNav: true,
    protected: true,
  },
  {
    path: '/transactions',
    element: <ProtectedRoute> <Transactions /></ProtectedRoute>,
    name: 'Transactions',
    showInNav: true,
    protected: true,
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
    protected: false,
  },
];