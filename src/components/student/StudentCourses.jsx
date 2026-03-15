import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoursesForStudent, getEnrolledCourses, enrollInCourse } from '../../services/apiServices';
import { setEnrolledCourses, setAvailableCourses, setStudentLoading } from '../../Redux/student';
import Loader from '../Loader';

function StudentCourses() {
  const dispatch = useDispatch();
  const { studentData, enrolledCourses, availableCourses, loading, error } = useSelector((state) => state.student);
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');

  const token = studentData?.access_token;
  const studentId = studentData?.id;

  useEffect(() => {
    if (token && studentId) {
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

  // Filter courses not yet enrolled
  const coursesNotEnrolled = availableCourses.filter(
    (course) => !enrolledCourses.some((enrolled) => enrolled.course?.id === course.id)
  );

  const filteredEnrolled = enrolledCourses?.filter((enrolled) => {
    const course = enrolled.course || {};
    const searchLower = searchTerm.toLowerCase();
    return (
      course?.name?.toLowerCase().includes(searchLower) ||
      course?.course_code?.toLowerCase().includes(searchLower) ||
      course?.teacher_name?.toLowerCase().includes(searchLower)
    );
  });

  const filteredAvailable = coursesNotEnrolled.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course?.name?.toLowerCase().includes(searchLower) ||
      course?.course_code?.toLowerCase().includes(searchLower) ||
      course?.teacher_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleEnroll = async (courseId) => {
    if (!token || !studentId) {
      return;
    }
    dispatch(setStudentLoading(true));
    const result = await enrollInCourse(courseId, studentId, token, dispatch);
    if (result.success) {
      await loadCourses();
      setActiveTab('enrolled');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-500 text-sm">Browse and enroll in available courses</p>
        </div>
      </div>

      {loading && <Loader />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('available'); setSearchTerm(''); }}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'available'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            Available Courses ({coursesNotEnrolled?.length || 0})
          </button>
          <button
            onClick={() => { setActiveTab('enrolled'); setSearchTerm(''); }}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'enrolled'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            My Enrolled Courses ({enrolledCourses?.length || 0})
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by code, name, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[50%] pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Course Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Credits</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTab === 'enrolled' ? (
                filteredEnrolled?.length > 0 ? (
                  filteredEnrolled.map((enrolled) => {
                    const course = enrolled.course || {};
                    return (
                      <tr key={enrolled.id || course.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 text-blue-700 font-bold text-xs p-2 rounded-lg min-w-16 text-center border border-blue-100 uppercase">
                              {course.course_code}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{course.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                              {course.teacher_name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-slate-600">{course.teacher_name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-500 font-medium text-center">3.0</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600 uppercase">
                            Enrolled
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      No enrolled courses found.
                    </td>
                  </tr>
                )
              ) : (
                filteredAvailable?.length > 0 ? (
                  filteredAvailable.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-50 text-green-700 font-bold text-xs p-2 rounded-lg min-w-16 text-center border border-green-100 uppercase">
                            {course.course_code}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{course.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                            {course.teacher_name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-600">{course.teacher_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-medium text-center">3.0</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase">
                          Available
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition"
                        >
                          Enroll Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      No available courses to enroll.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Showing {activeTab === 'enrolled' ? filteredEnrolled?.length : filteredAvailable?.length} results
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-50">Previous</button>
            <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCourses;
