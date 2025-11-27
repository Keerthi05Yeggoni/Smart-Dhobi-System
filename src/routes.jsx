import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const LoginChoice = lazy(() => import('./pages/Auth/LoginChoice'))
const StudentLogin = lazy(() => import('./pages/Auth/StudentLogin'))
const StaffLogin = lazy(() => import('./pages/Auth/StaffLogin'))
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'))

const ProfileSetup = lazy(() => import('./pages/Student/ProfileSetup'))
const StudentDashboard = lazy(() => import('./pages/Student/StudentDashboard'))
const Dropoff = lazy(() => import('./pages/Student/Dropoff'))
const Status = lazy(() => import('./pages/Student/Status'))
const History = lazy(() => import('./pages/Student/History'))

const StaffDashboard = lazy(() => import('./pages/Staff/StaffDashboard'))
const BagDetail = lazy(() => import('./pages/Staff/BagDetail'))

const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminBagView = lazy(() => import('./pages/Admin/AdminBagView'))

// Elegant loading component
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: 20,
      padding: 48
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '3px solid var(--glass-border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{
        color: 'var(--muted)',
        fontSize: 15,
        fontWeight: 500
      }}>
        Loading...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LoginChoice />} />

        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/staff" element={<StaffLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        <Route path="/student/profile-setup" element={<ProfileSetup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/dropoff" element={<Dropoff />} />
        <Route path="/student/status" element={<Status />} />
        <Route path="/student/history" element={<History />} />

        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/bag/:bagId" element={<BagDetail />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bag/:bagId" element={<AdminBagView />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
