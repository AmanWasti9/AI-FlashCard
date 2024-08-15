// import React, { useState } from "react";
// import { styled } from "@mui/material/styles";
// import Button from "@mui/material/Button";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import {
//   Container,
//   TextField,
//   InputAdornment,
//   Grid,
//   Card,
//   CardActionArea,
//   CardContent,
//   Box,
//   Paper,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Snackbar,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import "../App.css";
// import { PromptService } from "../Services/PromptService";
// import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
// import { firestore } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import Navigation from "../components/navigation";

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

// const CustomButton = styled(Button)(({ theme }) => ({
//   backgroundColor: "white",
//   borderRadius: "50%",
//   padding: "0.5rem",
//   minWidth: "unset",
//   boxShadow: "none",
//   "&:hover": {
//     backgroundColor: "white",
//   },
//   "&:focus": {
//     outline: "none",
//   },
//   "&:active": {
//     backgroundColor: "white",
//   },
// }));

// export default function Dashboard() {
//   const [inputValue, setInputValue] = useState("");
//   const [flashcards, setFlashcards] = useState([]);
//   const [flipped, setFlipped] = useState([]);
//   const [name, setName] = useState([]);
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const handleSnackbarClose = () => setSnackbarOpen(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSendClick = async () => {
//     if (!inputValue) {
//       alert("Please enter a prompt.");
//       return;
//     }

//     try {
//       const result = await PromptService(inputValue);
//       console.log(result);
//       setFlashcards(result.flashcards);
//     } catch (error) {
//       console.error("Error fetching flashcards:", error);
//     }
//   };

//   const handleCardClick = (id) => {
//     setFlipped((pre) => ({
//       ...pre,
//       [id]: !pre[id],
//     }));
//   };
//   const saveFlashcards = async () => {
//     if (!name) {
//       alert("please enter a name");
//       return;
//     }
//     const batch = writeBatch(firestore);
//     const userDocRef = doc(firestore, "cardscollection", user.uid);

//     const docSnap = await getDoc(userDocRef);

//     if (docSnap.exists()) {
//       const collections = docSnap.data().flashcards || [];
//       if (collections.find((f) => f.name === name)) {
//         alert("Flahcards collection with the same name already exists");
//         return;
//       } else {
//         collections.push({ name });
//         batch.set(userDocRef, { flashcards: collections }, { merge: true });
//       }
//     } else {
//       batch.set(userDocRef, { flashcards: [{ name }] });
//     }

//     const colRef = collection(userDocRef, name);
//     flashcards.forEach((flashcard) => {
//       const cardDocRef = doc(colRef);
//       batch.set(cardDocRef, flashcard);
//     });

//     await batch.commit();
//     handleClose();
//     // navigate("/flashcards");
//     setSnackbarMessage("Your Cards are Saved.");
//     setSnackbarOpen(true);
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         width: "100vw",
//         overflowY: "auto",
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
//         backdropFilter: "blur(10px)",
//         WebkitBackdropFilter: "blur(10px)", // Corrected -webkit-backdrop-filter
//         boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)", // Corrected box-shadow syntax
//       }}
//     >
//       <div
//         style={{
//           margin: "50px",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Navigation />
//       </div>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={4}>
//           <div
//             style={{
//               padding: "20px",
//             }}
//           >
//             <h3
//               style={{
//                 color: "white",
//               }}
//             >
//               Generate New Cards
//             </h3>
//             <Button
//               component="label"
//               role={undefined}
//               variant="contained"
//               tabIndex={-1}
//               disabled={!user}
//               startIcon={
//                 <CloudUploadIcon
//                   style={{
//                     fontSize: "1.5rem",
//                   }}
//                 />
//               }
//               fullWidth
//               style={{
//                 height: "20vh",
//                 fontSize: "1.5rem",
//                 backgroundColor: "purple",
//               }}
//             >
//               Upload file
//               <VisuallyHiddenInput type="file" />
//             </Button>
//             <br />
//             <h3
//               style={{
//                 textAlign: "center",
//                 color: "white",
//               }}
//             >
//               OR
//             </h3>
//             <TextField
//               type="text"
//               fullWidth
//               label="Youtube Vedio Link"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <CustomButton onClick={handleSendClick}>
//                       <SendIcon style={{ color: "purple" }} />
//                     </CustomButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" }, // Input text color
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "white", // Default border color
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "white", // Border color on hover
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "white", // Border color when focused
//                   },
//                   color: "white", // Text color
//                 },
//                 "& .MuiInputLabel-root": {
//                   color: "white", // Label color
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "white", // Label color when focused
//                 },
//               }}
//               InputLabelProps={{
//                 style: { color: "white" }, // Label color
//               }}
//             />
//             <br />
//             <h3
//               style={{
//                 textAlign: "center",
//                 color: "white",
//               }}
//             >
//               OR
//             </h3>

//             <TextField
//               type="text"
//               fullWidth
//               label="Prompt Here..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <CustomButton onClick={handleSendClick}>
//                       <SendIcon style={{ color: "purple" }} />
//                     </CustomButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" }, // Input text color
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "white", // Default border color
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "white", // Border color on hover
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "white", // Border color when focused
//                   },
//                   color: "white", // Text color
//                 },
//                 "& .MuiInputLabel-root": {
//                   color: "white", // Label color
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "white", // Label color when focused
//                 },
//               }}
//               InputLabelProps={{
//                 style: { color: "white" }, // Label color
//               }}
//             />
//           </div>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <div
//             style={{
//               padding: "20px",
//             }}
//           >
//             <h3
//               style={{
//                 color: "white",
//               }}
//             >
//               Generated Flashcards:
//             </h3>
//             {flashcards.length > 0 && (
//               <Box
//                 sx={{
//                   mt: 4,
//                 }}
//               >
//                 <Grid
//                   container
//                   spacing={2}
//                   // sx={{ overflowY: "auto", maxHeight: "80vh" }}
//                 >
//                   {flashcards.map((flashcard, index) => (
//                     <Grid item key={index} xs={12} sm={6} md={4}>
//                       <Card
//                         sx={{
//                           backgroundColor: "#7a49a5", // Set the card background to black
//                           color: "white", // Set the text color to white
//                         }}
//                       >
//                         <CardActionArea
//                           onClick={() => {
//                             handleCardClick(index);
//                           }}
//                         >
//                           <CardContent>
//                             <Box
//                               sx={{
//                                 perspective: "2000px",
//                                 "& > div": {
//                                   transition: "transform 0.6s",
//                                   transformStyle: "preserve-3d",
//                                   position: "relative",
//                                   width: "100%",
//                                   height: "20vh",
//                                   boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                   transform: flipped[index]
//                                     ? "rotateY(180deg)"
//                                     : "rotateY(0deg)",
//                                 },
//                                 "& > div > div": {
//                                   position: "absolute",
//                                   width: "100%",
//                                   height: "100%",
//                                   backfaceVisibility: "hidden",
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   padding: 2,
//                                   boxSizing: "border-box",
//                                 },
//                                 "& > div > div:nth-of-type(2)": {
//                                   transform: "rotateY(180deg)",
//                                 },
//                               }}
//                             >
//                               <div>
//                                 {/* The front side */}
//                                 <div>
//                                   <Typography variant="h5" component="div">
//                                     {flashcard.question}
//                                   </Typography>
//                                 </div>
//                                 {/* The back side */}
//                                 <div>
//                                   <Typography variant="h5" component="div">
//                                     {flashcard.answer}
//                                   </Typography>
//                                 </div>
//                               </div>
//                             </Box>
//                           </CardContent>
//                         </CardActionArea>
//                       </Card>
//                     </Grid>
//                   ))}
//                 </Grid>
//                 <Box
//                   sx={{
//                     mt: 4,
//                     display: "flex",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Button
//                     variant="contained"
//                     onClick={handleOpen}
//                     sx={{
//                       background: "purple",
//                       color: "white",
//                       "&:hover": {
//                         backgroundColor: "purple",
//                         color: "white",
//                       },
//                     }}
//                   >
//                     Save
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//             <Dialog onClose={handleClose} open={open}>
//               <div
//                 style={{
//                   backgroundColor: "black",
//                   color: "white",
//                 }}
//               >
//                 <DialogTitle>Save Flashcard</DialogTitle>
//                 <DialogContent>
//                   <DialogContentText>
//                     Please Enter a name for your flashcards collections
//                   </DialogContentText>
//                   <TextField
//                     autoFocus
//                     margin="dense"
//                     label="Collection Name"
//                     type="text"
//                     fullWidth
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     variant="outlined"
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": {
//                           borderColor: "white", // Default border color
//                         },
//                         "&:hover fieldset": {
//                           borderColor: "white", // Border color on hover
//                         },
//                         "&.Mui-focused fieldset": {
//                           borderColor: "white", // Border color when focused
//                         },
//                         color: "white", // Text color
//                       },
//                       "& .MuiInputLabel-root": {
//                         color: "white", // Label color
//                       },
//                       "& .MuiInputLabel-root.Mui-focused": {
//                         color: "white", // Label color when focused
//                       },
//                     }}
//                     InputLabelProps={{
//                       style: { color: "white" }, // Label color
//                     }}
//                   />
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={handleClose}
//                     sx={{
//                       background: "transparent",
//                       border: "1px solid",
//                       borderColor: "purple",
//                       color: "white",
//                       "&:hover": {
//                         backgroundColor: "transparent",
//                         color: "purple",
//                         borderColor: "white",
//                       },
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={saveFlashcards}
//                     sx={{
//                       background: "purple",
//                       color: "white",
//                       border: "1px solid",
//                       borderColor: "purple",
//                       "&:hover": {
//                         backgroundColor: "transparent",
//                       },
//                     }}
//                   >
//                     Save
//                   </Button>
//                 </DialogActions>
//               </div>
//             </Dialog>
//           </div>
//         </Grid>
//         <Snackbar
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           autoHideDuration={6000} // Adjust the duration as needed
//           open={snackbarOpen}
//           onClose={handleSnackbarClose}
//           message={snackbarMessage}
//           sx={{
//             backgroundColor: "purple",
//             color: "white",
//           }}
//         />
//       </Grid>
//     </Box>
//   );
// }
import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Navigation from "../components/navigation";
import GenerateCard from "./generateCard";
import Profile from "./profile";
import Flashcards from "./flashcards";
import Flashcard from "./flashcard";

export default function Dashboard() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        overflowY: "auto",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // Corrected -webkit-backdrop-filter
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)", // Corrected box-shadow syntax
      }}
    >
      {/* Navigation Bar */}
      <div
        style={{
          margin: "50px", // Space between navigation and content
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Navigation />
      </div>

<<<<<<< HEAD
      {/* Routes for the components */}
      <Box
        sx={{
          padding: "20px",
          margin: "0 auto",
          maxWidth: "1200px",
        }}
      >
        <Routes>
          <Route path="/" element={<GenerateCard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="flashcard" element={<Flashcard />} />
        </Routes>
      </Box>
=======
            <TextField
              type="text"
              fullWidth
              label="Prompt Here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomButton onClick={handleSendClick}>
                      <SendIcon style={{ color: "purple" }} />
                    </CustomButton>
                  </InputAdornment>
                ),
                style: { color: "white" }, // Input text color
              }}
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
              }}
              InputLabelProps={{
                style: { color: "white" }, // Label color
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div
            style={{
              padding: "20px",
            }}
          >
            <h3
              style={{
                color: "white",
              }}
            >
              Generated Flashcards:
            </h3>
            {flashcards.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Grid
                  container
                  spacing={2}
                  // sx={{ overflowY: "auto", maxHeight: "80vh" }}
                >
                  {flashcards.map((flashcard, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <Card 
                      sx={{
                      borderRadius:"15px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background color
                      backdropFilter: "blur(10px)", // Apply the blur effect // Set the card background to black
                      color: "white", // Set the text color to white
                    }}>
                        <CardActionArea
                          onClick={() => {
                            handleCardClick(index);
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                perspective: "2000px",
                                "& > div": {
                                  transition: "transform 0.6s",
                                  transformStyle: "preserve-3d",
                                  position: "relative",
                                  borderRadius:"15px",
                                  backgroundColor:"#7a49a5",
                                  width: "100%",
                                  height: "20vh",
                                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                                  transform: flipped[index]
                                    ? "rotateY(180deg)"
                                    : "rotateY(0deg)",
                                },
                                "& > div > div": {
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  backfaceVisibility: "hidden",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: 2,
                                  boxSizing: "border-box",
                                },
                                "& > div > div:nth-of-type(2)": {
                                  transform: "rotateY(180deg)",
                                },
                              }}
                            >
                              <div>
                                {/* The front side */}
                                <div>
                                  <Typography variant="h5" component="div">
                                    {flashcard.question}
                                  </Typography>
                                </div>
                                {/* The back side */}
                                <div>
                                  <Typography variant="h5" component="div">
                                    {flashcard.answer}
                                  </Typography>
                                </div>
                              </div>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                      background: "purple",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "purple",
                        color: "white",
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
            <Dialog onClose={handleClose} open={open}>
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <DialogTitle>Save Flashcard</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please Enter a name for your flashcards collections
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Collection Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
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
                    }}
                    InputLabelProps={{
                      style: { color: "white" }, // Label color
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    sx={{
                      background: "transparent",
                      border: "1px solid",
                      borderColor: "purple",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "purple",
                        borderColor: "white",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveFlashcards}
                    sx={{
                      background: "purple",
                      color: "white",
                      border: "1px solid",
                      borderColor: "purple",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    Save
                  </Button>
                </DialogActions>
              </div>
            </Dialog>
          </div>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={6000} // Adjust the duration as needed
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          sx={{
            backgroundColor: "purple",
            color: "white",
          }}
        />
      </Grid>
>>>>>>> 6b30687540aa3492a50857df0e86c02c65394637
    </Box>
  );
}
