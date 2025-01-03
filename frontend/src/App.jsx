
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Toaster } from 'react-hot-toast';
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgetpassword";
import Resetpassword from "./pages/Resetpassword";
import Layout from "./pages/Layout";
import Generateurl from "./pages/Generateurl";
import Myurls from "./pages/Myurls";
import RedirectLInk from "./pages/RedirectLInk";
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
        <Route path="/acess/:code" element={<RedirectLInk />} /> 
      
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }
        />
          <Route
          path="/generateurl"
          element={
            <PrivateRoute>
              <Layout><Generateurl /></Layout>
            </PrivateRoute>
          }
        />
          <Route
          path="/myurls"
          element={
            <PrivateRoute>
              <Layout><Myurls /></Layout>
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
