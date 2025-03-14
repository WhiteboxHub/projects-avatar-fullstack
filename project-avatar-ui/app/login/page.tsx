"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component
import logo from '../../public/images/ip_logo1.jpg';
import { useAuth } from "../../components/AuthContext"; // Import authentication context

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [alertMessage, ] = useState<string | null>(null); // Added state for alert message
  const [loading, setLoading] = useState(false); // Loading state

  const router = useRouter();
  const { login } = useAuth(); // Get the login function from the context
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log(API_URL);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setMessage(response.data.message);

      login(); // Update the global authentication state
      setLoading(false); // Stop loading

      router.push("/leads"); // Redirect after login
    } catch {
      setLoading(false); // Stop loading on error
      setError("Invalid username or password");
      setMessage(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    {alertMessage && ( // Conditional rendering of alert message
      <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
        {alertMessage}
      </div>
    )}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"> {/* Adjusted padding */}
        <div className="flex justify-center mb-4 mr-8">
          <Image src={logo} alt="Logo" width={200} height={200} /> {/* Increased logo size */}
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4"> {/* Reduced margin bottom */}
          Login
        </h2>
        {loading ? (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 bg-blue-600 text-white font-bold rounded-md transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              disabled={loading} // Disable the button while loading
            >
              Login
            </button>
          </form>
        )}
        {error && !loading && <p className="text-red-500 text-center mt-4">{error}</p>}
        {message && !loading && <p className="text-green-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
