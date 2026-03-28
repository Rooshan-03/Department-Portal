import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewCourse, getAllCourses, getAllTeachers, loadDashboard } from '../../services/apiServices'
import Loader from '../Loader'

function Dashboard() {
  const token = useSelector((state) => state.admin.adminData.access_token)
  const Courses = useSelector((state) => state.admin.allCourses)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.admin);
  const teachers = useSelector((state) => state.admin.allTeachers) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', course_code: '', teacher_id: '' });

  useEffect(() => {
    getAllCourses(token, dispatch)
    loadDashboard(token,dispatch)
    const fetchTeachers = async () => {
      await getAllTeachers(token, dispatch);
    };

    fetchTeachers();
  }, [token, dispatch])

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


      {loading && (
        <Loader />
      )}


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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon="📘" count={Courses?.length || 0} label="COURSES FOUND" color="blue" />
        <StatCard icon="👥" count={teachers?.length || 0} label="ASSIGNED FACULTY" color="green" />
        <StatCard icon="📋" count="12" label="PENDING APPROVAL" color="orange" />
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
                    <button className="text-slate-400 hover:text-slate-600 font-bold">•••</button>
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