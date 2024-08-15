import React, { useState } from "react";
import "./navigation.css";
import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  personOutline,
  bookmarkOutline,
  imagesOutline,
  settingsOutline,
} from "ionicons/icons";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveLink = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="navigation">
      <ul>
        <li
          className={`list ${activeIndex === 0 ? "active" : ""}`}
          onClick={() => handleActiveLink(0)}
        >
          <Link to="/dashboard">
            <span className="icon">
              <IonIcon icon={homeOutline} />
            </span>
            <span className="text">Home</span>
            <span className="circle"></span>
          </Link>
        </li>
        <li
          className={`list ${activeIndex === 1 ? "active" : ""}`}
          onClick={() => handleActiveLink(1)}
        >
          <Link to="/dashboard/flashcards">
            <span className="icon">
              <IonIcon icon={bookmarkOutline} />
            </span>
            <span className="text">Saved</span>
            <span className="circle"></span>
          </Link>
        </li>
        <li
          className={`list ${activeIndex === 2 ? "active" : ""}`}
          onClick={() => handleActiveLink(2)}
        >
          <Link to="/dashboard/profile">
            <span className="icon">
              <IonIcon icon={personOutline} />
            </span>
            <span className="text">Profile</span>
            <span className="circle"></span>
          </Link>
        </li>

        <div
          className="indicator"
          style={{ transform: `translateX(calc(120px * ${activeIndex}))` }}
        ></div>
      </ul>
    </div>
  );
};

export default Navigation;
