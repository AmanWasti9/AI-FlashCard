// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import React, { useState } from "react";
// import { auth, firestore } from "../firebase";
// import { setDoc, doc, getDoc } from "firebase/firestore";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import {
//   Button,
//   Divider,
//   Snackbar,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import GIcon from "../Images/GoogleIcon.png";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fname, setFname] = useState("");
//   const [lname, setLname] = useState("");

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const handleSnackbarClose = () => setSnackbarOpen(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       const user = auth.currentUser;
//       if (user) {
//         await setDoc(doc(firestore, "Users", user.uid), {
//           email: user.email,
//           firstName: fname,
//           lastName: lname,
//         });
//       }
//       setEmail("");
//       setPassword("");
//       setFname("");
//       setLname("");
//       setSnackbarMessage("User Registered successfully!");
//       setSnackbarOpen(true);

//       // Delay the switch to login to allow Snackbar to display
//       setTimeout(() => {
//         setSnackbarOpen(false);
//       }, 3000); // Adjust the delay time as needed
//     } catch (error) {
//       console.log(error.message);
//       setSnackbarMessage("Registration failed. Please try again.");
//       setSnackbarOpen(true);
//     }
//   };

//   const SignUpWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       if (user) {
//         // Check if the user already exists in the firestore
//         const userDoc = doc(firestore, "Users", user.uid);
//         const userSnapshot = await getDoc(userDoc);
//         if (!userSnapshot.exists()) {
//           // Add user data to firestore if it doesn't already exist
//           await setDoc(userDoc, {
//             email: user.email,
//             firstName: user.displayName.split(" ")[0], // Extract first name from displayName
//             lastName: user.displayName.split(" ")[1] || "", // Extract last name from displayName, if available
//           });
//         }
//       }
//       setSnackbarMessage("User Signed In with Google!");
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.log(error.message);
//       setSnackbarMessage("Google Sign-In failed. Please try again.");
//       setSnackbarOpen(true);
//     }
//   };

//   return (
//     <div>
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           "& > :not(style)": {
//             width: {
//               xs: "80vw",
//               md: "25vw",
//             },
//             p: 5,
//           },
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             borderRadius: "12px",
//           }}
//         >
//           <h2 style={{ textAlign: "center" }}>Sign Up</h2>
//           <br />
//           <Snackbar
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             autoHideDuration={6000} // Adjust the duration as needed
//             open={snackbarOpen}
//             onClose={handleSnackbarClose}
//             message={snackbarMessage}
//           />
//           <form onSubmit={handleRegister}>
//             <Stack
//               direction={"column"}
//               sx={{
//                 justifyContent: "center",
//                 alignItems: "center",
//                 gap: "20px",
//               }}
//             >
//               <TextField
//                 type="text"
//                 variant="outlined"
//                 value={fname}
//                 onChange={(e) => setFname(e.target.value)}
//                 label="First name"
//                 fullWidth
//               />
//               <TextField
//                 type="text"
//                 variant="outlined"
//                 value={lname}
//                 onChange={(e) => setLname(e.target.value)}
//                 label="Last name"
//                 fullWidth
//               />
//               <TextField
//                 type="email"
//                 variant="outlined"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 label="Email Address"
//                 fullWidth
//               />
//               <TextField
//                 type="password"
//                 variant="outlined"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 label="Password"
//                 fullWidth
//               />
//               <Button
//                 variant="contained"
//                 type="submit"
//                 fullWidth
//                 sx={{
//                   background: "linear-gradient(#033363, #021F3B)",
//                 }}
//               >
//                 Signup
//               </Button>
//               <Divider
//                 sx={{
//                   backgroundColor: "black",
//                   width: "100%",
//                 }}
//               />
//               <Typography variant="body2">
//                 Already Registered? <Button href="/login">Log In</Button>
//               </Typography>

//               <Button
//                 variant="contained"
//                 type="button"
//                 fullWidth
//                 sx={{
//                   background: "grey",
//                   borderRadius: "20px",
//                   height: "7vh",
//                 }}
//                 onClick={SignUpWithGoogle}
//               >
//                 <span>
//                   <img
//                     src={GIcon}
//                     alt=""
//                     style={{
//                       width: "50px",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </span>
//                 <span>Continue With Google</span>
//               </Button>
//             </Stack>
//           </form>
//         </Paper>
//       </Box>
//     </div>
//   );
// }

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth, firestore } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Button,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GIcon from "../Images/GoogleIcon.png";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const navigate = useNavigate(); // Initialize navigate

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(firestore, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      setEmail("");
      setPassword("");
      setFname("");
      setLname("");
      setSnackbarMessage("User Registered successfully!");
      setSnackbarOpen(true);

      // Delay the switch to login to allow Snackbar to display
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000); // Adjust the delay time as needed
    } catch (error) {
      console.log(error.message);
      setSnackbarMessage("Registration failed. Please try again.");
      setSnackbarOpen(true);
    }
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
      setSnackbarMessage("User Signed In with Google!");
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
              xs: "80vw",
              md: "25vw",
            },
            p: 5,
          },
        }}
      >
        <div
          //   elevation={3}
          style={{
            borderRadius: "12px",
            color: "white",
            border: "2px solid purple",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Sign Up</h2>
          <br />
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={6000} // Adjust the duration as needed
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
          <form onSubmit={handleRegister}>
            <Stack
              direction={"column"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <TextField
                type="text"
                variant="outlined"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                label="First name"
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
                type="text"
                variant="outlined"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                label="Last name"
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
                variant="contained"
                type="submit"
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
                Signup
              </Button>
              <Divider
                sx={{
                  backgroundColor: "purple",
                  width: "100%",
                }}
              />
              <Typography variant="body2">
                Already Registered?{" "}
                <Button href="/login" sx={{ color: "purple" }}>
                  Log In
                </Button>
              </Typography>

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
    </div>
  );
}
