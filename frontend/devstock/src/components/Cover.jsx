"use client";
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";

const Cover = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
      {/* Background Video */}
      <video
        className="absolute top-1/2 left-1/2 w-screen h-screen object-cover transform -translate-x-1/2 -translate-y-1/2"
        src="/stockVideo.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Centered Content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        {/* Main Heading */}
        <motion.h1
          className="text-5xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600"
          initial={{ opacity: 0, y: -50, letterSpacing: "-0.05em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{
            textShadow: "0px 0px 15px rgba(255, 200, 0, 0.8)",
            scale: 1.05,
          }}
        >
          {Array.from("Welcome to DevStock").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-3 text-lg text-gray-200 tracking-wide"
          initial={{ opacity: 0, y: 20, letterSpacing: "-0.02em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          whileHover={{
            textShadow: "0px 0px 10px rgba(255, 255, 255, 0.6)",
            scale: 1.05,
          }}
        >
          AI-powered stock insights at your fingertips{" "}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            🚀
          </motion.span>{" "}
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          >
            📈
          </motion.span>
        </motion.p>

        {/* Glowing Divider */}
        <motion.div
          className="w-36 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto my-4 rounded-full shadow-md"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: [1, 0.5, 1], // Expanding & collapsing effect
            opacity: [0.8, 1, 0.8], // Glowing effect
            boxShadow: [
              "0px 0px 10px rgba(255, 195, 0, 0.5)",
              "0px 0px 20px rgba(255, 195, 0, 0.8)",
              "0px 0px 10px rgba(255, 195, 0, 0.5)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          whileHover={{ scaleY: 1.5 }}
          whileTap={{ scaleX: 0.8 }}
        />

        {/* Animated Button */}
        <motion.button
          className="mt-5 flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.15,
            boxShadow: "0px 0px 20px rgba(216, 99, 247, 0.8)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Get Started{" "}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <AiOutlineArrowRight className="text-2xl" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default Cover;
