
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Toaster } from 'react-hot-toast';
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgetpassword";
import Resetpassword from "./pages/Resetpassword";
const App = () => {
  return (
    <div>

   
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/password/reset/:token" element={<Resetpassword />} /> 

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
