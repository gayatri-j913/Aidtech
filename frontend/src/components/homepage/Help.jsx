import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

function Help() {
  // Modal state management

  const [defaultLocation, setDefaultLocation] = useState({ lat: 17.2833, lng: 74.2333 });
  useEffect(() => {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        setDefaultLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
  }, []);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fields from the UI
  const [title, setTitle] = useState('');
  const [selectedHelp, setSelectedHelp] = useState(null);
  const [helpDescription, setHelpDescription] = useState('');
  const [coinReward, setCoinReward] = useState('');
  const [location, setLocation] = useState(null);
  const [completionTime, setCompletionTime] = useState('');

  // For showing submitted details in the success modal
  const [submittedHelp, setSubmittedHelp] = useState('');
  const [submittedDescription, setSubmittedDescription] = useState('');

  // Default location value

  // List of help options (tiers)
  const helpOptions = [
    'Tier 10: Critical Emergency',
    'Tier 9: Severe Emergency',
    'Tier 8: High Urgency',
    'Tier 7: Emergency Assistance',
    'Tier 6: Serious Medical Issue',
    'Tier 5: Moderate Medical Issue',
    'Tier 4: Routine Help Request',
    'Tier 3: Non-urgent Help',
    'Tier 2: Minor Help',
    'Tier 1: Convenience Request'
  ];

  // Open the help selection modal
  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  // Close the help selection modal and reset fields
  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
    setSelectedHelp(null);
    setHelpDescription('');
    setTitle('');
    setCoinReward('');
    setLocation(null);
    setCompletionTime('');
  };

  // Validate and move to confirmation modal
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please provide a title for your request.");
      return;
    }
    if (!selectedHelp) {
      toast.error("Please select a help option before submitting.");
      return;
    }
    if (!helpDescription.trim()) {
      toast.error("Please provide a brief description of your situation.");
      return;
    }
    // (completionTime is optional)
    setIsConfirmModalOpen(true);
  };

  // Finalize the help request by sending data to the backend
  const confirmHelpRequest = async () => {
    const payload = {
      title,
      description: helpDescription,
      urgencyLevel: selectedHelp,
      coinReward,
      location,
      completionTime,
    };

    try {
      const res=await axios.post('http://localhost:8080/api/help-requests', payload,{withCredentials:true});
      setSubmittedHelp(selectedHelp);
      setSubmittedDescription(helpDescription);
      toast.success("Help request submitted successfully!");
      setIsSuccessModalOpen(true);
      // Reset all fields and close confirmation
      setIsConfirmModalOpen(false);
      setIsHelpModalOpen(false);
      setTitle('');
      setSelectedHelp(null);
      setHelpDescription('');
      setCoinReward('');
      setLocation(null);
      setCompletionTime('');
    } catch (error) {
      console.error("Error submitting help request:", error);
      toast.error("Failed to submit help request. Please try again.");
    }
  };

  // Cancel confirmation and return to the help modal
  const cancelConfirmation = () => {
    setIsConfirmModalOpen(false);
  };

  // Handler for selecting a tier and automatically computing coin reward
  const handleTierChange = (option) => {
    setSelectedHelp(option);
    const match = option.match(/Tier\s*(\d+)/i);
    if (match) {
      setCoinReward(match[1] * 10);
    } else {
      setCoinReward('');
    }
  };

  // Set default location when button is clicked
  const handleSetDefaultLocation = () => {
    setLocation(defaultLocation);
    toast.success("Default location set.");
  };

  return (
    <div className="p-4">
      {/* Circular Help Button */}
      <button 
        className="btn btn-circle btn-primary w-32 h-32 text-2xl" 
        onClick={openHelpModal}
      >
        Help
      </button>

      {/* Help Selection Modal */}
      {isHelpModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            {/* Close Button */}
            <label 
              onClick={closeHelpModal} 
              className="btn btn-sm btn-circle absolute right-2 top-2 cursor-pointer"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold mb-4">Request Help</h3>

            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="title" className="block font-semibold mb-2">Title</label>
              <input
                id="title"
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter a title for your help request"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Help Options */}
            <p className="mb-4">Choose the appropriate help request tier:</p>
            <div className="mb-4">
              {helpOptions.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="helpOption"
                    id={`option-${index}`}
                    value={option}
                    checked={selectedHelp === option}
                    onChange={() => handleTierChange(option)}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${index}`}>{option}</label>
                </div>
              ))}
            </div>

            {/* Display Coin Reward (Read-Only) */}
            {coinReward && (
              <div className="mb-4">
                <p className="font-semibold">
                  Coin Reward: <span>{coinReward}</span>
                </p>
              </div>
            )}

            {/* Description Field */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-semibold mb-2">
                Describe your situation:
              </label>
              <textarea
                id="description"
                className="textarea textarea-bordered w-full"
                placeholder="Provide a brief description..."
                value={helpDescription}
                onChange={(e) => setHelpDescription(e.target.value)}
              />
            </div>

            {/* Location Button */}
            <div className="mb-4">
              <button 
                className="btn btn-info" 
                onClick={handleSetDefaultLocation}
              >
                Use current Location
              </button>
              {location && (
                <p className="mt-2">
                  <span className="font-semibold">Location:</span> Lattitude: {location.lat}, Longitude: {location.lng}
                </p>
              )}
            </div>

            {/* Completion Time Field */}
            <div className="mb-4">
              <label htmlFor="completionTime" className="block font-semibold mb-2">
                Completion Time (optional):
              </label>
              <input
                id="completionTime"
                type="datetime-local"
                className="input input-bordered w-full"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
              />
            </div>

            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            {/* Close Button */}
            <label 
              onClick={cancelConfirmation} 
              className="btn btn-sm btn-circle absolute right-2 top-2 cursor-pointer"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold mb-4">Confirm Help Request</h3>
            <p className="mb-2">
              <span className="font-semibold">Title:</span> {title}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Tier:</span> {selectedHelp}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Description:</span> {helpDescription}
            </p>
            {coinReward && (
              <p className="mb-2">
                <span className="font-semibold">Coin Reward:</span> {coinReward}
              </p>
            )}
            {location && (
              <p className="mb-2">
                <span className="font-semibold">Location:</span> lat: {location.lat}, lng: {location.lng}
              </p>
            )}
            {completionTime && (
              <p className="mb-4">
                <span className="font-semibold">Completion Time:</span> {completionTime}
              </p>
            )}
            <div className="flex justify-end gap-4">
              <button className="btn btn-error" onClick={cancelConfirmation}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={confirmHelpRequest}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            {/* Close Button */}
            <label 
              onClick={() => setIsSuccessModalOpen(false)} 
              className="btn btn-sm btn-circle absolute right-2 top-2 cursor-pointer"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold mb-4">Success</h3>
            <p className="mb-4">
              Your help request for <span className="font-semibold">{submittedHelp}</span> has been submitted!
            </p>
            <p className="mb-4">
              <span className="font-semibold">Description:</span> {submittedDescription}
            </p>
            <div className="flex justify-end">
              <button 
                className="btn btn-success" 
                onClick={() => setIsSuccessModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Help;
