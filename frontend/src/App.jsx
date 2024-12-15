
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
    <div>

   
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
    <Toaster />
    </div>
  );
};

export default App;
