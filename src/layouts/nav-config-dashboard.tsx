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
  CalendarToday,
  Schedule,
  ReceiptLong ,
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
  ...(userRole === 'receptionist'
    ? [
        {
          title: 'General',
          path: '/general',
          icon: <CalendarToday />,
        },
        {
          title: 'Today',
          path: '/today-schedule',
          icon: <Schedule />,
        },
        {
          title: 'Appointment',
          path: '/appointments',
          icon: <CalendarToday />,
        },
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
        {
          title: 'Invoice',
          path: '/invoices',
          icon: <ReceiptLong />,
        },
      ]
    : []),
  ...(userRole === 'staff'
    ? [
        {
          title: 'Schedule',
          path: '/schedule',
          icon: <Schedule />,
        },
      ]
    : []),
  {
    title: 'User',
    path: '/user',
    icon: <Person />,
  },
];
