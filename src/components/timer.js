import { Card } from "@mui/material";
import { useState, useEffect } from "react";

const Timer = ({ setTimeUp, resetTimer, resetFlag }) => {
  const [seconds, setSeconds] = useState(() => {
    const storedSeconds = localStorage.getItem("timerSeconds");
    return storedSeconds ? parseInt(storedSeconds, 10) : 60;
  });

  useEffect(() => {
    if (resetFlag) {
      setSeconds(60);
      localStorage.setItem("timerSeconds", 60);
    }
  }, [resetFlag]);

  useEffect(() => {
    if (seconds > 0) {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem("timerSeconds", newSeconds);
          return newSeconds;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setTimeUp(true);
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0) {
      resetTimer();
      localStorage.removeItem("timerSeconds");
    }
  }, [seconds]);

  const getTextColor = () => {
    if (seconds <= 10) return "#ff4d4d";
    if (seconds <= 30) return "#ffff00";
    return "#00bcd4";
  };

  return (
    <Card
      style={{
        maxWidth: "200px",
        margin: "1rem auto",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: "0.5rem",
        padding: "0.5rem",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.7)",
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(145deg, rgba(50, 0, 150, 0.3), rgba(0, 50, 150, 0.3))",
        backgroundClip: "padding-box",
        boxShadow:
          "0 0 20px rgba(0, 128, 255, 0.6), 0 0 30px rgba(128, 0, 255, 0.6)",
      }}
    >
      <div
        style={{
          color: getTextColor(),
          fontSize: "1.5rem",
          fontWeight: "bold",
          textShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
        }}
      >
        {seconds === 0
          ? "Time is up!"
          : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
              2,
              "0"
            )}`}
      </div>
    </Card>
  );
};

export default Timer;
