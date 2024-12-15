import axios from "axios";

export const login = async (email, password) => {
  const response = await axios.post("http://localhost:3000/auth/login", {
    email,
    password,
  });
  return response.data; // Assuming the API returns a token
};
