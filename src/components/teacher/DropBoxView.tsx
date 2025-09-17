import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { mockDatabase } from '../../data/mockDatabase';
import { MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function DropBoxView() {
  const { studentLocations, manualOverride, updateStudentLocation } = useAttendance();

  const getStudentsByStatus = (status: 'outside' | 'present' | 'late') => {
    return studentLocations.filter(location => location.status === status);
  };

  const getStudentName = (studentId: string) => {
    const student = mockDatabase.students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentReg = (studentId: string) => {
    const student = mockDatabase.students.find(s => s.id === studentId);
    return student?.registrationNumber || 'N/A';
  };

  const dropBoxes = [
    {
      status: 'outside',
      title: 'Outside Zone',
      icon: MapPin,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-500',
      headerBg: 'bg-gray-100',
      count: getStudentsByStatus('outside').length
    },
    {
      status: 'present',
      title: 'Present',
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-500',
      headerBg: 'bg-emerald-100',
      count: getStudentsByStatus('present').length
    },
    {
      status: 'late',
      title: 'Late Arrivals',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      headerBg: 'bg-yellow-100',
      count: getStudentsByStatus('late').length
    }
  ] as const;

  const handleStatusChange = (studentId: string, newStatus: 'outside' | 'present' | 'late') => {
    manualOverride(studentId, newStatus);
  };

  const simulateStudentMovement = (studentId: string) => {
    // Simulate geo-fencing detection
    const isCurrentlyInside = studentLocations.find(s => s.studentId === studentId)?.isInGeofence;
    updateStudentLocation(studentId, !isCurrentlyInside);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Attendance Monitor</h3>
        <div className="text-sm text-gray-600">
          Total Students: {studentLocations.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dropBoxes.map((box) => {
          const students = getStudentsByStatus(box.status);
          const Icon = box.icon;

          return (
            <div key={box.status} className={`${box.bgColor} ${box.borderColor} border rounded-xl overflow-hidden`}>
              {/* Header */}
              <div className={`${box.headerBg} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${box.iconColor}`} />
                  <h4 className="font-semibold text-gray-900">{box.title}</h4>
                </div>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                  {box.count}
                </span>
              </div>

              {/* Student List */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon className={`w-8 h-8 ${box.iconColor} mx-auto mb-2 opacity-50`} />
                    <p className="text-gray-500 text-sm">No students</p>
                  </div>
                ) : (
                  students.map((location) => (
                    <div key={location.studentId} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{getStudentName(location.studentId)}</p>
                          <p className="text-xs text-gray-600">{getStudentReg(location.studentId)}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${location.isInGeofence ? 'bg-emerald-500' : 'bg-red-500'}`} 
                             title={location.isInGeofence ? 'In geofence' : 'Outside geofence'}>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        Last updated: {location.lastUpdated.toLocaleTimeString()}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {box.status !== 'present' && (
                            <button
                              onClick={() => handleStatusChange(location.studentId, 'present')}
                              className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                            >
                              Mark Present
                            </button>
                          )}
                          {box.status !== 'late' && (
                            <button
                              onClick={() => handleStatusChange(location.studentId, 'late')}
                              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                            >
                              Mark Late
                            </button>
                          )}
                          {box.status !== 'outside' && (
                            <button
                              onClick={() => handleStatusChange(location.studentId, 'outside')}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                              Move Out
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => simulateStudentMovement(location.studentId)}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          title="Simulate geo-fence detection"
                        >
                          📍 Geo
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              // Simulate all students entering geofence
              studentLocations.forEach(location => {
                updateStudentLocation(location.studentId, true);
              });
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={() => {
              // Simulate random student movements
              const randomStudents = studentLocations.slice(0, Math.floor(studentLocations.length * 0.3));
              randomStudents.forEach(location => {
                const randomStatus = Math.random() > 0.5;
                updateStudentLocation(location.studentId, randomStatus);
              });
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Simulate Movement</span>
          </button>
        </div>
      </div>
    </div>
  );
}