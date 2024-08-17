import React, { useEffect, useState } from "react";
import "./profile.css";
import { Avatar, Box, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import CircleProgress from "../components/circleprogress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { GetUserRank } from "../components/leaderboard"; // Updated import
import RankTable from "../components/rankTable"; // Correct import
import CheckIcon from "@mui/icons-material/Check";

const UserProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userFirstName, setUserFirstName] = useState("");
  const [points, setPoints] = useState(0);
  const [correctedQuestion, setCorrectedQuestion] = useState(0);

  const [userRank, setUserRank] = useState(null); // State for storing the user's rank

  useEffect(() => {
    if (user) {
      const fetchUserRank = async () => {
        const rank = await GetUserRank(user.uid); // Fetch user rank
        console.log(`User Rank: ${rank}`); // Check the rank in the console
        setUserRank(rank);
      };

      fetchUserRank();

      const userDocRef = doc(firestore, "Users", user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserFirstName(capitalizeFirstLetter(userData.firstName));
        }
      });

      const pointsDocRef = doc(firestore, "points", user.uid);
      const unsubscribe = onSnapshot(pointsDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setPoints(data.totalPoints || 0);

          const correctQuestionsLength = data.correctQuestions
            ? data.correctQuestions.length
            : 0;
          console.log(
            "Length of correctQuestions array:",
            correctQuestionsLength
          );
          setCorrectedQuestion(correctQuestionsLength);
        }
      });

      return () => unsubscribe(); // Clean up the subscription
    }
  }, [user]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const avatarLetter = userFirstName.charAt(0).toUpperCase();

  return (
    <Box
      className="polo"
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="fitCard">
        <div className="user-header">
          <Avatar
            sx={{
              bgcolor: "violet",
              border: "2px solid violet",
              width: "5vh",
              height: "5vh",
            }}
          >
            {avatarLetter}
          </Avatar>
          <p className="username">{userFirstName}</p>
        </div>
        <div className="content-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "10px",
              position: "relative",
            }}
          >
            <Typography fontSize={"40px"}>
              <CircleProgress value={points} max={100} />
            </Typography>
            <Typography
              fontSize={"20px"}
              fontWeight={"bold"}
              sx={{
                color: "violet",
                textAlign: "center",
              }}
            >
              Points
            </Typography>
          </div>
          <div className="info-container">
            <div className="bpm-container group">
              <div className="group-hover-icon">
                <EmojiEventsIcon
                  sx={{
                    color: "violet",
                    fontSize: "50px",
                  }}
                />
              </div>
              <p className="group-hover-text">
                {userRank !== null ? `Rank: ${userRank}` : "Loading..."}
              </p>
            </div>
            <div className="sleep-container group">
              <div className="group-hover-icon">
                <CheckIcon
                  sx={{
                    color: "violet",
                    fontSize: "50px",
                  }}
                />
              </div>
              <p className="group-hover-text">
                Correct Questions: {correctedQuestion}
              </p>
            </div>
          </div>
        </div>
        <div className="calories-mood-container">
          <div className="mood-container group">
            <div className="group-hover-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                height="48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke="#B49A18"
                ></path>
                <path
                  d="M18.804 27a5.999 5.999 0 0 0 10.392 0"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke="#B49A18"
                ></path>
                <path
                  d="M18 15.75h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Zm14 0h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Z"
                  stroke-width=".25"
                  stroke-linecap="round"
                  stroke="#B49A18"
                  fill="#B49A18"
                ></path>
              </svg>
            </div>
            <p className="group-hover-text">Happy</p>
          </div>
          <div className="calories-container group">
            <div className="group-hover-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                height="48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#a)">
                  <path
                    d="M23.896 45.36C10.463 43.172 1.63 29.859 3.819 16.426A24.007 24.007 0 0 1 15.863 3.818C29.295 1.63 38.128 14.943 35.94 28.376a24.007 24.007 0 0 1-12.044 12.044h.002Z"
                    fill="#B49A18"
                  ></path>
                  <path
                    d="M27.85 15.282a1.94 1.94 0 0 0-1.94 1.94v7.761a3.88 3.88 0 0 1-3.878 3.88h-.97a1.94 1.94 0 0 0-1.94 1.938v.97a1.94 1.94 0 0 0 1.94 1.94h.97a7.759 7.759 0 0 0 7.757-7.758v-7.761a1.94 1.94 0 0 0-1.939-1.94Z"
                    fill="#fff"
                  ></path>
                </g>
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h48v48H0z" fill="#fff"></path>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="group-hover-text">2,187 cal</p>
          </div>
        </div>
      </div>
      <div>
        <RankTable />
      </div>
    </Box>
  );
};

export default UserProfile;
