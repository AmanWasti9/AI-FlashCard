import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Container,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "../App.css";
import { PromptService } from "../Services/PromptService";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import SaveIcon from "@mui/icons-material/Save";
import * as leader from "../components/leaderboard";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import Loader from "../components/Loader";
import PointsCounter from "../components/counter";

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { GoogleGenerativeAI } from "@google/generative-ai";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

export default function GenerateCard() {
  const [inputValue, setInputValue] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [boxShadowColor, setBoxShadowColor] = useState([]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track user selections

  const [pdfText, setPdfText] = useState("");
  // const [flashcardpdf, setFlashcardpdf] = useState("");
  // const [snackbarOpen, setSnackbarOpen] = useState(false);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file && file.type !== "application/pdf") {
  //     // Show snackbar if the file format is not PDF
  //   setSnackbarOpen(true);
  // } else {
  //   // Handle valid PDF file upload here
  //   console.log("PDF file uploaded:", file);
  // }
  // };

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);

      // Listen for real-time updates to the user's points
      const pointsDocRef = doc(firestore, "points", user.uid);
      const unsubscribe = onSnapshot(pointsDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setPoints(data.totalPoints || 0); // Update points state
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const handleOptionChange = (index, value) => {
    // Remove the "a) ", "b) ", or "c) " prefix from the answer
    const correctAnswer = flashcards[index].answer.replace(/^[a-c]\)\s*/, "");

    // Check if the selected option is correct
    const isCorrect = value === correctAnswer;

    setSelectedOptions((prev) => ({
      ...prev,
      [index]: value,
    }));

    setBoxShadowColor((prev) => ({
      ...prev,
      [index]: isCorrect ? "0 0 3px 5px #66FF00" : "0 0 3px 5px red",
    }));

    // Flip the card only if the selected option is incorrect
    if (isCorrect) {
      updatePoints(flashcards[index].question); // Pass the correct question to updatePoints
    } else {
      setFlipped((prev) => ({
        ...prev,
        [index]: true,
      }));
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSendClick = async () => {
    if (!inputValue) {
      alert("Please enter a prompt.");
      return;
    }

    setLoading(true); // Set loading to true when fetching begins

    try {
      const result = await PromptService(inputValue);
      console.log(result);
      setFlashcards(result.flashcards);

      resetCardStates();
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  const resetCardStates = () => {
    setFlipped([]);
    setBoxShadowColor([]);
    setSelectedOptions({});
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("please enter a name");
      return;
    }
    const batch = writeBatch(firestore);
    const userDocRef = doc(firestore, "cardscollection", user.uid);

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcards collection with the same name already exists");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    setSnackbarMessage("Your Cards are Saved.");
    setSnackbarOpen(true);
  };

  const updatePoints = async (question) => {
    if (user) {
      const pointsDocRef = doc(firestore, "points", user.uid);

      try {
        const docSnap = await getDoc(pointsDocRef);

        if (docSnap.exists()) {
          // If the document exists, update the points and add the question to the array
          await updateDoc(pointsDocRef, {
            totalPoints: increment(2),
            correctQuestions: arrayUnion(question), // Add the correct question to the array
          });
        } else {
          // If the document doesn't exist, create it and set the initial points and array with the first question
          await setDoc(pointsDocRef, {
            totalPoints: 2, // Initialize with 2 points for the correct answer
            correctQuestions: [question], // Initialize with the first correct question in an array
          });
        }

        console.log("Points and correct questions updated successfully");
        await leaderboard();
      } catch (error) {
        console.error("Error updating points and correct questions:", error);
      }
    }
  };
  const leaderboard = async () => {
    const ref = doc(firestore, "Users", user.uid);
    const docSnap = await getDoc(ref);

    const pointsDocRef = doc(firestore, "points", user.uid);
    const userPoints = await getDoc(pointsDocRef);
    try {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const username = `${userData.firstName} ${userData.lastName}`;
        const points = `${userPoints.data().totalPoints}`;

        leader.AddUserInLeaderboard(username, points, user);
      }
    } catch (error) {
      console.log("No such document!");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          extractedText += pageText + " ";
        }
        setPdfText(extractedText);
        await generateFlashcards(extractedText); // Call flashcard generation after text extraction
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      setTimeout(() => {
        setSnackbarOpen(true);
        setSnackbarMessage("Invalid Format. It should accept only PDF format");
      }, 0);
      // Handle valid PDF file upload here
      console.log("PDF file uploaded:", file);
    }
  };

  const generateFlashcards = async (text) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU" // Replace with your actual API key
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const prompt = `Create 10 flashcards with questions and three options based on this PDF text: ${text}. The format should be:\n\n" +
      "Question: [question here]\n" +
      "a) [option 1]\n" +
      "b) [option 2]\n" +
      "c) [option 3]\n" +
      "Answer: [correct answer here, without option letters] (Choose from the options a, b, or c)"`;
      const response = await model.generateContent(prompt, generationConfig);

      const rawText =
        response.response.candidates[0]?.content?.parts[0]?.text || "";

      const flashcards = rawText
        .split("\n\n")
        .reduce((acc, flashcard, index) => {
          const questionMatch = flashcard.match(/Question:\s*(.*)/i);
          const optionAMatch = flashcard.match(/a\)\s*(.*)/i);
          const optionBMatch = flashcard.match(/b\)\s*(.*)/i);
          const optionCMatch = flashcard.match(/c\)\s*(.*)/i);
          const answerMatch = flashcard.match(/Answer:\s*(.*)/i);

          if (
            questionMatch &&
            optionAMatch &&
            optionBMatch &&
            optionCMatch &&
            answerMatch
          ) {
            acc.push({
              id: index + 1,
              question: questionMatch[1].trim(),
              options: {
                a: optionAMatch[1].trim(),
                b: optionBMatch[1].trim(),
                c: optionCMatch[1].trim(),
              },
              answer: answerMatch[1].trim(),
            });
          }

          return acc;
        }, []);

      console.log(flashcards);
      setFlashcards(flashcards); // Store generated flashcards in state
      resetCardStates();
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setFlashcards([
        {
          id: 1,
          question: "Error",
          options: { a: "", b: "", c: "" },
          answer: "Unable to generate flashcards",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h6" style={{ color: "white" }}>
        <PointsCounter pointss={points} />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <h3
              style={{
                color: "white",
              }}
            >
              Generate new cards from
            </h3>
            <br />

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              onChange={handleFileChange}
              startIcon={
                <CloudUploadIcon
                  style={{
                    fontSize: "50px",
                  }}
                />
              }
              sx={{
                backgroundColor: "#000",
                color: "white",
                boxShadow: "0 0 10px rgba(148, 0, 211, 0.7)",
                border: "2px solid rgba(148, 0, 211, 0.5)",
                backgroundImage:
                  "linear-gradient(145deg, rgba(75, 0, 130, 0.5), rgba(148, 0, 211, 0.8))",
                backgroundClip: "padding-box",
                fontSize: "30px",
                padding: "25px",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "purple",
                },
              }}
            >
              Upload PDF
              <VisuallyHiddenInput type="file" accept=".pdf" />
            </Button>

            <br />
            <h3
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              OR
            </h3>
            <br />
            <TextField
              type="text"
              fullWidth
              label="Prompt Here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendClick(); // Trigger handleSendClick when Enter is pressed
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomButton onClick={handleSendClick}>
                      <SendIcon style={{ color: "purple" }} />
                    </CustomButton>
                  </InputAdornment>
                ),
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "indigo", // Gradient from dark violet to purple
                  },
                  "&:hover fieldset": {
                    borderColor: "indigo", // Gradient from dark violet to purple
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "indigo",
                  },
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
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
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loader />
              </Box>
            ) : (
              flashcards.length > 0 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <Grid container spacing={2}>
                    {flashcards.map((flashcard, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            height: "420px",
                            boxShadow: boxShadowColor[index],
                            cursor: "pointer",
                            perspective: "1000px",
                            borderRadius: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              transform: flipped[index]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                              transformStyle: "preserve-3d",
                              transition: "transform 0.6s",
                              position: "relative",
                              borderRadius: "8px",
                            }}
                          >
                            {/* Front Side of the Card */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                // background:
                                //   "linear-gradient(130deg, purple, violet, #F98CB9 )",
                                color: "white",
                                // boxShadow: "0 0 10px rgba(148, 0, 211, 0.7)", // Purple color with a high opacity
                                border: "2px solid rgba(148, 0, 211, 0.5)", // Purple border with a slightly lower opacity
                                backgroundImage:
                                  "linear-gradient(145deg, rgba(75, 0, 130, 0.5), rgba(148, 0, 211, 0.8))", // Gradient from dark violet to purple

                                boxSizing: "border-box",
                                borderRadius: "8px",
                                padding: "15px",
                              }}
                            >
                              <Typography
                                textAlign="center"
                                sx={{
                                  fontSize: "clamp(12px , 15px, 17px)",
                                  fontWeight: "bold",
                                }}
                              >
                                {flashcard.question}
                              </Typography>
                              {/* Display options below the question */}
                              {flashcard.options && (
                                <RadioGroup
                                  sx={{ marginTop: 2, width: "100%" }}
                                  value={selectedOptions[index] || ""}
                                  onChange={(e) =>
                                    handleOptionChange(index, e.target.value)
                                  }
                                >
                                  {Object.entries(flashcard.options).map(
                                    ([key, value], optionIndex) => (
                                      <FormControlLabel
                                        key={optionIndex}
                                        value={value}
                                        control={
                                          <Radio sx={{ color: "white" }} />
                                        }
                                        label={value}
                                        sx={{
                                          color: "white",
                                          fontSize: "clamp(12px , 15px, 17px)",
                                          "& .MuiSvgIcon-root": {
                                            fontSize: 22,
                                          },
                                        }}
                                      />
                                    )
                                  )}
                                </RadioGroup>
                              )}
                            </Box>

                            {/* Back Side of the Card */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundImage:
                                  "linear-gradient(145deg, rgba(148, 0, 211, 0.8),  rgba(75, 0, 130, 0.5))", // Gradient from dark violet to purple
                                color: "white",
                                boxSizing: "border-box",
                                borderRadius: "8px",
                                transform: "rotateY(180deg)",
                                padding: "15px",
                              }}
                            >
                              <Typography
                                textAlign="center"
                                sx={{
                                  fontSize: "clamp(12px , 15px, 17px)",
                                  fontWeight: "bold",
                                }}
                              >
                                Answer: {flashcard.answer}
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={handleOpen}
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{
                        mt: 4,
                        width: "150px",
                        padding: "10px",
                        border: "2px solid rgba(148, 0, 211, 0.5)", // Purple border with a slightly lower opacity

                        backgroundImage:
                          "linear-gradient(145deg, rgba(75, 0, 130, 0.5), rgba(148, 0, 211, 0.8))", // Gradient from dark violet to purple
                        color: "white",
                        "&:hover": {
                          border: "2px solid rgba(148, 0, 211, 0.5)", // Purple border with a slightly lower opacity

                          backgroundImage:
                            "linear-gradient(145deg, rgba(75, 0, 130, 0.5), rgba(148, 0, 211, 0.8))", // Gradient from dark violet to purple
                        },
                        "&:disabled": {
                          bgcolor: "gray",
                        },
                      }}
                      disabled={!isAuthenticated} // Disable button if not authenticated
                    >
                      Save
                    </Button>
                  </Box>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        backgroundColor: "black", // Set the background color to transparent
                        boxShadow: "none", // Optional: remove the default box shadow
                      },
                    }}
                  >
                    <DialogTitle
                      sx={{
                        color: "white",
                      }}
                    >
                      Save Flashcards
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText
                        sx={{
                          color: "white",
                        }}
                      >
                        Please enter a collection name for your flashcards.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Flashcards Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "indigo", // Gradient from dark violet to purple
                            },
                            "&:hover fieldset": {
                              borderColor: "indigo", // Gradient from dark violet to purple
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "indigo",
                            },
                            color: "white",
                          },
                          "& .MuiInputLabel-root": {
                            color: "white",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "white",
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
                          backgroundColor: "white",
                          color: "indigo",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveFlashcards}
                        sx={{
                          backgroundColor: "indigo",
                          color: "white",
                        }}
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                  />
                </Box>
              )
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
