// import React, { useState } from "react";
// import { styled } from "@mui/material/styles";
// import Button from "@mui/material/Button";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { Container, TextField, InputAdornment } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import "../App.css";
// import { PromptService } from "../Services/PromptService";

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
//     backgroundColor: "white", // Maintain the color on hover
//   },
//   "&:focus": {
//     outline: "none", // Remove the default focus outline
//   },
//   "&:active": {
//     backgroundColor: "white", // Maintain the color on click
//   },
// }));

// export default function Dashboard() {
//   const [inputValue, setInputValue] = useState("");
//   const [flashcards, setFlashcards] = useState("");

//   const handleSendClick = async () => {
//     if (!inputValue) {
//       alert("Please enter a prompt.");
//       return;
//     }

//     try {
//       const result = await PromptService(inputValue);
//       setFlashcards(result.flashcards);
//     } catch (error) {
//       console.error("Error fetching flashcards:", error);
//     }
//   };

//   return (
//     <div>
//       <Container
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div className="w-60per">
//           <h1>Welcome Line</h1>
//           <h3>Generate New Cards</h3>
//           <Button
//             component="label"
//             role={undefined}
//             variant="contained"
//             tabIndex={-1}
//             startIcon={
//               <CloudUploadIcon
//                 style={{
//                   fontSize: "1.5rem",
//                 }}
//               />
//             }
//             fullWidth
//             style={{
//               height: "20vh",
//               fontSize: "1.5rem",
//               backgroundColor: "purple",
//             }}
//           >
//             Upload file
//             <VisuallyHiddenInput type="file" />
//           </Button>
//           <br />
//           <h3
//             style={{
//               textAlign: "center",
//             }}
//           >
//             OR
//           </h3>
//           <TextField
//             type="text"
//             fullWidth
//             label="Youtube Vedio Link"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <CustomButton onClick={handleSendClick}>
//                     <SendIcon style={{ color: "purple" }} />
//                   </CustomButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <br />
//           <h3
//             style={{
//               textAlign: "center",
//             }}
//           >
//             OR
//           </h3>
//           <TextField
//             type="text"
//             fullWidth
//             label="Prompt Here..."
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <CustomButton onClick={handleSendClick}>
//                     <SendIcon style={{ color: "purple" }} />
//                   </CustomButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <h3>Generated Flashcards:</h3>
//           <div>
//             {flashcards ? (
//               <pre>{flashcards}</pre>
//             ) : (
//               <p>No flashcards generated yet.</p>
//             )}
//           </div>

//           <h3>Works on:</h3>
//           <ul
//             style={{
//               listStyle: "none",
//             }}
//           >
//             <li>Lecture Slides</li>
//             <li>PDFs</li>
//             <li>Word Documents</li>
//             <li>PowerPoint</li>
//             <li>Google Docs And Slides</li>
//             <li>Youtube Videos</li>
//           </ul>
//         </div>
//       </Container>
//     </div>
//   );
// }

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
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "../App.css";
import { PromptService } from "../Services/PromptService";

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
    backgroundColor: "white", // Maintain the color on hover
  },
  "&:focus": {
    outline: "none", // Remove the default focus outline
  },
  "&:active": {
    backgroundColor: "white", // Maintain the color on click
  },
}));

const Flashcard = styled("div")(({ theme }) => ({
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  margin: "8px 0",
  cursor: "pointer",
  backgroundColor: "#f9f9f9",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "rotateY(180deg)",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  perspective: "1000px",
  position: "relative",
  width: "100%",
  height: "150px",
}));

const FlashcardInner = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  textAlign: "center",
  transition: "transform 0.6s",
  transformStyle: "preserve-3d",
});

const FlashcardFront = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "8px",
});

const FlashcardBack = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  transform: "rotateY(180deg)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f0f0f0",
  borderRadius: "8px",
  padding: "8px",
});

export default function Dashboard() {
  const [inputValue, setInputValue] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const handleSendClick = async () => {
    if (!inputValue) {
      alert("Please enter a prompt.");
      return;
    }

    try {
      const result = await PromptService(inputValue);
      console.log(result);
      setFlashcards(result.flashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((pre) => ({
      ...pre,
      [id]: !pre[id],
    }));
  };

  return (
    <div>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-60per">
          <h1>Welcome Line</h1>
          <h3>Generate New Cards</h3>
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
            }}
          />
          <h3>Generated Flashcards:</h3>

          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "200px",
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

          <h3>Works on:</h3>
          <ul
            style={{
              listStyle: "none",
            }}
          >
            <li>Lecture Slides</li>
            <li>PDFs</li>
            <li>Word Documents</li>
            <li>PowerPoint</li>
            <li>Google Docs And Slides</li>
            <li>Youtube Videos</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
