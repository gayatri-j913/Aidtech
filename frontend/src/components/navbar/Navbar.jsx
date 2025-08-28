import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaTasks, FaHistory, FaEnvelope, FaCoins } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  // Using useState for dynamic coin count
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate();
  const getdata=async()=>{
    try {
      const res = await axios.post("http://localhost:8080/api/get-data",
       {},
       {withCredentials:true}
      )
      const check=res.data.verifiedPhone;
      console.log(res.data)
      setCoins(res.data.coins)
      console.log(res.data.coins);
      if(!check){
         navigate('/OTPVerification')
      }
  } catch (error) {
      console.log(error);
      navigate('/signin')
  }
  }
  useEffect(()=>{
      getdata();
  },[])
  const handlelogout=async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/logout",
       {},
      {withCredentials:true});
      console.log("User logged out:", response.data);
      toast.success(response.data.message);
      navigate("/signin");

    } catch (error) {
      console.log(Error);
    }
  }

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Left: App Name */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          MyApp
        </Link>
      </div>

      {/* Desktop Menu: visible on large screens */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="/">
              <FaHome className="inline mr-1" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/activerequest">
              <FaTasks className="inline mr-1" />
              Active Request
            </Link>
          </li>
          <li>
            <Link to="/pastrequest">
              <FaHistory className="inline mr-1" />
              Past Request
            </Link>
          </li>
          {/* <li>
            <Link to="/contact">
              <FaEnvelope className="inline mr-1" />
              Contact
            </Link>
          </li> */}
        </ul>
      </div>

      {/* Desktop Right: Coins and Profile (visible on large screens) */}
      <div className="navbar-end hidden lg:flex items-center gap-4">
        <div className="tooltip tooltip-bottom" data-tip="Coins">
          <div className="flex items-center gap-1">
            <FaCoins className="text-xl" />
            <span className="text-lg font-medium">{coins}</span>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" alt="Profile" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile">
                <span role="img" aria-label="Profile">👤</span> Profile
              </Link>
            </li>
            <li>

                <button onClick={handlelogout} role="img" aria-label="Logout">🚪Logout</button> 

            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu: visible on small screens, moved to the right */}
      <div className="navbar-end lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            <FaBars className="text-xl" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">
                <FaHome className="inline mr-1" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/activerequest">
                <FaTasks className="inline mr-1" />
                Active Request
              </Link>
            </li>
            <li>
              <Link to="/pastrequest">
                <FaHistory className="inline mr-1" />
                Past Request
              </Link>
            </li>
            {/* <li>
              <Link to="/contact">
                <FaEnvelope className="inline mr-1" />
                Contact
              </Link>
            </li> */}
            <li>
              <a>
                <FaCoins className="inline mr-1" />
                {coins} Coins
              </a>
            </li>
            <li>
              <Link to="/profile">
                <span role="img" aria-label="Profile">👤</span> Profile
              </Link>
            </li>
            <li>

                <button onClick={handlelogout} role="img" aria-label="Logout">🚪Logout</button> 

            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;