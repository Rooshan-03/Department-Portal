import { Bell, UserX, ArrowRight } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUnauthenticatedStudents, getAllUnauthenticatedTeachers } from '../../services/apiServices';

const NavBar = ({ activeScreen, setActiveScreen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const timeoutRef = useRef(null); // To prevent flickering when moving mouse to the card

  const { unAuthenticatedTeachers, unAuthenticatedStudents } = useSelector((state) => state.admin);
  const token = useSelector((state) => state.admin.adminData?.access_token || '');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      await getAllUnauthenticatedStudents(token, dispatch);
      await getAllUnauthenticatedTeachers(token, dispatch);
    };
    fetchData();
  }, [token, dispatch]);

  // Hover Handlers with a small delay to prevent accidental closing
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowNotifications(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowNotifications(false);
    }, 200); // 200ms grace period
  };

  const totalCount = (unAuthenticatedStudents?.length || 0) + (unAuthenticatedTeachers?.length || 0);

  return (
    <nav className="bg-white text-slate-800 border-b border-gray-200 relative z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm">
            {activeScreen !== 'Dashboard' && (
              <>
                <button onClick={() => setActiveScreen('Dashboard')} className="text-slate-400 hover:text-primary transition-colors">Home</button>
                <span className="text-slate-300">/</span>
              </>
            )}
            <span className="text-[#1a355b] font-bold">{activeScreen === 'Dashboard' ? 'Home' : activeScreen}</span>
          </div>

          {/* Notification Area */}
          <div
            className="relative py-4" // Added padding to bridge the gap for hover
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={22} className='text-slate-600' />
              {totalCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              )}
            </button>

            {/* THE NOTIFICATION CARD */}
            {showNotifications && (
              <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Join Requests</h3>
                  <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {totalCount} PENDING
                  </span>
                </div>

                {/* SCROLLABLE SECTION */}
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  {totalCount === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-slate-400 text-sm italic">All users authenticated!</p>
                    </div>
                  ) : (
                    <>

                      {unAuthenticatedTeachers?.map((t, index) => (
                        <NotificationRow
                          key={`teacher-${t._id || t.id || index}`}
                          name={t.name}
                          role="Teacher"
                          onClick={() => {
                            setActiveScreen('Join Requests');
                            setShowNotifications(false);
                          }}
                        />
                      ))}

                      {unAuthenticatedStudents?.map((s, index) => (
                        <NotificationRow
                          key={`student-${s._id || s.id || index}`}
                          name={s.name}
                          role="Student"
                          onClick={() => {
                            setActiveScreen('Join Requests');
                            setShowNotifications(false);
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>

                {totalCount > 0 && (
                  <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                    <button
                      onClick={() => setActiveScreen('Join Requests')}
                      className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-widest"
                    >
                      View All Requests
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NotificationRow = ({ name, role, onClick }) => (
  <div
    onClick={onClick}
    className="group flex items-center justify-between p-4 hover:bg-slate-50 border-b border-gray-50 cursor-pointer transition-all"
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${role === 'Teacher' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
        <UserX size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 leading-tight">{name}</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase">{role} Request</p>
      </div>
    </div>
    <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
  </div>
);

export default NavBar;