import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [hasUserData, setHasUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function checkUserData() {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          setHasUserData(userDoc.exists());
        } catch (error) {
          console.error('Error checking user data:', error);
          setHasUserData(false);
        }
      }
      setLoading(false);
    }

    checkUserData();
  }, [currentUser]);

  if (!currentUser) {
    // Redirect to landing page if not logged in
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If we're on the onboarding page, show it regardless of hasUserData
  if (location.pathname === '/onboarding') {
    return children;
  }

  // If user hasn't completed onboarding, redirect to onboarding
  if (!hasUserData) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default PrivateRoute;
