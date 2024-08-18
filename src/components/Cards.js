import { useState } from "react";
import Card from "./Card";
import { Grid } from "@mui/material";

function Cards() {
  const [items, setItems] = useState(
    [
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
    ].sort(() => Math.random() - 0.5)
  );

  const [prev, setPrev] = useState(-1);
  const [resetFlip, setResetFlip] = useState(false);

  function check(current) {
    if (items[current].id === items[prev].id) {
      // Mark both items as correct and ensure they remain flipped
      items[current].stat = "correct";
      items[prev].stat = "correct";
      setItems([...items]);
      setPrev(-1);
    } else {
      // Mark both items as wrong, then reset their status after a delay
      items[current].stat = "wrong";
      items[prev].stat = "wrong";
      setItems([...items]);
      setTimeout(() => {
        items[current].stat = "";
        items[prev].stat = "";
        setItems([...items]);
        setPrev(-1);
        setResetFlip(true); // Trigger flip reset only for incorrect pair
      }, 1000);
    }
  }

  function handleClick(id) {
    if (prev === -1) {
      items[id].stat = "active";
      setItems([...items]);
      setPrev(id);
      setResetFlip(false); // Reset flipping only for the current selection
    } else {
      check(id);
    }
  }

  return (
    <div className="main_card">
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
            }}
          >
            <Card
              item={item}
              id={index}
              handleClick={handleClick}
              resetFlip={resetFlip && item.stat !== "correct"} // Reset only if the card is not correct
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Cards;
