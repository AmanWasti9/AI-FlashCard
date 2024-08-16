import React from "react";
import { Box, Container } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Navigation from "../components/navigation";
import GenerateCard from "./generateCard";
import Profile from "./profile";
import Flashcards from "./flashcards";
import Flashcard from "./flashcard";
import Cards from "../components/Cards";

export default function Dashboard() {
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
