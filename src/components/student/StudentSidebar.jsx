import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, CalendarDays, Settings, Menu, X, LogOut } from 'lucide-react';
import { FaGraduationCap } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import { clearStudentData } from '../../Redux/student';
import StudentDashboard from './StudentDashboard';
import StudentCourses from './StudentCourses';
import StudentSchedule from './StudentSchedule';
import StudentSettings from './StudentSettings';

const StudentSidebar = () => {
  const [activeScreen, setActiveScreen] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const student = useSelector((state) => state.student.studentData)
  const name = student?.name || 'Student'
  const email = student?.email || ''

  const initials = name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    dispatch(clearStudentData());
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, section: 'MAIN' },
    { name: 'My Courses', icon: <BookOpen size={20} />, section: 'ACADEMIC' },
    { name: 'Schedule', icon: <CalendarDays size={20} />, section: 'ACADEMIC' },
    { name: 'Settings', icon: <Settings size={20} />, section: 'ACCOUNT' },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className={`
        fixed lg:relative z-50 w-64 h-full bg-[#1a355b] text-white flex flex-col transition-all
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 flex items-center bg-campus-dark shrink-0">
          <FaGraduationCap className="text-3xl mx-2" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Campus Flow</h1>
            <h1 className='text-xs text-gray-400' >Student Portal</h1>
          </div>

          <X className="lg:hidden m-4 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        <nav className="flex-grow px-4 overflow-y-auto mt-2">
          {navItems.map((item, index) => {

            const showSection = item.section && item.section !== navItems[index - 1]?.section;

            return (
              <React.Fragment key={item.name}>
                {showSection && (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2 px-3">
                    {item.section}
                  </p>
                )}
                <button
                  onClick={() => { setActiveScreen(item.name); setIsOpen(false); }}
                  className={`w-full flex items-center p-3 mb-1 rounded-lg transition ${activeScreen === item.name ? 'bg-[#31496b] border-l-4 border-white' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-[#152c4d] shrink-0">
          <div className="flex items-center space-x-3 bg-[#152c4d] p-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">{initials}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{name}</p>
              <p className="text-[10px] text-slate-400 truncate">{email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-3 flex items-center p-3 rounded-lg hover:bg-slate-800 text-slate-400 transition"
          >
            <span className="mr-3"><LogOut size={20} /></span>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden p-4 bg-white flex justify-between items-center border-b">
          <span className="font-bold">CampusFlow</span>
          <Menu className="cursor-pointer" onClick={() => setIsOpen(true)} />
        </header>
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-gray-50 text-slate-900">
          <div className="w-full">
            {activeScreen === 'Dashboard' && <StudentDashboard />}
            {activeScreen === 'My Courses' && <StudentCourses />}
            {activeScreen === 'Schedule' && <StudentSchedule />}
            {activeScreen === 'Settings' && <StudentSettings />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentSidebar;
