import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        return true; // If no expiration field, treat it as expired
      }
      return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
    } catch (error) {
      console.log(error)
      return true; // Treat invalid tokens as expired
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token||isTokenExpired(token)) {
      navigate("/login"); 
    }
  }, [navigate]);

  return children; // Render protected children if authenticated
};

export default PrivateRoute;
