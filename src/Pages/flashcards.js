import React, { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { firestore } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function getFlashcards() {
      if (!user) {
        console.log("User is not logged in");
        return;
      }

      try {
        const docRef = doc(firestore, "cardscollection", user.uid); // Use user.uid instead of user.id
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          console.log(collections);
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcards();
  }, [user]);
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleCardClick = (id) => {
    navigate(`/dashboard/flashcard/${id}`);
  };
  return (
    <div>
      <Container maxWidth="100vw">
        <Grid container spacing={2}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  background:
                    "linear-gradient(130deg, purple, violet, #f98cb9)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                  textAlign: "center",
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {flashcard.name}
                    </Typography>
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
