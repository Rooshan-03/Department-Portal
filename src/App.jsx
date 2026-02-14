import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
// Define your routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;