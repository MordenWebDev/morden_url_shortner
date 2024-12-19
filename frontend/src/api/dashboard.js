import axios from "axios";
let dev=false;
let baseurl=dev?"http://localhost:3000":"https://morden-url-shortner.onrender.com"
const token = localStorage.getItem('authToken');

// Set up the request headers with the token
const config = {
  headers: {
    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
  },
};
export const getdashboardkpy = async () => {
  const response = await axios.get(`${baseurl}/url/user/dashboard`, config);
  return response.data; // Assuming the API returns a token
};
