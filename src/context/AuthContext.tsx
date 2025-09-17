import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockDatabase } from '../data/mockDatabase';

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  registrationNumber?: string;
  subjects?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface LoginCredentials {
  identifier: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('attendanceSystemUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      let authenticatedUser: User | null = null;

      if (credentials.role === 'student') {
        const student = mockDatabase.students.find(s => 
          s.registrationNumber === credentials.identifier && 
          s.dob === credentials.password
        );
        if (student) {
          authenticatedUser = {
            id: student.id,
            name: student.name,
            role: 'student',
            registrationNumber: student.registrationNumber
          };
        }
      } else if (credentials.role === 'teacher') {
        const teacher = mockDatabase.teachers.find(t => 
          t.name.toLowerCase() === credentials.identifier.toLowerCase() && 
          credentials.password === '4455@asdf'
        );
        if (teacher) {
          authenticatedUser = {
            id: teacher.id,
            name: teacher.name,
            role: 'teacher',
            subjects: teacher.subjects
          };
        }
      } else if (credentials.role === 'admin') {
        const admin = mockDatabase.admins.find(a => 
          a.name.toLowerCase() === credentials.identifier.toLowerCase() && 
          a.password === credentials.password
        );
        if (admin) {
          authenticatedUser = {
            id: admin.id,
            name: admin.name,
            role: 'admin'
          };
        }
      }

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('attendanceSystemUser', JSON.stringify(authenticatedUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('attendanceSystemUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}