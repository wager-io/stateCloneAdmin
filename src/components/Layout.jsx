import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { routes } from '../routes';


const Layout = () => {
  const { adminData } = useAuth();
  const location = useLocation();
  
  const getCurrentRoute = () => {
    let currentRoute = routes.find(route => route.path === location.pathname);
    if (!currentRoute) {
      currentRoute = routes.find(route => {
        if (route.children && location.pathname.startsWith(route.path)) {
          return true;
        }
        return false;
      });
    }
    
    if (!currentRoute) {
      currentRoute = routes.find(route => route.path === '*');
    }
    
    return currentRoute;
  };
  
  const currentRoute = getCurrentRoute();
  
  const showNavigation = currentRoute?.showInNav !== false && adminData;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-grey">
      {showNavigation && <Navbar />}
      <main className={`container ${showNavigation ? 'pt-[60px] pl-0 sm:pl-[232px]' : 'pt-0 pl-0'} mx-auto px-4 py-8`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;