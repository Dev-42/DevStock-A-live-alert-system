"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    if (!email || !otp) {
      toast.error("Email and OTP are required");
      return;
    }
    try {
      console.log("Sending Data:", { email, otp });
      await axios.post("https://devstock.onrender.com/user/login", {
        email,
        otp,
      });
      toast.success("OTP verified successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("OTP verification failed");
    }
  };
  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};

export default Login;
