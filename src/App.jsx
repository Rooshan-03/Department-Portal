import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import SideBar from './components/admin/SideBar';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentSidebar from './components/student/StudentSidebar';

// Define your routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Admin-dashboard",
    element: <SideBar />,
  },
  {
    path: "/Teacher-dashboard",
    element: <TeacherDashboard />,
  },
  {
    path: "/Student-dashboard",
    element: <StudentSidebar />,
  }
  
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;