import React from "react";
import { Link } from "react-router-dom";

// Individual button components
// const handleClick = () => {
//   window.location.href = "https://github.com/AhmedB479/Flip-Cards";
// }; // Replace with your GitHub repo URL

const Github = () => (
  <Link to="/sign-up" className="td-n">
    <button className="btn" type="button">
      Button
    </button>
  </Link>
);
const SecondaryButton = () => (
  <button className="btn btn-secondary">Secondary</button>
);
const DangerButton = () => <button className="btn btn-danger">Danger</button>;

export { Github, SecondaryButton, DangerButton };
