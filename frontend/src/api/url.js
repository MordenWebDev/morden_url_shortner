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
export const createurl = async (data) => {
  const response = await axios.post(`${baseurl}/url/generate`,data, config);
  return response.data; 
};
export const allurl = async (page) => {
    const response = await axios.get(`${baseurl}/url/user/urls?page=${page}&limit=5`, config);
    return response.data; 
  };

  export const acesslink = async (code,password) => {
    let url=password?`/url/redirect/${code}?password=${password}`:`/url/redirect/${code}`
    const response = await axios.get(`${baseurl}${url}`);
    return response.data; 
  };
  
