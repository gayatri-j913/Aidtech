import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  // Default location set to Karad, Maharashtra
  const [defaultLocation, setDefaultLocation] = useState({});

  
  useEffect(() => {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        setDefaultLocation({lat: position.coords.latitude, lng: position.coords.longitude});
      });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: defaultLocation, 
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, phone } = formData;
    if (!name || !email || !password || !phone) {
      toast.error("All fields are required!");
      return;
    }

    try {
      formData.location = defaultLocation;
      console.log("Form Data:", formData);
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        formData,
        {withCredentials:true}
      );
      toast.success("Signup successful!");
      // console.log("User Signed Up:", response.data);

      // Reset form (keeping the default location)
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: defaultLocation,
      });
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Toaster />
      <div className="card w-96 shadow-2xl p-8 rounded-xl animate-fade-in bg-gray-800 border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="text-gray-300">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="text-gray-300">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="text-gray-300">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="text-gray-300">Phone</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6 bg-blue-600 hover:bg-blue-700 border-0"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
