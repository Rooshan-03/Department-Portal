import React from 'react';
import { useSelector } from 'react-redux';

function StudentSchedule() {
  const { enrolledCourses, studentData } = useSelector((state) => state.student);

  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Time slots
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Generate schedule from enrolled courses (mock data for display)
  const scheduleData = enrolledCourses?.map((enrolled, index) => {
    const course = enrolled.course || {};
    const dayIndex = index % days.length;
    const timeIndex = index % timeSlots.length;
    return {
      id: course.id,
      name: course.name,
      code: course.course_code,
      teacher: course.teacher_name,
      day: days[dayIndex],
      time: timeSlots[timeIndex],
      room: `Room ${101 + index}`
    };
  }) || [];

  // Helper to check if there's a class at a specific day/time
  const getClassAt = (day, time) => {
    return scheduleData.find(s => s.day === day && s.time === time);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Schedule</h1>
          <p className="text-slate-500 text-sm">View your weekly class schedule</p>
        </div>
        <div className="text-sm text-slate-500">
          {enrolledCourses?.length || 0} courses enrolled
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-20">
                  Time
                </th>
                {days.map((day) => (
                  <th key={day} className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((time) => (
                <tr key={time} className="hover:bg-slate-50/50">
                  <td className="p-3 text-xs font-medium text-slate-500 text-center border-r border-slate-100">
                    {time}
                  </td>
                  {days.map((day) => {
                    const classItem = getClassAt(day, time);
                    return (
                      <td key={`${day}-${time}`} className="p-2 border-r border-slate-100 relative">
                        {classItem && (
                          <div className="bg-blue-50 border-l-4 border-blue-600 p-2 rounded text-xs">
                            <div className="font-bold text-blue-800">{classItem.code}</div>
                            <div className="text-blue-600 truncate">{classItem.name}</div>
                            <div className="text-blue-400 text-[10px]">{classItem.room}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Course Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduleData.length > 0 ? (
            scheduleData.map((course) => (
              <div key={course.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 text-blue-700 font-bold text-xs p-2 rounded border border-blue-200 uppercase">
                    {course.code}
                  </div>
                  <div className="font-bold text-slate-800 text-sm truncate">{course.name}</div>
                </div>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <span>{course.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{course.day} - {course.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{course.room}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-slate-400">
              <p>No courses enrolled yet.</p>
              <p className="text-sm mt-1">Enroll in courses to see your schedule.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentSchedule;
