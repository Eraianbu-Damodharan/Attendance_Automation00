import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockDatabase } from '../data/mockDatabase';

interface AttendanceSession {
  id: string;
  teacherId: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  cutoffTime: number; // minutes after start
}

interface StudentLocation {
  studentId: string;
  status: 'outside' | 'present' | 'late';
  lastUpdated: Date;
  isInGeofence: boolean;
}

interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'present' | 'late' | 'absent';
  timestamp: Date;
}

interface AttendanceContextType {
  currentSession: AttendanceSession | null;
  studentLocations: StudentLocation[];
  attendanceRecords: AttendanceRecord[];
  startSession: (teacherId: string, subject: string, cutoffMinutes: number) => void;
  endSession: () => void;
  updateStudentLocation: (studentId: string, isInGeofence: boolean) => void;
  manualOverride: (studentId: string, newStatus: 'outside' | 'present' | 'late') => void;
  getStudentAttendanceHistory: (studentId: string) => AttendanceRecord[];
  getClassAttendanceStats: (subject?: string) => any;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [studentLocations, setStudentLocations] = useState<StudentLocation[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const startSession = (teacherId: string, subject: string, cutoffMinutes: number) => {
    const session: AttendanceSession = {
      id: Date.now().toString(),
      teacherId,
      subject,
      startTime: new Date(),
      isActive: true,
      cutoffTime: cutoffMinutes
    };

    setCurrentSession(session);

    // Initialize all students as outside
    const initialLocations: StudentLocation[] = mockDatabase.students.map(student => ({
      studentId: student.id,
      status: 'outside',
      lastUpdated: new Date(),
      isInGeofence: false
    }));

    setStudentLocations(initialLocations);

    // Simulate some students being present initially
    setTimeout(() => {
      const presentStudents = initialLocations.slice(0, Math.floor(initialLocations.length * 0.6));
      presentStudents.forEach(student => {
        updateStudentLocation(student.studentId, true);
      });
    }, 2000);
  };

  const endSession = () => {
    if (!currentSession) return;

    const finalizedSession = { ...currentSession, endTime: new Date(), isActive: false };
    
    // Finalize attendance based on student locations
    const finalRecords: AttendanceRecord[] = studentLocations.map(location => {
      let finalStatus: 'present' | 'late' | 'absent';
      
      if (location.status === 'present') {
        finalStatus = 'present';
      } else if (location.status === 'late') {
        finalStatus = 'late';
      } else {
        finalStatus = 'absent';
      }

      return {
        id: Date.now().toString() + location.studentId,
        sessionId: currentSession.id,
        studentId: location.studentId,
        status: finalStatus,
        timestamp: new Date()
      };
    });

    setAttendanceRecords(prev => [...prev, ...finalRecords]);
    setCurrentSession(null);
    setStudentLocations([]);
  };

  const updateStudentLocation = (studentId: string, isInGeofence: boolean) => {
    if (!currentSession) return;

    const now = new Date();
    const sessionStart = currentSession.startTime;
    const minutesElapsed = Math.floor((now.getTime() - sessionStart.getTime()) / (1000 * 60));
    
    setStudentLocations(prev => prev.map(location => {
      if (location.studentId === studentId) {
        let newStatus: 'outside' | 'present' | 'late';
        
        if (isInGeofence) {
          if (minutesElapsed <= currentSession.cutoffTime) {
            newStatus = 'present';
          } else {
            newStatus = 'late';
          }
        } else {
          newStatus = 'outside';
        }

        return {
          ...location,
          status: newStatus,
          lastUpdated: now,
          isInGeofence
        };
      }
      return location;
    }));
  };

  const manualOverride = (studentId: string, newStatus: 'outside' | 'present' | 'late') => {
    setStudentLocations(prev => prev.map(location => {
      if (location.studentId === studentId) {
        return {
          ...location,
          status: newStatus,
          lastUpdated: new Date()
        };
      }
      return location;
    }));
  };

  const getStudentAttendanceHistory = (studentId: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => record.studentId === studentId);
  };

  const getClassAttendanceStats = (subject?: string) => {
    const relevantRecords = subject 
      ? attendanceRecords.filter(record => {
          const session = attendanceRecords.find(r => r.sessionId === record.sessionId);
          return session;
        })
      : attendanceRecords;

    const total = relevantRecords.length;
    const present = relevantRecords.filter(r => r.status === 'present').length;
    const late = relevantRecords.filter(r => r.status === 'late').length;
    const absent = relevantRecords.filter(r => r.status === 'absent').length;

    return {
      total,
      present,
      late,
      absent,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((late / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0
    };
  };

  return (
    <AttendanceContext.Provider value={{
      currentSession,
      studentLocations,
      attendanceRecords,
      startSession,
      endSession,
      updateStudentLocation,
      manualOverride,
      getStudentAttendanceHistory,
      getClassAttendanceStats
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}