import axios from "axios";
let dev=false;
let baseurl=dev?"http://localhost:3000":"https://morden-url-shortner.onrender.com"
export const login = async (email, password) => {
  const response = await axios.post(`${baseurl}/auth/login`, {
    email,
    password,
  });
  return response.data; // Assuming the API returns a token
};
export const signup = async (email, password) => {
  const response = await axios.post(`${baseurl}/auth/register`, {
    email,
    password,
  });
  return response.data; // Assuming the API returns a token
};
