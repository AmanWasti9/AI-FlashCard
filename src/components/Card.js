import { useState, useEffect } from "react";

function Card({ item, id, handleClick, resetFlip }) {
  const [flipped, setFlipped] = useState(false);
  const itemClass = item.stat ? " active " + item.stat : "";

  const handleCardClick = () => {
    if (!flipped) {
      setFlipped(true);
      handleClick(id);
    }
  };

  useEffect(() => {
    if (resetFlip) {
      setFlipped(false);
    }
  }, [resetFlip]);

  return (
    <img
      className={"card" + itemClass}
      onClick={handleCardClick}
      src={flipped ? item.img : "/img/cardback.jpeg"}
      alt=""
    />
  );
}

export default Card;
