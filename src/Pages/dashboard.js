
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Container,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "../App.css";
import { PromptService } from "../Services/PromptService";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { firestore } from "../firebase";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Navigation from "../components/navigation";
import GenerateCard from "./generateCard";
import Profile from "./profile";
import Flashcards from "./flashcards";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "50%",
  padding: "0.5rem",
  minWidth: "unset",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "white",
  },
  "&:focus": {
    outline: "none",
  },
  "&:active": {
    backgroundColor: "white",
  },
}));

export default function Dashboard() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100vw",
        overflowY: "auto",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // Corrected -webkit-backdrop-filter
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)", // Corrected box-shadow syntax
      }}
    >
      <div
        style={{
          margin: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Navigation />
      </div>

      <div>
        <Routes>
          <Route path="/dashboard" element={<GenerateCard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/flashcards" element={<Flashcards />} />
        </Routes>
      </div>
    </Box>
  );
}
