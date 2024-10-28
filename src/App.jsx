import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import XRayAnalysis from './XRayAnalysis';
import DeveloperInfo from './DeveloperInfo';

function App() {
  return (
    <Router>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
          <Button
            component={Link}
            to="/developer"
            variant="outlined"
            size="small"
          >
            ผู้พัฒนา
          </Button>
        </Box>
        <Routes>
          <Route path="/" element={<XRayAnalysis />} />
          <Route path="/developer" element={<DeveloperInfo />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;