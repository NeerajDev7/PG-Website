import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import TenantsPage from './pages/TenantsPage'
import RoomsPage from './pages/RoomsPage'
import NotificationsPage from './pages/NotificationsPage'
import AddTenantPage from './pages/AddTenantPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path='/tenants' element={<ProtectedRoute><TenantsPage /></ProtectedRoute>} />
                <Route path='/rooms' element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
                <Route path='/notifications' element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path='/add-tenant' element={<ProtectedRoute><AddTenantPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App