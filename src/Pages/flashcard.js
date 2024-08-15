import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firestore } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function Flashcard() {
  // Changed to PascalCase
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const [searchParams] = useSearchParams(); // Fixed useSearchParams usage
  const search = searchParams.get("id");
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        return;
      }

      try {
        const colRef = collection(
          doc(firestore, "cardscollection", user.uid), // Use user.uid
          "An-Cards"
        );

        const docs = await getDocs(colRef);

        const flashcards = [];
        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });

        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <Container maxWidth="100vw">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(index)}>
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
      </Container>
    </div>
  );
}