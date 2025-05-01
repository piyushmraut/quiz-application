import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import Loading from '../Loading';


const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;