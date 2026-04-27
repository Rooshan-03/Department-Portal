import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEnrolledCourses, getAllCoursesForStudent } from '../../services/apiServices';
import { setEnrolledCourses, setAvailableCourses } from '../../Redux/student';
import Loader from '../Loader';
import DigitalIDCard from './DigitalIDCard';

function StudentDashboard() {
  const dispatch = useDispatch();
  const { studentData, enrolledCourses, availableCourses, loading } = useSelector((state) => state.student);
  const [searchTerm, setSearchTerm] = useState('');

  const token = studentData?.access_token;
  const studentId = studentData?.id;

  useEffect(() => {
    if (token && studentId) {
      console.log(token)
      loadCourses();
    }
  }, [token, studentId]);

  const loadCourses = async () => {
    // Load enrolled courses
    const enrolled = await getEnrolledCourses(studentId, token, dispatch);
    if (enrolled) {
      dispatch(setEnrolledCourses(enrolled));
    }

    // Load all available courses
    const allCourses = await getAllCoursesForStudent(token, dispatch);
    if (allCourses) {
      dispatch(setAvailableCourses(allCourses));
    }
  };

  const filteredEnrolled = enrolledCourses?.filter((enrolled) => {
    const course = enrolled.course || {};
    const searchLower = searchTerm.toLowerCase();
    return (
      course?.name?.toLowerCase().includes(searchLower) ||
      course?.course_code?.toLowerCase().includes(searchLower) ||
      course?.teacher_name?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate stats
  const totalCredits = enrolledCourses?.length * 3 || 0;
  const activeCourses = enrolledCourses?.filter(e => e.course?.is_active !== false)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {studentData?.name || 'Student'}!
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your courses today.
        </p>
      </div>

      {loading && <Loader />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl text-xl bg-blue-50">
            📚
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{enrolledCourses?.length || 0}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Courses</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl text-xl bg-green-50">
            ⏰
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{activeCourses}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Courses</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl text-xl bg-purple-50">
            📊
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalCredits}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Credits</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">My Courses</h2>
            <span className="text-sm text-slate-500">{enrolledCourses?.length || 0} courses</span>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Course List */}
          <div className="divide-y divide-slate-50">
            {filteredEnrolled?.length > 0 ? (
              filteredEnrolled.map((enrolled) => {
                const course = enrolled.course || {};
                return (
                  <div key={enrolled.id || course.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-700 font-bold text-xs p-3 rounded-lg min-w-16 text-center border border-blue-100 uppercase">
                          {course.course_code}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{course.name}</div>
                          <div className="text-sm text-slate-500">{course.teacher_name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-700">3.0</div>
                        <div className="text-xs text-slate-400">Credits</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p>No courses found.</p>
                <p className="text-sm mt-1">Enroll in courses from the My Courses tab.</p>
              </div>
            )}
          </div>
        </div>

        {/* Digital ID Card */}
        <div>
          <DigitalIDCard />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
