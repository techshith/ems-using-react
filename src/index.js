import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import List from './pages/EmployeeList';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';


const PrivateRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className='spinner mt-5'></div>;
  }

  return authenticated ? element : <Navigate to="/" />;
};

const routes = [
  { path: '/', element: <App /> },
  { path: 'signup', element: <SignUp /> },
  { path: 'home', element: <PrivateRoute element={<Home />} /> },
  { path: 'list', element: <PrivateRoute element={<List />} /> },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

