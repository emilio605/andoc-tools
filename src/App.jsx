import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import FlujoCaja from './pages/FlujoCaja'
import AuditoriaShopify from './pages/AuditoriaShopify'
import AdsReporter from './pages/AdsReporter'
import Equipo from './pages/admin/Equipo'

import Onboarding from './pages/Onboarding'
import Brief from './pages/Brief'
import BriefIA from './pages/BriefIA'
import Propuesta from './pages/Propuesta'
import PlanMedios from './pages/PlanMedios'
import FeedFlow from './pages/FeedFlow'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Público */}
          <Route path="/login" element={<Login />} />

          {/* Redirigir raíz a dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protegidos - todos los roles */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/brief" element={
            <ProtectedRoute>
              <Brief />
            </ProtectedRoute>
          } />
          <Route path="/brief-ia" element={
            <ProtectedRoute>
              <BriefIA />
            </ProtectedRoute>
          } />
          <Route path="/propuesta" element={
            <ProtectedRoute>
              <Propuesta />
            </ProtectedRoute>
          } />
          <Route path="/flujo-caja" element={
            <ProtectedRoute>
              <FlujoCaja />
            </ProtectedRoute>
          } />
          <Route path="/auditoria" element={
            <ProtectedRoute>
              <AuditoriaShopify />
            </ProtectedRoute>
          } />
          <Route path="/ads" element={
            <ProtectedRoute>
              <AdsReporter />
            </ProtectedRoute>
          } />
          <Route path="/plan-medios" element={
            <ProtectedRoute>
              <PlanMedios />
            </ProtectedRoute>
          } />
          <Route path="/feedflow" element={
            <ProtectedRoute>
              <FeedFlow />
            </ProtectedRoute>
          } />

          {/* Admin + Editor */}
          <Route path="/clientes" element={
            <ProtectedRoute requiredRoles={['admin', 'editor']}>
              <Clientes />
            </ProtectedRoute>
          } />

          {/* Solo Admin */}
          <Route path="/admin/equipo" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Equipo />
            </ProtectedRoute>
          } />

          {/* Catch-all → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
