import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, GraduationCap, Users, Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
    role: 'student' as 'student' | 'teacher' | 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(credentials);
    if (!success) {
      setError('Invalid credentials. Please check your details and try again.');
    }
  };

  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: 'Student Portal',
      identifierLabel: 'Registration Number',
      identifierPlaceholder: 'Enter your registration number',
      passwordLabel: 'Date of Birth',
      passwordPlaceholder: 'YYYY-MM-DD',
      bgGradient: 'from-blue-500 to-indigo-600',
      description: 'Access your attendance records and status'
    },
    teacher: {
      icon: Users,
      title: 'Teacher Dashboard',
      identifierLabel: 'Teacher Name',
      identifierPlaceholder: 'Enter your full name',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password (4455@asdf)',
      bgGradient: 'from-emerald-500 to-teal-600',
      description: 'Manage classes and monitor attendance'
    },
    admin: {
      icon: Shield,
      title: 'Admin Panel',
      identifierLabel: 'Admin Name',
      identifierPlaceholder: 'Enter your admin name',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter admin password',
      bgGradient: 'from-purple-500 to-pink-600',
      description: 'View analytics and generate reports'
    }
  };

  const config = roleConfig[credentials.role];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Attendance</h1>
          <p className="text-blue-200">Automated Geo-fencing System</p>
        </div>

        {/* Role Selection */}
        <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-xl backdrop-blur-sm">
          {Object.entries(roleConfig).map(([role, config]) => {
            const IconComp = config.icon;
            return (
              <button
                key={role}
                onClick={() => setCredentials(prev => ({ ...prev, role: role as any }))}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  credentials.role === role
                    ? 'bg-white text-slate-800 shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span className="text-sm font-medium capitalize">{role}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${config.bgGradient} rounded-xl mb-3`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">{config.title}</h2>
            <p className="text-sm text-blue-200">{config.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier Field */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                {config.identifierLabel}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  value={credentials.identifier}
                  onChange={(e) => setCredentials(prev => ({ ...prev, identifier: e.target.value }))}
                  placeholder={config.identifierPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                {config.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={config.passwordPlaceholder}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r ${config.bgGradient} text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs font-medium text-blue-200 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-blue-300">
              <div>Student: ST001 | 2000-01-15</div>
              <div>Teacher: Dr. Sarah Mitchell | 4455@asdf</div>
              <div>Admin: Principal Adams | admin123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}