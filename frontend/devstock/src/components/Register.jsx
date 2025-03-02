"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await axios.post("https://devstock.onrender.com/user/signup", { email });
      toast.success("OTP sent to your email");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      toast.error("Signup failed");
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
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Register;
