import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './components/DashboardLayout';
import { TreeCanvas } from './pages/TreeCanvas';
import { Search } from './pages/Search';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { RequireAuth } from './components/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      {
        path: '/',
        Component: DashboardLayout,
        children: [
          { index: true, Component: TreeCanvas },
          { path: 'search', Component: Search },
          { path: 'settings', Component: Settings },
        ],
      },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);