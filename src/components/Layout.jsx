import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';


const Layout = () => {
  const { adminData } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-grey">
      <Navbar />
      <main className={`container pt-[60px] pl-0 sm:pl-[${!adminData ? 0 : 232}px] mx-auto px-4 py-8`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;