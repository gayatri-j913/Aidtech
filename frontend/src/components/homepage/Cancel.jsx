import React, { useState } from 'react';

function Cancel() {
  // State to control the cancel confirmation modal and success modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Open the cancel confirmation modal
  const openCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  // Close the cancel confirmation modal
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  // Confirm cancellation and open the success modal
  const confirmCancellation = () => {
    setIsSuccessModalOpen(true);
    setIsCancelModalOpen(false);
  };

  return (
    <div>
      {/* Circular Cancel Button */}
      <button 
        className="btn btn-circle btn-error w-32 h-32 text-2xl" 
        onClick={openCancelModal}
      >
        Cancel
      </button>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            {/* Close button */}
            <label 
              onClick={closeCancelModal} 
              className="btn btn-sm btn-circle absolute right-2 top-2 cursor-pointer"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold mb-4">Cancel Help Request</h3>
            <p className="mb-4">Are you sure you want to cancel your help request?</p>
            <div className="flex justify-end gap-4">
              <button className="btn" onClick={closeCancelModal}>
                No
              </button>
              <button className="btn btn-error" onClick={confirmCancellation}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            {/* Close button */}
            <label 
              onClick={() => setIsSuccessModalOpen(false)} 
              className="btn btn-sm btn-circle absolute right-2 top-2 cursor-pointer"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold mb-4">Cancelled</h3>
            <p className="mb-4">Your help request has been cancelled!</p>
            <div className="flex justify-end">
              <button 
                className="btn btn-error" 
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

export default Cancel;
