import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockDatabase } from '../../data/mockDatabase';
import SessionControl from '../teacher/SessionControl';
import DropBoxView from '../teacher/DropBoxView';
import AttendanceHistory from '../shared/AttendanceHistory';
import { Play, Square, Clock, Users, Calendar, BarChart3 } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { currentSession, studentLocations, getClassAttendanceStats } = useAttendance();
  const [activeTab, setActiveTab] = useState('session');

  const teacher = mockDatabase.teachers.find(t => t.id === user?.id);
  const stats = getClassAttendanceStats();

  const tabs = [
    { id: 'session', label: 'Live Session', icon: Play },
    { id: 'history', label: 'Attendance History', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mt-1">Manage your classes and monitor attendance in real-time</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Session Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentSession ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${currentSession ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              {currentSession ? 
                <Play className="w-6 h-6 text-emerald-600" /> : 
                <Square className="w-6 h-6 text-gray-600" />
              }
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Online</p>
              <p className="text-2xl font-bold text-gray-900">
                {studentLocations.filter(s => s.isInGeofence).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentSession ? 
                  Math.floor((new Date().getTime() - currentSession.startTime.getTime()) / 60000) + 'm' : 
                  '0m'
                }
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'session' && (
            <div className="space-y-6">
              <SessionControl />
              {currentSession && <DropBoxView />}
            </div>
          )}
          
          {activeTab === 'history' && (
            <AttendanceHistory />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-emerald-600">Present</p>
                  <p className="text-2xl font-bold text-emerald-900">{stats.presentPercentage}%</p>
                  <p className="text-xs text-emerald-600">{stats.present} students</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-600">Late</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.latePercentage}%</p>
                  <p className="text-xs text-yellow-600">{stats.late} students</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-600">Absent</p>
                  <p className="text-2xl font-bold text-red-900">{stats.absentPercentage}%</p>
                  <p className="text-xs text-red-600">{stats.absent} students</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-600">Total Records</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-600">All sessions</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Subjects</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {teacher?.subjects.map((subject) => (
                    <div key={subject} className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="font-medium text-gray-900">{subject}</p>
                      <p className="text-sm text-gray-600">Classes: {teacher.classes.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}