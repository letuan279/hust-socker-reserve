import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import Landing from './pages/Landing'
import Booking from './pages/Booking';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin/booking" element={<Admin />} />

        <Route path="*" element={<Navigate to="/home" replace={true} />} />
      </Routes>
    </Router>
  );
}

export default App;