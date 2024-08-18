import React from "react";
import { Box, Button } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import GenerateCard from "./generateCard";
import Profile from "./profile";
import Flashcards from "./flashcards";
import PointsCounter from "../components/timers"; // Import the PointsCounter component
import Flashcard from "./flashcard";
import Cards from "../components/Cards";
import { getAuth } from "firebase/auth";
import { TbLogout2 } from "react-icons/tb";

export default function Dashboard() {
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get current user
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await auth.signOut();
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <Button
          variant="standard"
          onClick={handleLogOut}
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TbLogout2
            style={{
              fontSize: "2.5rem",
              color: "white",
              marginRight: "0.5rem",
            }}
          />
          LogOut
        </Button>

        {/* Add the PointsCounter timer component here */}
        <PointsCounter />
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
        <Routes>
          <Route path="/" element={<GenerateCard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="flashcard/:id" element={<Flashcard />} />
          <Route path="game" element={<Cards />} />
        </Routes>
      </Box>
    </Box>
  );
}
