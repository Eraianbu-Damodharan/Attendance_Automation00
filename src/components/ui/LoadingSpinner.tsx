import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-transparent mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Smart Attendance</h2>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
}