import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })));
const ResearchPage = lazy(() => import('../pages/ResearchPage').then((module) => ({ default: module.ResearchPage })));
const PublicationsPage = lazy(() => import('../pages/PublicationsPage').then((module) => ({ default: module.PublicationsPage })));
const TeachingPage = lazy(() => import('../pages/TeachingPage').then((module) => ({ default: module.TeachingPage })));
const GalleryPage = lazy(() => import('../pages/GalleryPage').then((module) => ({ default: module.GalleryPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));

const RouteFallback = () => <div className="min-h-screen bg-ink-950" />;

export const AppRouter = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="publications" element={<PublicationsPage />} />
        <Route path="teaching" element={<TeachingPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="admin" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);