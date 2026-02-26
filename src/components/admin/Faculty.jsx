import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTeachers } from '../../services/apiServices';
import Loader from '../Loader';

const Faculty = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.admin.adminData.access_token);
  const Teachers = useSelector((state) => state.admin.allTeachers) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useSelector((state) => state.admin);


  useEffect(() => { getAllTeachers(token, dispatch); }, [token, dispatch]);
  const filteredTeachers = Teachers.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower)
    );
  });
  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans text-[#1e293b]">
      {/* 1. Header Stats */}
      <div className="flex gap-6 mb-8">
        <Stat box={Teachers.length} label="TOTAL FACULTY" icon="👥" color="text-blue-600" bg="bg-blue-50" />
        <Stat box="8" label="ON LEAVE" icon="📅" color="text-orange-600" bg="bg-orange-50" />
        <Stat box="12" label="NEW JOINERS" icon="👤" color="text-green-600" bg="bg-green-50" />
      </div>

      {/* 2. Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-5 flex gap-4 border-b border-gray-50">
          <input
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-72 outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
        {
          loading && (
            <Loader />
          )
        }
        <table className="w-full text-left">
          <thead className="bg-[#fcfdfe] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</  th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Designation</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((t) => (
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
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">Professor</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {t.is_active ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 cursor-pointer hover:text-gray-600">•••</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">
                  No faculty members found matching "{searchTerm}"
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

// Minimal Stat Component
const Stat = ({ box, label, icon, color, bg }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 flex-1">
    <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center text-xl`}>{icon}</div>
    <div>
      <div className="text-2xl font-black">{box}</div>
      <div className="text-[10px] font-bold text-gray-400 tracking-widest leading-tight">{label}</div>
    </div>
  </div>
);

export default Faculty;