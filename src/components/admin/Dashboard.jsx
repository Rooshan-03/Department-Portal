import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewCourse, enrollStudent, getAllCourses, loadDashboard } from '../../services/apiServices'
import Loader from '../Loader'
import {
  MdSecurity, MdOutlineLock, MdOutlineRemoveRedEye,
  MdOutlinePersonAddAlt, MdOutlineMail, MdClose,
  MdErrorOutline, MdOutlineArrowBack, MdOutlineVisibilityOff,
  MdOutlineMarkEmailRead, MdCheckCircleOutline, MdPersonAdd,
  MdMoreVert, MdPersonAdd as MdEnrollIcon
} from 'react-icons/md';
import { clearRecord, setError } from '../../Redux/admin';



function Dashboard() {
  const token = useSelector((state) => state.admin.adminData.access_token)
  const Courses = useSelector((state) => state.admin.allCourses)
  const dispatch = useDispatch()
  const teachers = useSelector((state) => state.admin.allTeachers) || [];
  const students = useSelector((state) => state.admin.allStudents) || [];
  const unApprovedTeachers = useSelector((state) => state.admin.unAuthenticatedTeachers)
  const unApprovedStudents = useSelector((state) => state.admin.unAuthenticatedStudents)

  const [activeMenu, setActiveMenu] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', course_code: '', teacher_id: '' });
  const { loading, error, success } = useSelector((state) => state.admin);

  useEffect(() => {
    if (error || success) {
      console.log("TOKEN:", token)
      const clearTimer = setTimeout(() => {
        dispatch(clearRecord());
      }, 4000);
      return () => clearTimeout(clearTimer);
    }
  }, [error, success, dispatch]);

  const getMessage = (msg) => {
    if (typeof msg === 'object' && msg !== null) return msg.message || msg.detail || JSON.stringify(msg);
    return msg;
  };



  useEffect(() => {


    getAllCourses(token, dispatch);
    loadDashboard(token, dispatch);

  }, [token, dispatch]);

  const filteredCourses = Courses?.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.name?.toLowerCase().includes(searchLower) ||
      course.course_code?.toLowerCase().includes(searchLower) ||
      course.teacher_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Course Data:", formData);
    const data = {
      name: formData.name,
      teacherId: formData.teacher_id,
      courseCode: formData.course_code,
      token: token
    }
    addNewCourse(data, dispatch)
    setIsModalOpen(false);
    setFormData({ name: '', course_code: '', teacher_id: '' });
  };

  if (loading || !token) {
    return <Loader />
  }
  const enrollNewStudent = (student) => {
    try {
      const data = {
        course_id: selectedCourse.id,
        student_id: student.id,
        token: token
      }
      enrollStudent(data, dispatch)
      setShowEnrollModal(false)
    } catch (error) {
      dispatch(setError('Something Went Wrong'))
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen p-8 text-slate-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-500 text-sm">Manage curriculum, assignments, and faculty allocations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary cursor-pointer text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition shadow-lg">
          <span className="text-xl">+</span> Quick Add
        </button>
      </div>


      {/* error or success  */}
      <div className="fixed top-6 right-1 z-[999] w-full max-w-sm pointer-events-none flex flex-col gap-3">
        {error && (
          <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-2xl overflow-hidden pointer-events-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <MdErrorOutline className="text-red-500 text-xl mr-3 flex-shrink-0" />
                <p className="text-red-800 text-xs font-semibold leading-tight">
                  {getMessage(error)}
                </p>
              </div>
              <button
                onClick={() => dispatch(clearRecord())}
                className="ml-4 text-red-300 hover:text-red-600 transition-colors"
              >
                <MdClose size={18} />
              </button>
            </div>
            {/* Error Progress Bar */}
            <div className="h-1 bg-red-50 w-full">
              <div className="h-full bg-red-500 animate-shrink"></div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-white border-l-4 border-green-500 rounded-xl shadow-2xl overflow-hidden pointer-events-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <MdCheckCircleOutline className="text-green-500 text-xl mr-3 flex-shrink-0" />
                <p className="text-green-800 text-xs font-semibold leading-tight">
                  {getMessage(success)}
                </p>
              </div>
              <button
                onClick={() => dispatch(clearRecord())}
                className="ml-4 text-green-300 hover:text-green-600 transition-colors"
              >
                <MdClose size={18} />
              </button>
            </div>
            {/* Success Progress Bar */}
            <div className="h-1 bg-green-50 w-full">
              <div className="h-full bg-green-500 animate-shrink"></div>
            </div>
          </div>
        )}

      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Add New Course</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Advanced React Architecture"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course Code</label>
                  <input
                    required
                    type="text"
                    placeholder="CS501"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teacher </label>
                  <select
                    required
                    value={formData.teacher_id}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher_id: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Teacher</option>

                    {teachers?.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-blue-200 shadow-lg"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Enroll Modal - Primary Design */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all duration-200"
            onClick={() => setShowEnrollModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header with primary gradient */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <MdPersonAdd className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Enroll Student</h3>
                    <p className="text-white/80 text-xs mt-0.5">
                      Course: {selectedCourse?.name} ({selectedCourse?.course_code})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>

            {/* Student List Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm">Available Students</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a student to enroll in this course
                  </p>
                </div>
                <div className="bg-slate-100 px-2.5 py-1 rounded-full">
                  <span className="text-xs font-medium text-slate-600">{students.length} total</span>
                </div>
              </div>

              {/* Student List Container */}
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {students.length > 0 ? (
                  students.map((student, idx) => (
                    <div
                      key={student.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {/* Student Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                          {student.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 text-sm">{student.name}</p>
                          {student.email && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <MdOutlineMail className="text-slate-300 text-xs" />
                              <p className="text-xs text-slate-400">{student.email}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          enrollNewStudent(student)
                        }}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                      >
                        <MdPersonAdd size={16} />
                        Enroll
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <MdOutlinePersonAddAlt className="text-slate-300 text-2xl" />
                    </div>
                    <p className="text-slate-400 text-sm">No students available</p>
                    <p className="text-slate-300 text-xs mt-1">Add students to enroll them in courses</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon="📘" count={Courses?.length || 0} label="COURSES FOUND" color="blue" />
        <StatCard icon="👥" count={teachers?.length || 0} label="ASSIGNED FACULTY" color="green" />
        <StatCard icon="📋" count={unApprovedStudents?.length + unApprovedTeachers?.length || 0} label="PENDING APPROVAL" color="orange" />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        {/* FILTERS */}
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-white">
          <div className="relative flex-1">
            {/* 4. Search Input with onChange */}
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by code, name, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[50%] pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course Info</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Credits</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCourses?.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-700 font-bold text-[10px] p-2 rounded-lg min-w-12.5 text-center border border-blue-100 uppercase">
                        {course.course_code}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{course.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {course.teacher_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-600">{course.teacher_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500 font-medium text-center md:text-left">3.0</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-600 uppercase">
                      Active
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      {/* Enhanced Three Dots Button */}
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === course.id ? null : course.id)
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <MdMoreVert size={20} />
                      </button>

                      {/* Enhanced Dropdown Menu */}
                      {activeMenu === course.id && (
                        <>
                          {/* Backdrop for clicking outside */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                            {/* Menu Header */}
                            <div className="px-3 py-2.5 bg-gradient-to-r from-primary/5 to-transparent border-b border-slate-100">
                              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Actions</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Manage this course</p>
                            </div>

                            {/* Menu Items */}
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowEnrollModal(true);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors duration-150 group"
                            >
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MdEnrollIcon size={14} className="text-primary" />
                              </div>
                              <span className="font-medium">Enroll Student</span>
                            </button>

                            {/* Optional future menu items can be added here */}
                            {/* 
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                              ...
                            </button>
                            */}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-400 text-sm">
                  No courses match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
          <span className="text-xs text-slate-400">
            Showing {filteredCourses?.length || 0} results
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-50">Previous</button>
            <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, count, label, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl bg-${color}-50`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-800">{count}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  </div>
)

export default Dashboard