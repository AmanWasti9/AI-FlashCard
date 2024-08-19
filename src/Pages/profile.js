import React, { useEffect, useState } from "react";
import "./profile.css";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import CircleProgress from "../components/circleprogress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  AddUserInLeaderboard,
  GetLeaderboard,
  GetUserRank,
} from "../components/leaderboard"; // Updated import
import RankTable from "../components/rankTable"; // Correct import
import CheckIcon from "@mui/icons-material/Check";
import CreateIcon from "@mui/icons-material/Create";

const UserProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userFirstName, setUserFirstName] = useState("");
  const [points, setPoints] = useState(0);
  const [correctedQuestion, setCorrectedQuestion] = useState(0);
  const [open, setOpen] = useState(false);

  const [userRank, setUserRank] = useState(null); // State for storing the user's rank

  // State for dialog input fields
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const updateLeaderboard = async () => {
      if (user) {
        try {
          const userDocRef = doc(firestore, "Users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const username = `${userData.firstName} ${userData.lastName}`;
            await AddUserInLeaderboard(username, user); // No need to pass totalPoints and gamePoints here
          }
        } catch (error) {
          console.error("Error updating leaderboard:", error);
        }
      }
    };

    updateLeaderboard();
  }, [user, firestore]);

  useEffect(() => {
    if (user) {
      const fetchUserRank = async () => {
        const rank = await GetUserRank(user.uid); // Fetch user rank
        console.log(`User Rank: ${rank}`); // Check the rank in the console
        setUserRank(rank);
      };

      fetchUserRank();

      const fetchPoints = async () => {
        try {
          const leaderboard = await GetLeaderboard(user.uid);
          const userEntry = leaderboard.find((entry) => entry.id === user.uid);
          if (userEntry) {
            setPoints(userEntry.score);
            console.log(userEntry.score);
          } else {
            console.log("User not found in the leaderboard.");
          }
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
        }
      };

      fetchPoints();

      const userDocRef = doc(firestore, "Users", user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserFirstName(capitalizeFirstLetter(userData.firstName));
          setFirst(userData.firstName); // Set dialog input fields with the current name
          setLast(userData.lastName); // Set dialog input fields with the current name
        }
      });

      const pointsDocRef = doc(firestore, "points", user.uid);
      const unsubscribe = onSnapshot(pointsDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();

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

      return () => unsubscribe();
    }
  }, [user]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const avatarLetter = userFirstName.charAt(0).toUpperCase();

  const updateData = async () => {
    try {
      if (!user) {
        console.error("No user is signed in.");
        return;
      }

      const docRef = doc(firestore, "Users", user.uid);
      await updateDoc(docRef, {
        firstName: first,
        lastName: last,
      });

      const docRef1 = doc(firestore, "leaderboard", user.uid);
      await updateDoc(docRef1, {
        username: first + " " + last,
      });

      console.log("Document updated successfully");

      setUserFirstName(capitalizeFirstLetter(first));
      setUsername(first + " " + last);

      // // Fetch the updated leaderboard after name change
      // const updatedLeaderboard = await GetLeaderboard();
      // setLeaderboard(updatedLeaderboard); // Update leaderboard with new data

      // Fetch and sort the leaderboard based on the score
      const leaderboardRef = collection(firestore, "leaderboard");
      const q = query(leaderboardRef, orderBy("score", "desc"));
      const querySnapshot = await getDocs(q);

      const updatedLeaderboard = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLeaderboard(updatedLeaderboard); // Update leaderboard with new data

      handleClose(); // Close the dialog after successful update
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
              <CircleProgress value={points} max={1000} />
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
                  stroke="violet"
                ></path>
                <path
                  d="M18.804 27a5.999 5.999 0 0 0 10.392 0"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke="violet"
                ></path>
                <path
                  d="M18 15.75h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Zm14 0h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Z"
                  stroke-width=".25"
                  stroke-linecap="round"
                  stroke="violet"
                  fill="violet"
                ></path>
              </svg>
            </div>
            <p className="group-hover-text">Happy</p>
          </div>
          <div className="calories-container group">
            <div className="group-hover-icon" onClick={handleOpen}>
              <CreateIcon
                sx={{
                  color: "violet",
                  fontSize: "50px",
                }}
              />
            </div>
            <p className="group-hover-text">Change Username</p>
          </div>
        </div>
      </div>
      <div>
        <RankTable />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Name</DialogTitle>
        <DialogContent>
          <DialogContentText>First Name and Last Name.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updateData}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
