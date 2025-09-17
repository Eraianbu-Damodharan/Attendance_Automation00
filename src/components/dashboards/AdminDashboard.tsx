import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockDatabase } from '../../data/mockDatabase';
import { BarChart3, Users, GraduationCap, BookOpen, Download, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { attendanceRecords, getClassAttendanceStats } = useAttendance();
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const stats = getClassAttendanceStats();
  const allClasses = [...new Set(mockDatabase.students.map(s => s.class))];
  const allSubjects = [...new Set(mockDatabase.students.flatMap(s => s.subjects))];

  const filteredStudents = mockDatabase.students.filter(student => {
    if (selectedClass !== 'all' && student.class !== selectedClass) return false;
    if (selectedSubject !== 'all' && !student.subjects.includes(selectedSubject)) return false;
    return true;
  });

  const getStudentAttendanceRate = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    if (studentRecords.length === 0) return 0;
    const presentCount = studentRecords.filter(r => r.status === 'present').length;
    return Math.round((presentCount / studentRecords.length) * 100);
  };

  const generateReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    const reportData = {
      generatedBy: user?.name,
      timestamp: new Date().toISOString(),
      filters: { class: selectedClass, subject: selectedSubject },
      stats,
      studentData: filteredStudents.map(student => ({
        name: student.name,
        registrationNumber: student.registrationNumber,
        class: student.class,
        attendanceRate: getStudentAttendanceRate(student.id)
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor attendance across all classes and generate comprehensive reports</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{mockDatabase.students.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{mockDatabase.teachers.length}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRecords.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.presentPercentage}%</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Analytics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">{stats.presentPercentage}%</span>
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Present</h3>
              <p className="text-emerald-600">{stats.present} records</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">{stats.latePercentage}%</span>
              </div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Late</h3>
              <p className="text-yellow-600">{stats.late} records</p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">{stats.absentPercentage}%</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Absent</h3>
              <p className="text-red-600">{stats.absent} records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Student Performance</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Classes</option>
                  {allClasses.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Subjects</option>
                  {allSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={generateReport}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Registration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Class</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Attendance Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const attendanceRate = getStudentAttendanceRate(student.id);
                  const statusColor = attendanceRate >= 80 ? 'text-emerald-600' : 
                                    attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600';
                  const statusBg = attendanceRate >= 80 ? 'bg-emerald-100' : 
                                 attendanceRate >= 60 ? 'bg-yellow-100' : 'bg-red-100';
                  
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.subjects.slice(0, 2).join(', ')}...</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{student.registrationNumber}</td>
                      <td className="py-3 px-4 text-gray-900">{student.class}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${attendanceRate >= 80 ? 'bg-emerald-500' : 
                                attendanceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${attendanceRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{attendanceRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                          {attendanceRate >= 80 ? 'Excellent' : 
                           attendanceRate >= 60 ? 'Average' : 'Poor'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found matching the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}