import axios from "axios";
let dev=false;
let baseurl=dev?"http://localhost:3000":"https://morden-url-shortner.onrender.com"
export const forgetpassword = async (email) => {
  const response = await axios.post(`${baseurl}/password/forgot`, {
    email
  });
  return response.data; // Assuming the API returns a token
};

export const resetpassword = async (password,token) => {
    const response = await axios.post(`${baseurl}/password/reset/${token}`, {
        newPassword:password
    });
    return response.data; // Assuming the API returns a token
  };

