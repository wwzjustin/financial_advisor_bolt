import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RealEstate from './pages/RealEstate';
import Investments from './pages/Investments';
import Retirement from './pages/Retirement';
import AIAdvisor from './pages/AIAdvisor';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/real-estate" element={<RealEstate />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/retirement" element={<Retirement />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;