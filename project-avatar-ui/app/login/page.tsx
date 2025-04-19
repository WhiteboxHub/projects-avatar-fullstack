"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../public/images/ip_logo1.jpg";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [alertMessage, ] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false); 

  const router = useRouter();
  const { login } = useAuth(); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log(API_URL);

  // Configure axios defaults for CORS
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 
    setError(null); 
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        }
      });

      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setMessage(response.data.message);

      login(); 
      setLoading(false); 
      router.push("/leads"); 
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err) && err.message.includes('CORS')) {
        setError("CORS error: Unable to connect to the server. Please check server configuration.");
      } else {
        setError("Invalid username or password");
      }
      setMessage(null);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    {alertMessage && ( 
      <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
        {alertMessage}
      </div>
    )}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative"> 
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" width={180} height={180} className="rounded-lg" /> 
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6"> 
          Login
        </h2>
        {loading ? (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="username"
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg shadow transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                disabled={loading}
              >
                Login
              </button>
            </div>
          </form>
        )}
        {error && !loading && <p className="text-red-500 text-center mt-4">{error}</p>}
        {message && !loading && <p className="text-green-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
