import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import { mockDatabase } from '../../data/mockDatabase';
import { Play, Square, Clock, Settings } from 'lucide-react';

export default function SessionControl() {
  const { user } = useAuth();
  const { currentSession, startSession, endSession } = useAttendance();
  const [showForm, setShowForm] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({
    subject: '',
    cutoffMinutes: 10
  });

  const teacher = mockDatabase.teachers.find(t => t.id === user?.id);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    startSession(user?.id || '', sessionConfig.subject, sessionConfig.cutoffMinutes);
    setShowForm(false);
  };

  const handleEndSession = () => {
    endSession();
  };

  if (currentSession) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Session Active</h3>
            <p className="text-emerald-100 mb-1">Subject: {currentSession.subject}</p>
            <p className="text-emerald-100 mb-4">
              Started: {currentSession.startTime.toLocaleTimeString()}
            </p>
            <div className="flex items-center space-x-2 text-emerald-100">
              <Clock className="w-4 h-4" />
              <span>Late cutoff: {currentSession.cutoffTime} minutes</span>
            </div>
          </div>
          <button
            onClick={handleEndSession}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
          >
            <Square className="w-5 h-5" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Start New Session</h3>
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={sessionConfig.subject}
              onChange={(e) => setSessionConfig(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select a subject</option>
              {teacher?.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Cutoff (minutes)
            </label>
            <input
              type="number"
              value={sessionConfig.cutoffMinutes}
              onChange={(e) => setSessionConfig(prev => ({ ...prev, cutoffMinutes: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="1"
              max="60"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Students arriving after this time will be marked as late
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start Session</span>
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Settings className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Session</h3>
      <p className="text-gray-600 mb-6">Start a new session to begin tracking attendance</p>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors mx-auto"
      >
        <Play className="w-5 h-5" />
        <span>Start Session</span>
      </button>
    </div>
  );
}