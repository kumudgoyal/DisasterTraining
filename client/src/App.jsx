import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import IncidentListPage from './pages/IncidentListPage';
import IncidentCreatePage from './pages/IncidentCreatePage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import FieldReportPage from './pages/FieldReportPage';
import ShelterPage from './pages/ShelterPage';
import ResourcePage from './pages/ResourcePage';
import AlertPage from './pages/AlertPage';
import DamageAssessmentPage from './pages/DamageAssessmentPage';
import TrainingPage from './pages/TrainingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import OrganizationPage from './pages/OrganizationPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AuditLogPage from './pages/AuditLogPage';
import PublicPage from './pages/PublicPage';
import PublicReportPage from './pages/PublicReportPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public citizen portal routes */}
        <Route path="/public" element={<PublicLayout />}>
          <Route index element={<PublicPage />} />
          <Route path="report" element={<PublicReportPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected EOC dashboard and operational routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="incidents" element={<IncidentListPage />} />
          <Route path="incidents/new" element={<IncidentCreatePage />} />
          <Route path="incidents/:id" element={<IncidentDetailPage />} />
          <Route path="field-report" element={<FieldReportPage />} />
          <Route path="shelters" element={<ShelterPage />} />
          <Route path="resources" element={<ResourcePage />} />
          <Route path="alerts" element={<AlertPage />} />
          <Route path="damage-assessment" element={<DamageAssessmentPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="organizations" element={<OrganizationPage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
          <Route path="admin/audit-log" element={<AuditLogPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
