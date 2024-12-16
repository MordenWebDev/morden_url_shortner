import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgetpassword } from "@/api/forgetpassword";  // Import the login function
import { useNavigate } from "react-router-dom"; // For redirection after login
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';


const ForgotPassword = () => {
 

  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for redirecting after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the login API function
      const data = await forgetpassword(formData.email);  // API call here

      if (data.success) {
 
        navigate("/login");
        toast.success('Password reset mail sent');
   
      } else {
        throw new Error("unable to reset password");
      }
    } catch (err) {
      
  
      toast.error(err.response.data.message || "Please try again.");
    } finally {
      setLoading(false); // Disable loading state after completion
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">Forget Password</h2>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submiting...": "submit"}
        </Button>

        {/* Links for Sign-up and Forgot Password */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
          </p>
      
        </div>
      </form>
      
    </div>
  );
};

export default ForgotPassword;
