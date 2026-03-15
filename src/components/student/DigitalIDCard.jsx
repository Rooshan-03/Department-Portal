import React from 'react';
import { useSelector } from 'react-redux';
import { FaGraduationCap } from 'react-icons/fa';

const DigitalIDCard = () => {
  const { studentData } = useSelector((state) => state.student);
  
  const name = studentData?.name || 'Student Name';
  const studentId = studentData?.id || 'N/A';
  const email = studentData?.email || 'email@campus.edu';
  const major = studentData?.major || 'Computer Science';

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#1a355b] to-[#2a4a7a] p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-2xl" />
            <span className="font-bold text-lg">Campus Flow</span>
          </div>
          <span className="text-xs opacity-75">STUDENT ID</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Profile Photo Placeholder */}
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
            <span className="text-2xl font-bold">{getInitials(name)}</span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm opacity-90">{major}</p>
            <p className="text-xs opacity-75 mt-1">ID: {studentId}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Email</span>
            <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">{email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Status</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-slate-50 p-3 text-center">
        <p className="text-[10px] text-slate-400">
          This card is property of Campus Flow. Please return to administration if found.
        </p>
      </div>
    </div>
  );
};

export default DigitalIDCard;
