"use client";
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";

const Cover = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover brightness-75"
        src="/stockVideo.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Login Button */}
      <motion.button
        className="absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center justify-center p-3 text-white transition-all duration-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.2,
          filter: "drop-shadow(0px 0px 12px rgba(255,255,255,0.8))",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <FaRegUserCircle className="text-3xl sm:text-4xl drop-shadow-xl cursor-pointer" />
      </motion.button>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 sm:px-8">
        {/* Main Heading */}
        <motion.h1
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600 leading-snug sm:leading-tight"
          initial={{ opacity: 0, y: -50, letterSpacing: "-0.05em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{
            textShadow: "0px 0px 25px rgba(255, 200, 0, 1)",
            scale: 1.1,
          }}
        >
          {["Welcome", "to", "DevStock"].map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              className="inline-block mx-1 sm:mx-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wordIndex * 0.3, duration: 0.6 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-3 text-sm sm:text-lg text-gray-200 tracking-wide max-w-md sm:max-w-lg lg:max-w-2xl"
          initial={{ opacity: 0, y: 20, letterSpacing: "-0.02em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        >
          AI-powered stock insights at your fingertips 🚀 📈
        </motion.p>

        {/* Animated Line */}
        <motion.div
          className="w-12 sm:w-20 h-[3px] mx-auto my-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Animated Button */}
        <motion.button
          className="mt-5 flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base sm:text-lg font-bold rounded-full shadow-lg hover:shadow-purple-500/60 transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px rgba(216, 99, 247, 0.9)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <AiOutlineArrowRight className="text-xl sm:text-2xl" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default Cover;
