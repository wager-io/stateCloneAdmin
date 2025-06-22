
import { Link } from 'react-router-dom';

const FullLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="https://res.cloudinary.com/dxwhz3r81/image/upload/v1714511848/Wager__wshh2r.png" // Update this path to your actual logo path
        alt="Logo"
        className="h-10 w-auto"
      />
    </Link>
  );
};

export default FullLogo;
