import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Container,
  Grid,
  Card,
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function getFlashcard() {
      if (!id || !user) {
        console.log("No flashcard name or user found");
        return;
      }

      try {
        console.log("Fetching flashcards for:", id);

        const colRef = collection(
          doc(firestore, "cardscollection", user.uid),
          id
        );
        const querySnapshot = await getDocs(colRef);

        const flashcards = [];
        querySnapshot.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });

        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcard();
  }, [user, id]);

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOptionChange = (index, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card
              onClick={() => handleCardClick(index)}
              sx={{
                height: "420px",
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
                    background:
                      "linear-gradient(130deg, purple, violet, #F98CB9)",
                    color: "white",
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
                            value={`${key}) ${value}`}
                            control={
                              <Radio
                                sx={{
                                  color: "white",
                                }}
                              />
                            }
                            label={`${key}) ${value}`}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              textAlign: "start",
                              color: "white",
                              marginBottom: "5px",
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
                    transform: "rotateY(180deg)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background:
                      "linear-gradient(130deg, #F98CB9, violet,purple)",
                    color: "white",
                    padding: 2,
                    boxSizing: "border-box",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" component="div" textAlign="center">
                    {flashcard.answer}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
