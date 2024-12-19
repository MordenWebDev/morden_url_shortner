import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import toast from 'react-hot-toast';
import { useParams } from "react-router-dom";
import { acesslink } from "@/api/url"; 
import { AlertTriangle } from "lucide-react";

const RedirectLInk = () => {
    const { code } = useParams();

  const [formData, setFormData] = useState({ password: "" });
  const [loading, setLoading] = useState(false);
  const [showpasswordform, setshowpasswordform] = useState(false);
  const [showexpiry, setshowexpiry] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Call the login API function
        const response = await acesslink(code, formData.password);  // API call here
        console.log(response);
      } catch (err) {
        if(err.response?.data?.message=="Password required."){
            setshowpasswordform(true)
        }else if(err.response?.data?.message=="URL has expired."){
            setshowexpiry(true)
        }
        toast.error(err.response?.data?.message || "Please try again.");
      } finally {
        setLoading(false); // Disable loading state after completion
      }
    };

    fetchData(); // Invoke the async function inside useEffect
  }, []); // Empty dependency array to run the effect only once
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the login API function
    const response = await acesslink(code,formData.password);  // API call here
    if (response.success) {
        // Show a toast message saying the user will be redirected
        toast('You will be redirected in a few seconds...', {
          icon: '🚀',
          duration: 3000, // Toast will show for 3 seconds
          style: {
            background: '#333',
            color: '#fff',
          },
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = response.redirecturl;
        }, 3000); // 3 seconds delay for redirection
      }
    } catch (err) {
      
  
      toast.error(err.response.data.message || "Please try again.");
    } finally {
      setLoading(false); // Disable loading state after completion
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
     {showpasswordform&&
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">Link is Password Protected</h2>

        <div className="space-y-4">
        <div className="grid gap-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Enter  Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>


        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submiting...": "submit"}
        </Button>

    
      </form>}
      {showexpiry && (
        <div style={{ color: 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <AlertTriangle style={{ marginRight: '10px' }} size={24} color="red" />
          The link has expired. Please request a new one.
        </div>
      )}
    </div>
  );
};

export default RedirectLInk;


