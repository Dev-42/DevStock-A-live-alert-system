"use client";
import React from "react";
import { Button } from "@mui/material";

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

      {/* Centered Button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            fontSize: "1.25rem",
            padding: "12px 24px",
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Cover;
