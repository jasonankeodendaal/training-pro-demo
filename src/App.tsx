import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Locations from './pages/Locations';
import ServiceDetail from './pages/ServiceDetail';
import JobDetail from './pages/JobDetail';
import Admin from './pages/Admin';
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/course/new" element={<CourseForm />} />
        <Route path="/admin/course/edit/:id" element={<CourseForm />} />
      </Routes>
    </BrowserRouter>
  );
}
