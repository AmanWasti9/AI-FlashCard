import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import {
  Stack,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LinearProgress from "@mui/material/LinearProgress";
import GIcon from "../Images/GoogleIcon.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage2, setSnackbarMessage2] = useState("");
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a document for the user if it doesn't exist
      await setDoc(
        doc(firestore, "Users", user.uid),
        {
          email: user.email,
          pantryInitialized: false,
        },
        { merge: true }
      );

      // console.log("User Logged In successfully");
      setSnackbarMessage2(
        "You have logged in successfully. Please wait while we redirect you to the dashboard."
      );
      setOpenSnackbar(true);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      setSnackbarMessage("Invalid User Details");
      setOpenSnackbar(true); // Open Snackbar on error
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close Snackbar
  };

  const SignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        // Check if the user already exists in the firestore
        const userDoc = doc(firestore, "Users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (!userSnapshot.exists()) {
          // Add user data to firestore if it doesn't already exist
          await setDoc(userDoc, {
            email: user.email,
            firstName: user.displayName.split(" ")[0], // Extract first name from displayName
            lastName: user.displayName.split(" ")[1] || "", // Extract last name from displayName, if available
          });
        }
        // Redirect to dashboard after successful sign-in
        navigate("/dashboard");
      }
      setSnackbarMessage2("User Signed In with Google!");
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error.message);
      setSnackbarMessage("Google Sign-In failed. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          flexWrap: "wrap",
          zIndex: "2",
          "& > :not(style)": {
            width: {
              xs: "90vw",
              md: "35vw",
            },
            p: 5,
          },
        }}
      >
        <div
          style={{
            borderRadius: "50px",
            color: "white",
            border: "2px solid purple",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background color
            backdropFilter: "blur(10px)", // Apply the blur effect // Set the card background to black
            
          }}
        >
          {loading && <LinearProgress />} {/* Show loader when loading */}
          <h2 style={{ textAlign: "center" }}>Log In</h2>
          <br />
          <form onSubmit={handleSubmit}>
            <Stack
              direction={"column"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <TextField
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Border color when focused
                    },
                    color: "white", // Text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white", // Label color when focused
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white", // Input text color
                  },
                }}
                InputLabelProps={{
                  style: { color: "white" }, // Label color
                }}
                InputProps={{
                  style: { color: "white" }, // Input text color
                }}
              />
              <TextField
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Border color when focused
                    },
                    color: "white", // Text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white", // Label color when focused
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white", // Input text color
                  },
                }}
                InputLabelProps={{
                  style: { color: "white" }, // Label color
                }}
                InputProps={{
                  style: { color: "white" }, // Input text color
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  background: "purple",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "purple",
                    color: "white",
                  },
                }}
              >
                Login
              </Button>
              <Divider
                sx={{
                  backgroundColor: "purple",
                  width: "100%",
                }}
              />
              <Button component={Link} to="/sign-up" sx={{ color: "purple" }}>
                Don&apos;t have an account? Sign Up
              </Button>

              <Button
                variant="contained"
                type="button"
                fullWidth
                sx={{
                  background: "transparent",
                  borderRadius: "20px",
                  height: "7vh",
                  display: "flex",
                  gap: "20px",
                  border: "2px solid purple",
                  color: "white", // Text color
                  transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for hover effects
                  "&:hover": {
                    backgroundColor: "purple", // Background color on hover
                    color: "white", // Text color on hover
                  },
                }}
                onClick={SignUpWithGoogle}
              >
                <span>
                  <img
                    src={GIcon}
                    alt=""
                    width={35}
                    height={35}
                    style={{
                      objectFit: "contain",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  />
                </span>
                <span>Continue With Google</span>
              </Button>
            </Stack>
          </form>
        </div>
      </Box>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000} // Adjust the duration as needed
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage2}
        sx={{
          backgroundColor: "purple",
          color: "white",
        }}
      />
    </div>
  );
}
