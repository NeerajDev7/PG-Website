import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import TenantsPage from './pages/TenantsPage'
import RoomsPage from  './pages/RoomsPage'
import Dashboard from './pages/Dashboard'
import NotificationPage from './pages/NotificationsPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import AddTenantPage from './pages/AddTenantPage'



function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path = "/" element={<LandingPage/>} />
      <Route path = "/login" element={<LoginPage/>} />
      <Route path = "/dashboard" element={<Dashboard/>} />
      <Route path = "/tenants" element={<TenantsPage/>} />
      <Route path = "/rooms" element={<RoomsPage/>} />
      <Route path = "/notifications" element={<NotificationPage/>} />
      <Route path = "/add-tenant" element = {<AddTenantPage/>}/>
    </Routes>
  </BrowserRouter>
)
}

export default App
