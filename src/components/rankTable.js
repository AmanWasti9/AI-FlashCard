import { Avatar } from "@mui/material";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import {
  AddUserInLeaderboard,
  GetLeaderboard,
  GetUserRank,
} from "./leaderboard";

export default function RankTable() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userRank, setUserRank] = useState(null); // State for storing the user's rank
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await GetLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  // Styling and rendering code remains unchanged...
  const containerStyle = {
    margin: "0 auto",
    padding: "2rem",
    background: "linear-gradient(to right, #1a1a1a, #000000, #1a1a1a)",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
    borderRadius: "20px",
    width: "95%",
    maxWidth: "720px",
    zIndex: "3",
    position: "relative",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "2rem",
    textAlign: "center",
    background: "linear-gradient(to right, #8a2be2, #ff1493, #1e90ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "pulse 2s infinite",
  };

  const tableStyle = {
    width: "95%",
    textAlign: "left",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "0.5rem",
    textTransform: "uppercase",
    color: "#888",
    borderBottom: "1px solid #444",
  };

  const trStyle = {
    transition: "transform 0.3s ease, background 0.3s ease",
    background: "linear-gradient(to right, #1a1a1a, #000000, #1a1a1a)",
    borderRadius: "10px",
    opacity: 0,
    transform: "translateY(20px)",
    animation: "fadeIn 0.7s forwards",
  };

  const tdStyle = {
    padding: "1rem",
    color: "#ccc",
    fontWeight: "bold",
    fontSize: "1.2rem",
  };

  const avatarStyle = {
    width: "3rem",
    height: "3rem",
    marginRight: "1rem",
    border: "2px solid transparent",
    borderRadius: "50%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.3s ease, border 0.3s ease",
  };

  const avatarHoverStyle = {
    ...avatarStyle,
    transform: "scale(1.1)",
    border: "2px solid #8a2be2",
  };

  const pointsStyle = {
    color: "#b19cd9",
    fontWeight: "700",
    fontSize: "1.5rem",
    animation: "pointsChange 1s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Leaderboard</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>Player</th>
            <th style={thStyle}>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((entry, index) => (
              <tr
                key={index}
                style={{ ...trStyle, animationDelay: `${index * 0.1}s` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(to right, #8a2be2, #6a0dad, #1a1a1a)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(to right, #1a1a1a, #000000, #1a1a1a)")
                }
              >
                <td style={tdStyle}>#{index + 1}</td>
                <td
                  style={{ ...tdStyle, display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    onMouseEnter={(e) =>
                      (e.currentTarget.style = avatarHoverStyle)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style = avatarStyle)}
                    sx={{
                      bgcolor: "violet",
                      border: "2px solid violet",
                      width: "5vh",
                      height: "5vh",
                      marginRight: "10px",
                    }}
                  >
                    {(entry.username || "A").charAt(0).toUpperCase()}
                  </Avatar>
                  <span style={{ color: "white" }}>{entry.username}</span>
                </td>
                <td style={pointsStyle}>{entry.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

/* Fade-in animation */
const fadeIn = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* Pulse animation */
const pulse = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

/* Points change animation */
const pointsChange = `
  @keyframes pointsChange {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    100% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`;

// Adding keyframes to the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(fadeIn, styleSheet.cssRules.length);
styleSheet.insertRule(pulse, styleSheet.cssRules.length);
styleSheet.insertRule(pointsChange, styleSheet.cssRules.length);
