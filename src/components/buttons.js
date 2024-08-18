import React from "react";
import { Link } from "react-router-dom";

// Individual button components
// const handleClick = () => {
//   window.location.href = "https://github.com/AhmedB479/Flip-Cards";
// }; // Replace with your GitHub repo URL

const Github = () => (
  <Link to="/sign-up" className="td-n">
    <button className="btn" type="button">
      Get Started
    </button>
  </Link>
);

const DemoBtn = () => (
  <Link to="/dashboard" className="td-n">
    <button className="btn" type="button">
      Demo
    </button>
  </Link>
);

const SecondaryButton = () => (
  <button className="btn btn-secondary">Secondary</button>
);
const DangerButton = () => <button className="btn btn-danger">Danger</button>;

const GeminiBtn = () => (
  <button class="faq-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
    </svg>
    <span class="tooltip">FAQ</span>
  </button>
);

const StartGameBtn = () => (
  <button class="SG_btn">
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      class="SG_sparkle"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>

    <span class="SG_text">Start</span>
  </button>
);
export {
  Github,
  SecondaryButton,
  DangerButton,
  DemoBtn,
  GeminiBtn,
  StartGameBtn,
};
