import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Application } from './pages/Application';
import { ApplicationStatus } from './pages/ApplicationStatus';
import { Courses } from './pages/Courses';
import { Profile } from './pages/Profile';
import Games from './pages/Games';
import GamePlay from './pages/GamePlay';
import Exams from './pages/Exams';
import ExamAttempt from './pages/ExamAttempt';
import ExamDetails from './pages/ExamDetails';
import { CreateExam } from './pages/CreateExam';
import PremiumDashboard from './pages/PremiumDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ManageUsers from './pages/ManageUsers';
import Videos from './pages/Videos';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Student */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/premium-dashboard"
          element={
            <ProtectedRoute requiredRoles={['premium']}>
              <PremiumDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Applications */}
        <Route
          path="/application"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium']}>
              <Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application-status"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium']}>
              <ApplicationStatus />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Content */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium', 'staff', 'admin']}>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videos"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium', 'staff', 'admin']}>
              <Videos />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Games */}
        <Route
          path="/games"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium']}>
              <Games />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games/:gameId"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium']}>
              <GamePlay />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Exams */}
        <Route
          path="/exams"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium', 'staff', 'admin']}>
              <Exams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams/:examId"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium', 'staff', 'admin']}>
              <ExamAttempt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams/:examId/details"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium', 'staff', 'admin']}>
              <ExamDetails />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRoles={['student', 'premium', 'staff', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['admin', 'follow_up']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Teacher */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute requiredRoles={['staff', 'teacher']}>
              <TeacherDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-exam"
          element={
            <ProtectedRoute requiredRoles={['staff', 'admin']}>
              <CreateExam />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}