import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import LoginPage from './pages/auth/LoginPage'

import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

import DashboardPage from './pages/dashboard/DashboardPage'

import StaffUserPage from './pages/users/StaffUserPage'
import RolesPage from './pages/roles/RolesPage'
import ModulesPage from './pages/modules/ModulesPage'
import UserPage from './pages/users/UserPage'
import MobileUserDevicePage from './pages/devices/MobileUserDevicePage'
import ChangePasswordPage from './pages/account/ChangePasswordPage'
import ProfilePage from './pages/account/ProfilePage'
import ContentEditorPage from './pages/settings/ContentEditorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* DEFAULT */}
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          {/* USERS */}
          <Route
            path="users"
            element={<StaffUserPage />}
          />

          {/* MOBILE USERS */}
          <Route
            path="mobile-users"
            element={<UserPage />}
          />

          <Route
            path="mobile-user-devices"
            element={<MobileUserDevicePage />}
          />

          <Route
            path="change-password"
            element={<Navigate to="/settings/change-password" replace />}
          />

          <Route path="settings/change-password" element={<ChangePasswordPage />} />

          <Route path="profile" element={<ProfilePage />} />

          <Route path="settings/privacy-policy" element={<ContentEditorPage title="Privacy Policy" contentType="privacy_policy" />} />
          <Route path="settings/terms-and-conditions" element={<ContentEditorPage title="Terms & Conditions" contentType="terms_conditions" />} />
          <Route path="settings/contact-us" element={<ContentEditorPage title="Contact Us" contentType="about_us" />} />

          {/* ROLES */}
          <Route
            path="roles"
            element={<RolesPage />}
          />

          {/* MODULES */}
          <Route
            path="modules"
            element={<ModulesPage />}
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}
