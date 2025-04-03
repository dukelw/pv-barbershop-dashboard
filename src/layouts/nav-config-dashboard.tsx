import Cookie from 'js-cookie';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;
const userRole = Cookie.get('user_role'); // Lấy userRole từ cookie

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
  // Các trang chỉ hiển thị nếu role phù hợp
  ...(userRole === 'admin'
    ? [
        {
          title: 'Admin',
          path: '/admin',
          icon: icon('ic-admin'),
        },
      ]
    : []),
  ...(userRole === 'receptionist'
    ? [
        {
          title: 'Receptionist',
          path: '/receptionist',
          icon: icon('ic-receptionist'),
        },
      ]
    : []),
  ...(userRole === 'staff'
    ? [
        {
          title: 'Staff',
          path: '/staff',
          icon: icon('ic-user'),
        },
      ]
    : []),
];
