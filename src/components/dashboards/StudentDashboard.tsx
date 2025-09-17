import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockDatabase } from '../../data/mockDatabase';
import { CheckCircle, Clock, XCircle, Calendar, TrendingUp, MapPin } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { currentSession, studentLocations, getStudentAttendanceHistory } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState('all');

  const student = mockDatabase.students.find(s => s.id === user?.id);
  const attendanceHistory = getStudentAttendanceHistory(user?.id || '');
  const currentLocation = studentLocations.find(s => s.studentId === user?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'late': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'absent': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <MapPin className="w-5 h-5 text-gray-500" />;
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

  const filteredHistory = selectedSubject === 'all' 
    ? attendanceHistory 
    : attendanceHistory.filter(record => {
        // In a real app, you'd link sessions to subjects
        return true;
      });

  const attendanceStats = {
    total: filteredHistory.length,
    present: filteredHistory.filter(r => r.status === 'present').length,
    late: filteredHistory.filter(r => r.status === 'late').length,
    absent: filteredHistory.filter(r => r.status === 'absent').length
  };

  const attendancePercentage = attendanceStats.total > 0 
    ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name}</h1>
        <p className="text-gray-600 mt-1">Track your attendance and stay updated with your academic progress</p>
      </div>

      {/* Current Status Card */}
      {currentSession && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Live Session Active</h2>
                <p className="text-blue-100 mb-4">Subject: {currentSession.subject}</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(currentLocation?.status || 'outside')}
                  <span className="font-medium capitalize">
                    {currentLocation?.status === 'outside' ? 'Outside Geofence' : currentLocation?.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentLocation?.isInGeofence 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentLocation?.isInGeofence ? 'In Range' : 'Out of Range'}
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Last updated: {currentLocation?.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-emerald-600">{attendanceStats.present}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {student?.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No attendance records found</p>
              <p className="text-sm text-gray-400">Your attendance history will appear here once sessions are completed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium text-gray-900">Session #{record.sessionId.slice(-4)}</p>
                      <p className="text-sm text-gray-600">
                        {record.timestamp.toLocaleDateString()} at {record.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={getStatusBadge(record.status)}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student Info */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Registration Number</p>
            <p className="text-lg font-semibold text-gray-900">{student?.registrationNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Class</p>
            <p className="text-lg font-semibold text-gray-900">{student?.class}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600 mb-2">Enrolled Subjects</p>
            <div className="flex flex-wrap gap-2">
              {student?.subjects.map(subject => (
                <span key={subject} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}