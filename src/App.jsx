import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import OwnerLoginPage from './pages/OwnerLoginPage'
import Dashboard from './pages/Dashboard'
import TenantsPage from './pages/TenantsPage'
import RoomsPage from './pages/RoomsPage'
import NotificationsPage from './pages/NotificationsPage'
import AddTenantPage from './pages/AddTenantPage'
import TenantDashboard from './pages/TenantDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function AnimatedRoutes() {
    const location = useLocation()

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/owner/login' element={<OwnerLoginPage />} />
                <Route path='/tenant/dashboard' element={<TenantDashboard />} />
                <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path='/tenants' element={<ProtectedRoute><TenantsPage /></ProtectedRoute>} />
                <Route path='/rooms' element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
                <Route path='/notifications' element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path='/add-tenant' element={<ProtectedRoute><AddTenantPage /></ProtectedRoute>} />
            </Routes>
        </AnimatePresence>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    )
}

export default App