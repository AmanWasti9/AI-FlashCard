import React from "react";
import { Box, Button, Container } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import GenerateCard from "./generateCard";
import Profile from "./profile";
import Flashcards from "./flashcards";
import PointsCounter from "../components/timers";
import Flashcard from "./flashcard";
import Cards from "../components/Cards";
import { getAuth } from "firebase/auth";
import { TbLogout2 } from "react-icons/tb";

export default function Dashboard() {
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get current user
  const navigate = useNavigate();

  const handleLogOut = async () => {
    // console.log("Logout button clicked"); // Add this line to check if the function is being called
    try {
      await auth.signOut();
      // console.log("User logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
      }}
    >
      <Box>
        <Button
          variant="standard"
          onClick={handleLogOut}
          sx={{
            color: "white",
          }}
        >
          <TbLogout2
            style={{
              fontSize: "2.5rem",
              color: "white",
            }}
          />
          LogOut
        </Button>
      </Box>
      <Box
        sx={{
          padding: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Navigation />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <PointsCounter/>
        <Routes>          <Route path="/" element={<GenerateCard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="flashcard/:id" element={<Flashcard />} />
          <Route path="game" element={<Cards />} />
        </Routes>
      </Box>
    </Box>
  );
}