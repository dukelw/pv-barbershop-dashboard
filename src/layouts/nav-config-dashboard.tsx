/* eslint-disable perfectionist/sort-named-imports */
import Cookie from 'js-cookie';

// Import icons từ MUI
import {
  Dashboard,
  Person,
  Article,
  AdminPanelSettings,
  ShoppingCart,
  Inventory,
  Storefront,
} from '@mui/icons-material';

// ----------------------------------------------------------------------

const userRole = Cookie.get('user_role'); // Lấy userRole từ cookie

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Dashboard />,
  },
  ...(userRole === 'admin'
    ? [
        {
          title: 'Admin',
          path: '/admin',
          icon: <AdminPanelSettings />,
        },
      ]
    : []),
  ...(userRole === 'receptionist'
    ? [
        {
          title: 'Inventory',
          path: '/inventories',
          icon: <Inventory />,
        },
        {
          title: 'Service',
          path: '/services',
          icon: <ShoppingCart />,
        },
      ]
    : []),
  ...(userRole === 'staff'
    ? [
        {
          title: 'Staff',
          path: '/staff',
          icon: <Person />,
        },
      ]
    : []),
  {
    title: 'User',
    path: '/user',
    icon: <Person />,
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: <Article />,
  },
];
