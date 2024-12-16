import axios from "axios";

export const forgetpassword = async (email) => {
  const response = await axios.post("http://localhost:3000/password/forgot", {
    email
  });
  return response.data; // Assuming the API returns a token
};

export const resetpassword = async (password,token) => {
    const response = await axios.post(`http://localhost:3000/password/reset/${token}`, {
        newPassword:password
    });
    return response.data; // Assuming the API returns a token
  };

