import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';

// Define your routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, 
  },
  {
    path: "/dashboard",
    element: (
      <div className="flex h-screen items-center justify-center bg-gray-100 text-3xl font-bold">
        Welcome to the Student Dashboard
      </div>
    ),
  },
]);

function App() {
  return (
    /* This provider makes the router available to your whole app */
    <RouterProvider router={router} />
  );
}

export default App;