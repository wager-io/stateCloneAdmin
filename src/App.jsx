import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import { routes } from './routes';
import { Toaster } from 'sonner';

// Function to recursively create route objects with nested children
function createRouteConfig(routes) {
  return routes.map((route) => {
    const routeConfig = {
      path: route.path,
      element: route.element,
    };

    // Handle index route
    if (route.index) {
      routeConfig.index = route.index;
    }

    // Handle nested children routes
    if (route.children && route.children.length > 0) {
      routeConfig.children = createRouteConfig(route.children);
    }

    return routeConfig;
  });
}

// Create the router with nested route support
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: createRouteConfig(routes)
  }
]);

function App() {
  return (
    <>
    <Toaster richColors position='bottom-left'/>
       <RouterProvider router={router} />;
    </>
  ) 

}

export default App;
