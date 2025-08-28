import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function OTPVerification() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendCode = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/phone-verification/send-verification",
            {}
            ,{withCredentials:true});

            if (response.data.success) {
                toast.success("OTP sent successfully!");
            } else {
                toast.error(response.data.message || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error("Error sending OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!otp) {
            toast.error("Please enter the OTP!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/phone-verification/verify-code", {
                code:otp
            },{withCredentials:true});

            if (response.data.success) {
                toast.success("OTP verified successfully!");
            } else {
                toast.error(response.data.message || "Invalid OTP.");
            }
        } catch (error) {
            toast.error("Error verifying OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="card w-96 shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-bold text-center mb-4">OTP Verification</h2>

                

                {/* OTP Input */}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    maxLength={6}
                    className="input input-bordered w-full mb-4 text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                />
                {/* Send Code Button */}
                <button
                    className="btn bg-red-600 text-white w-full hover:bg-red-500 mb-4"
                    onClick={sendCode}
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Code"}
                </button>
                {/* Verify OTP Button */}
                <button
                    className="btn bg-blue-500 text-white w-full hover:bg-blue-600"
                    onClick={handleVerify}
                    disabled={isLoading}
                >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
}

export default OTPVerification;
