import { useState, useEffect } from "react";
import Card from "./Card";
import { Grid, Button, Typography } from "@mui/material";
import Timer from "./timer";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { getAuth } from "firebase/auth";
import { StartGameBtn } from "./buttons";

function Cards() {
  const initialItems = [
    { id: 1, img: "/img/card1.jpeg", stat: "" },
    { id: 1, img: "/img/card1.jpeg", stat: "" },
    { id: 2, img: "/img/card2.jpeg", stat: "" },
    { id: 2, img: "/img/card2.jpeg", stat: "" },
    { id: 3, img: "/img/card3.jpeg", stat: "" },
    { id: 3, img: "/img/card3.jpeg", stat: "" },
    { id: 4, img: "/img/card4.jpeg", stat: "" },
    { id: 4, img: "/img/card4.jpeg", stat: "" },
    { id: 5, img: "/img/card5.jpeg", stat: "" },
    { id: 5, img: "/img/card5.jpeg", stat: "" },
    { id: 6, img: "/img/card6.jpeg", stat: "" },
    { id: 6, img: "/img/card6.jpeg", stat: "" },
    { id: 7, img: "/img/card7.jpeg", stat: "" },
    { id: 7, img: "/img/card7.jpeg", stat: "" },
  ].sort(() => Math.random() - 0.5);

  const [items, setItems] = useState(initialItems);
  const [prev, setPrev] = useState(-1);
  const [resetFlip, setResetFlip] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [matchesCount, setMatchesCount] = useState(0);
  const [gamePoints, setGamePoints] = useState(0); // State to hold game points
  const auth = getAuth();
  const user = auth.currentUser;

  async function fetchGamePoints() {
    if (user) {
      const userDoc = doc(firestore, "points", user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setGamePoints(docSnap.data().gamePoints || 0);
      } else {
        setGamePoints(0);
      }
    }
  }

  async function handleWin() {
    setGameMessage("You win!");
    stopGame();
    resetGame();

    if (user) {
      const userDoc = doc(firestore, "points", user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const currentPoints = docSnap.data().gamePoints || 0;
        const newPoints = currentPoints + 10;
        await updateDoc(userDoc, { gamePoints: newPoints });
        setGamePoints(newPoints); // Update the state with new points
      } else {
        await setDoc(userDoc, { gamePoints: 10 });
        setGamePoints(10); // Set the initial points
      }
    }
  }

  function stopGame() {
    setGameStarted(false);
    setTimeout(() => resetGame(), 2000);
  }

  function resetGame() {
    const shuffledItems = [
      { id: 1, img: "/img/card1.jpeg", stat: "" },
      { id: 1, img: "/img/card1.jpeg", stat: "" },
      { id: 2, img: "/img/card2.jpeg", stat: "" },
      { id: 2, img: "/img/card2.jpeg", stat: "" },
      { id: 3, img: "/img/card3.jpeg", stat: "" },
      { id: 3, img: "/img/card3.jpeg", stat: "" },
      { id: 4, img: "/img/card4.jpeg", stat: "" },
      { id: 4, img: "/img/card4.jpeg", stat: "" },
      { id: 5, img: "/img/card5.jpeg", stat: "" },
      { id: 5, img: "/img/card5.jpeg", stat: "" },
      { id: 6, img: "/img/card6.jpeg", stat: "" },
      { id: 6, img: "/img/card6.jpeg", stat: "" },
      { id: 7, img: "/img/card7.jpeg", stat: "" },
      { id: 7, img: "/img/card7.jpeg", stat: "" },
    ].sort(() => Math.random() - 0.5);

    setItems(shuffledItems);
    setPrev(-1);
    setResetFlip(true);
    setMatchesCount(0);
    setTimeUp(false);
    setGameMessage("");
  }

  function check(current) {
    if (items[current].id === items[prev].id) {
      items[current].stat = "correct";
      items[prev].stat = "correct";
      setItems([...items]);
      setPrev(-1);
      setMatchesCount(matchesCount + 1);
    } else {
      items[current].stat = "wrong";
      items[prev].stat = "wrong";
      setItems([...items]);
      setTimeout(() => {
        items[current].stat = "";
        items[prev].stat = "";
        setItems([...items]);
        setPrev(-1);
        setResetFlip(true);
      }, 1000);
    }
  }

  function handleClick(id) {
    if (!gameStarted || timeUp) return;

    if (prev === -1) {
      items[id].stat = "active";
      setItems([...items]);
      setPrev(id);
      setResetFlip(false);
    } else {
      check(id);
    }
  }

  useEffect(() => {
    fetchGamePoints(); // Fetch game points when the component mounts
  }, []);

  useEffect(() => {
    if (timeUp && gameStarted) {
      setGameMessage("Time's up! You lose!");
      stopGame();
      resetGame();
    }
  }, [timeUp, gameStarted]);

  useEffect(() => {
    if (gameStarted && matchesCount === initialItems.length / 2) {
      handleWin();
    }
  }, [matchesCount, gameStarted]);

  return (
    <div className="main_card">
      <div
        style={{
          maxWidth: "120px",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#000",
          color: "#0f0",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 0 10px rgba(148, 0, 211, 0.7)", // Purple color with a high opacity
          border: "2px solid rgba(148, 0, 211, 0.5)", // Purple border with a slightly lower opacity
          backgroundImage:
            "linear-gradient(145deg, rgba(75, 0, 130, 0.5), rgba(148, 0, 211, 0.8))", // Gradient from dark violet to purple
          backgroundClip: "padding-box",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textShadow: "0 0 8px rgba(0, 255, 0, 0.8)",
            color: "white", // Black text color for better readability on white background
            borderRadius: "0.25rem", // Optional: Add some border radius to the background
            padding: "0.25rem 0.5rem", // Optional: Add padding to create space around text
            display: "inline-block", // Ensure background fits tightly around the text
          }}
        >
          {gamePoints}
        </div>
      </div>

      <div>
        <Typography align={"center"} sx={{ margin: "20px" }}>
          <Button
            onClick={() => {
              resetGame(); // Reset the game state
              setGameStarted(true);
              setGameMessage(""); // Clear the message on game start
              setResetFlag(true); // Trigger timer reset
            }}
            disabled={gameStarted}
          >
            <StartGameBtn />
          </Button>
        </Typography>

        {gameStarted && (
          <Timer
            setTimeUp={setTimeUp}
            resetTimer={() => {
              setGameStarted(false);
              setResetFlag(false); // Clear timer reset flag
            }}
            resetFlag={resetFlag} // Pass the reset flag to Timer component
          />
        )}
      </div>
      <div>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {items.map((item, index) => (
            <Grid
              key={index}
              xs={3}
              md={2}
              sx={{
                margin: "5px",
                pointerEvents: gameStarted ? "auto" : "none", // Disable pointer events if game hasn't started
              }}
            >
              <Card
                item={item}
                id={index}
                handleClick={handleClick}
                resetFlip={resetFlip && item.stat !== "correct"}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default Cards;
