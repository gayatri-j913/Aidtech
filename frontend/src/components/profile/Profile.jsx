import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Profile() {
  const navigate=useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch user data from backend
  const getData = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/get-data',
        {},
        { withCredentials: true }
      );
      console.log('Response:', res.data);
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  // Show a loading indicator while the data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <span>Loading...</span>
      </div>
    );
  }
  // If user data is not loaded successfully, show an error message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <span>Error loading user data.</span>
      </div>
    );
  }
  // Prepare chart data, using fallback 0 for canceledTasks if it's not provided
  const canceledTasks = user.canceledTasks || 0;
  const tasksDoughnutData = {
    labels: ['Completed', 'Pending', 'Canceled'],
    datasets: [
      {
        data: [user.completedTasks, user.pendingTasks, canceledTasks],
        backgroundColor: ['#34D399', '#FBBF24', '#F87171'], // green, amber, red
        hoverBackgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const tasksBarData = {
    labels: ['Total Tasks', 'Completed', 'Pending', 'Canceled'],
    datasets: [
      {
        label: 'Tasks',
        data: [user.totalTasks, user.completedTasks, user.pendingTasks, canceledTasks],
        backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'], // blue, green, amber, red
      },
    ],
  };

  

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Information Card */}
        <div className="card bg-gray-800 shadow-xl rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="mt-2">Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p className="mt-2">
                Coins: <span className="font-bold text-green-400">{user.coins}</span>
              </p>
            </div>
            
          </div>
        </div>

        {/* Dashboard Card */}
        <div className="card bg-gray-800 shadow-xl rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Doughnut Chart for Task Distribution */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Task Distribution</h2>
            <div className="w-full h-64">
              <Doughnut data={tasksDoughnutData} />
            </div>
          </div>
          {/* Bar Chart for Task Overview */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Task Overview</h2>
            <div className="w-full h-64">
              <Bar
                data={tasksBarData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: 'white' },
                    },
                    x: {
                      ticks: { color: 'white' },
                    },
                  },
                  plugins: {
                    legend: { labels: { color: 'white' } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;