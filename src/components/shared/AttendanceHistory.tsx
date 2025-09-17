import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { mockDatabase } from '../../data/mockDatabase';
import { Calendar, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';

export default function AttendanceHistory() {
  const { attendanceRecords } = useAttendance();
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRecords = attendanceRecords.filter(record => {
    if (selectedStudent !== 'all' && record.studentId !== selectedStudent) return false;
    if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
    return true;
  });

  const getStudentName = (studentId: string) => {
    const student = mockDatabase.students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentReg = (studentId: string) => {
    const student = mockDatabase.students.find(s => s.id === studentId);
    return student?.registrationNumber || 'N/A';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'late': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'absent': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'present':
        return `${baseClasses} bg-emerald-100 text-emerald-800`;
      case 'late':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'absent':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Students</option>
              {mockDatabase.students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.registrationNumber})
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No attendance records found</p>
            <p className="text-sm text-gray-400">Records will appear here after completing sessions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Session ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{getStudentName(record.studentId)}</p>
                        <p className="text-sm text-gray-600">{getStudentReg(record.studentId)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-gray-600">
                        #{record.sessionId.slice(-8)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={getStatusBadge(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{record.timestamp.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-600">{record.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Present</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {filteredRecords.filter(r => r.status === 'present').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Late</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {filteredRecords.filter(r => r.status === 'late').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Absent</p>
                <p className="text-2xl font-bold text-red-900">
                  {filteredRecords.filter(r => r.status === 'absent').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}