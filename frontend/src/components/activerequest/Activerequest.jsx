import { useState, useEffect } from 'react';
import axios from 'axios';
import './ActiveRequests.css'; // Import the custom CSS

function ActiveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial location state
  const [defaultLocation, setDefaultLocation] = useState({ lat: 17.2833, lng: 74.2333 });
  const [isLocationReady, setIsLocationReady] = useState(false);

  // First useEffect to get geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setDefaultLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setIsLocationReady(true); // Mark that location is ready
    }, function(error) {
      console.error("Error getting location:", error);
      setIsLocationReady(true); // Even on error, mark as ready to use default coordinates
    });
    
  }, []);
    const fetchRequests = async () => {
      try {
        console.log(defaultLocation);
        const url = `http://localhost:8080/api/help-requests/nearby?latitude=${defaultLocation.lat}&longitude=${defaultLocation.lng}&maxDistance=5000`;
        console.log(url);
        const data = await axios.get(url,
          {
            withCredentials: true
          }
        );
        console.log(data);
        setRequests(data.data.data);
      } catch(error) {
        console.log(error.message);
      }
    }

  // Second useEffect to fetch data when location is ready
  useEffect(() => {
    if (isLocationReady) {
      fetchRequests();
    }
  }, [isLocationReady]);

  // Helper function to get card background class based on urgency tier.
  const getTierClass = (urgencyTier) => {
    if (urgencyTier >= 8) {
      return "tier-high";
    } else if (urgencyTier >= 5) {
      return "tier-medium";
    } else {
      return "tier-low";
    }
  };

  // useEffect(() => {
    // Simulate fetching active requests from an API or data source.
    // const fetchRequests = async () => {
    //   const data = [
    //     {
    //       id: 1,
    //       name: "siddes",
    //       title: "Need Help with Groceries",
    //       description: "I need assistance carrying groceries from the store.",
    //       urgencyTier: 3, // Tier 3: Non-urgent Help
    //       isActive: true,
    //       completionTime: "2:00 PM",
    //       rewardCoins: 50,
    //       address: "123 Main St, City, Country",
    //     },
    //     {
    //       id: 2,
    //       name: "Sidde",
    //       title: "Severe Allergic Reaction",
    //       description: "I'm experiencing a severe allergic reaction and need help immediately.",
    //       urgencyTier: 8, // Tier 8: High Urgency
    //       isActive: true,
    //       completionTime: "ASAP",
    //       rewardCoins: 100,
    //       address: "456 Elm St, City, Country",
    //     },
    //     {
    //       id: 3,
    //       title: "Old Inactive Request",
    //       description: "This request is no longer active.",
    //       urgencyTier: 2, // Tier 2: Minor Help
    //       isActive: false,
    //       completionTime: "N/A",
    //       rewardCoins: 0,
    //       address: "789 Oak St, City, Country",
    //     },
    //   ];

      // Filter to only include active requests.
      // const activeRequests = data.filter(request => request.isActive);
      // setRequests(activeRequests);
      // fetchRequests();
    // };

  //   fetchRequests();
  // }, []);

  // Open the modal and set the selected request.
  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Close the modal.
  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  // Sort requests so that higher urgencyTier comes first.
  const sortedRequests = requests.length>0?[...requests].sort((a, b) => b.urgencyTier - a.urgencyTier):[];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Active Requests
      </h1>

      {sortedRequests.length > 0 ? (
        <div className="space-y-6">
          {sortedRequests.map(request => (
            <div
              key={request.id}
              className={`p-6 rounded-lg ${getTierClass(request.urgencyTier)} shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
            >
              <h2 className="text-2xl font-semibold mb-2 text-white">
                {request.title}
              </h2>
              <p className="mb-4 text-white">{request.description}</p>
              <div className="flex justify-between mb-4">
                <p className="text-white text-sm">
                  Complete by: {request.completionTime}
                </p>
                <p className="text-white text-sm">
                  Reward: {request.rewardCoins} Coins
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm">
                  Urgency Tier: {request.urgencyTier}
                </span>
                <button
                  onClick={() => openModal(request)}
                  className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">
          You currently have no active requests.
        </p>
      )}

      {/* DaisyUI Modal */}
      {isModalOpen && selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box text-white">
            <h3 className="font-bold text-lg">{selectedRequest.title}</h3>
            <p className="py-2">{selectedRequest.description}</p>
            <p className="py-2">
              <strong>Urgency Tier:</strong> {selectedRequest.urgencyTier}
            </p>
            <p className="py-2">
              <strong>Complete by:</strong> {selectedRequest.completionTime}
            </p>
            <p className="py-2">
              <strong>Name:</strong> {selectedRequest.name ? selectedRequest.name : 'N/A'}
            </p>
            <p className="py-2">
              <strong>Reward:</strong> {selectedRequest.rewardCoins} Coins
            </p>
            <p className="py-2">
              <strong>Address:</strong> {selectedRequest.address}
            </p>
            <div className="modal-action">
              <button className="btn bg-indigo-600" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveRequestsPage;
