import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './404';
import Layout from './layout';
import Index from './index';
import Profile from './profile';
import Chat from './chat';
import About from './about';
import Login from './login';
import Logout from './logout';
import Signup from './signup';

export default function Router() {
  // setting router
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Index />,
          errorElement: <NotFound />,
        },

        {
          path: 'profile',
          element: <Profile />,
          errorElement: <NotFound />,
        },

        {
          path: 'chat',
          element: <Chat />,
          errorElement: <NotFound />,
        },

        {
          path: 'login',
          element: <Login />,
        },

        {
          path: 'logout',
          element: <Logout />,
        },

        {
          path: 'signup',
          element: <Signup />,
        },

        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ]);

  // wrapper with setting router
  return <RouterProvider router={router} />;
}
