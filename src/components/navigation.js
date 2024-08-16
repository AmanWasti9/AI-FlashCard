import React from "react";
import "./navigation.css";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div>
      <ul className="example-1">
        <li className="icon-content">
          <Link
            to="/dashboard/"
            aria-label="Spotify"
            data-social="spotify"
            className="link"
          >
            <ion-icon
              name="home-outline"
              style={{
                fontSize: "24px",
              }}
            ></ion-icon>
          </Link>
          <div className="tooltip">Home</div>
        </li>
        <li className="icon-content">
          <Link
            to="/dashboard/game"
            aria-label="Pinterest"
            data-social="pinterest"
            className="link"
          >
            <ion-icon
              name="game-controller-outline"
              style={{
                fontSize: "24px",
              }}
            ></ion-icon>
          </Link>
          <div className="tooltip">Game</div>
        </li>
        <li className="icon-content">
          <Link
            to="/dashboard/flashcards"
            aria-label="Dribbble"
            data-social="dribbble"
            className="link"
          >
            <ion-icon
              name="bookmark-outline"
              style={{
                fontSize: "24px",
              }}
            ></ion-icon>
          </Link>
          <div className="tooltip">Saved</div>
        </li>
        <li className="icon-content">
          <Link
            to="/dashboard/profile"
            aria-label="Telegram"
            data-social="telegram"
            className="link"
          >
            <ion-icon
              name="person-outline"
              style={{
                fontSize: "24px",
              }}
            ></ion-icon>
          </Link>
          <div className="tooltip">Profile</div>
        </li>
      </ul>
    </div>
  );
}
