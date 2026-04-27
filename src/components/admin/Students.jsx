import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2, X } from 'lucide-react';
import Loader from '../Loader';
import { deleteUser, updateUser } from '../../services/apiServices';
import {
  MdSecurity, MdOutlineLock, MdOutlineRemoveRedEye,
  MdOutlinePersonAddAlt, MdOutlineMail, MdClose,
  MdErrorOutline, MdOutlineArrowBack, MdOutlineVisibilityOff,
  MdOutlineMarkEmailRead, MdCheckCircleOutline
} from 'react-icons/md';
import { clearRecord } from '../../Redux/admin';
import { FiAward, FiUserCheck, FiUsers } from 'react-icons/fi';


const Students = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.admin.adminData.access_token);
  const Students = useSelector((state) => state.admin.allStudents) || [];
  const { loading, error, success } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const activeStudents = Students.filter(
    (s) => s.is_active === true
  ).length;

  const inActiveStudents = Students.filter(
    (s) => s.is_active === false
  ).length;

  useEffect(() => {
    if (error || success) {
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

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser({ id: userToDelete.id, token }, dispatch);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateUser({ ...selectedUser, token }, dispatch);
    setIsModalOpen(false);
  };

  const filteredStudents = Students.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      t.is_authenticated === true &&
      (t.name.toLowerCase().includes(searchLower) ||
        t.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans text-[#1e293b]">
      <div className="flex gap-6 mb-8">
        <Stat
          box={Students.length}
          label="TOTAL STUDENTS"
          icon={<FiUsers />}
          color="text-blue-600"
          bg="bg-blue-50"
        />

        <Stat
          box={activeStudents}
          label="ACTIVE STUDENTS"
          icon={<FiUserCheck />}
          color="text-green-600"
          bg="bg-green-50"
        />

        <Stat
          box={inActiveStudents}
          label="STUDENTS GRADUATED"
          icon={<FiAward />}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 flex gap-4 border-b border-gray-50">
          <input
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-72 outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <Loader />}
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


        <table className="w-full text-left">
          <thead className="bg-[#fcfdfe] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                      {t.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-800">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-900 font-medium italic">Computer Science</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'}`}>
                      {t.is_active ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-5">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(t)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 text-sm">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-0 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Edit Student</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update student information</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 space-y-3">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Account Settings</label>
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      checked={selectedUser.is_active}
                      onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.checked })}
                    />
                    <span className="group-hover:text-gray-900">Active Status</span>
                    <span className="text-xs text-gray-400 ml-auto">Enable/Disable account</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      checked={selectedUser.is_authenticated}
                      onChange={(e) => setSelectedUser({ ...selectedUser, is_authenticated: e.target.checked })}
                    />
                    <span className="group-hover:text-gray-900">Authenticated</span>
                    <span className="text-xs text-gray-400 ml-auto">Email verified login</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      checked={selectedUser.is_verified_email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, is_verified_email: e.target.checked })}
                    />
                    <span className="group-hover:text-gray-900">Verified Email</span>
                    <span className="text-xs text-gray-400 ml-auto">Email confirmation</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-0 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Delete Student</h2>
                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Are you sure?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                You are about to delete <span className="font-semibold text-gray-700">{userToDelete.name}</span>.
                This will permanently remove this student from the system.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ box, label, icon, color, bg }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 flex-1">
    <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center text-xl`}>{icon}</div>
    <div>
      <div className="text-2xl font-black">{box}</div>
      <div className="text-[10px] font-bold text-gray-400 tracking-widest leading-tight">{label}</div>
    </div>
  </div>
);

export default Students;