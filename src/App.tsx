import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Locations from './pages/Locations';
import ServiceDetail from './pages/ServiceDetail';
import JobDetail from './pages/JobDetail';
import Admin from './pages/Admin';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Catalog from './pages/Catalog';
import CourseForm from './pages/admin/CourseForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="locations" element={<Locations />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="jobs/:id" element={<JobDetail />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Admin />} />
          <Route path="course/new" element={<CourseForm />} />
          <Route path="course/edit/:id" element={<CourseForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
