/* eslint-disable perfectionist/sort-imports */
import Cookie from 'js-cookie';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Outlet, RouterProvider, createBrowserRouter, redirect } from 'react-router';

import App from './app';
import { store, persistor } from './redux/store';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

const userRole = Cookie.get('user_role');

const protectedRoutesLoader = () => {
  if (!['admin', 'staff', 'receptionist'].includes(userRole || '')) {
    return redirect('/404');
  }
  return null;
};

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Outlet />,
        loader: protectedRoutesLoader,
        children: [...routesSection],
      },
    ],
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
