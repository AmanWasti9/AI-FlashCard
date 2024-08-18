import { Card } from "@mui/material";
import { useState, useEffect } from "react";

const PointsCounter = ({ pointss }) => {
  const [displayPoints, setDisplayPoints] = useState(0); // Initialize with 1

  useEffect(() => {
    let timer;
    if (displayPoints < pointss) {
      timer = setInterval(() => {
        setDisplayPoints((prev) => Math.min(prev + 1, pointss)); // Increment points
      }, 50); // Adjust speed of the increment here
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); // Clean up interval on component unmount
  }, [displayPoints, pointss]);

  return (
    <Card
      style={{
        maxWidth: "120px",
        margin: "1rem auto",
        backgroundColor: "#000",
        color: "#0f0",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 0 10px rgba(148, 0, 211, 0.7)", // Purple color with a high opacity
        border: "2px solid rgba(148, 0, 211, 0.5)", // Purple border with a slightly lower opacity
        backgroundImage:
          "linear-gradient(145deg, rgba(75, 0, 130, 0.5), rgba(148, 0, 211, 0.8))", // Gradient from dark violet to purple
        backgroundClip: "padding-box",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textShadow: "0 0 8px rgba(0, 255, 0, 0.8)",
          color: "white", // Black text color for better readability on white background
          borderRadius: "0.25rem", // Optional: Add some border radius to the background
          padding: "0.25rem 0.5rem", // Optional: Add padding to create space around text
          display: "inline-block", // Ensure background fits tightly around the text
        }}
      >
        {displayPoints}
      </div>
    </Card>
  );
};

export default PointsCounter;
