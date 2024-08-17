import React from "react";
import './profile.css';

const UserProfile = () => {
  return (
    
    <div className="fitCard">
      <div className="user-header">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          height="48"
          width="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.99 38.293C37.785 34.785 34.733 32 31 32H17c-3.735 0-6.786 2.785-6.99 6.293m27.98 0A19.94 19.94 0 0 0 44 24c0-11.046-8.954-20-20-20S4 12.954 4 24a19.94 19.94 0 0 0 6.01 14.293m27.98 0A19.935 19.935 0 0 1 24 44a19.935 19.935 0 0 1-13.99-5.707M30 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke="#B49A18"
          ></path>
        </svg>
        <p className="username">Manpreet</p>
      </div>
      <div className="content-container">
        <div className="steps-container">
          <svg
            className="steps-svg"
            viewBox="0 0 160 160"
            fill="none"
            height="160"
            width="160"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M130.912 130.912a71.997 71.997 0 0 0-10.911-110.778A71.999 71.999 0 0 0 9.383 94.046a72.004 72.004 0 0 0 19.705 36.866"
              stroke-width="16"
              stroke-linecap="round"
              stroke="#EEDC82"
            ></path>
            <path
              d="M146.65 52.764A72.004 72.004 0 0 0 69.647 8.748a71.998 71.998 0 0 0-40.559 122.164"
              className="steps-path"
              pathLength="100"
              stroke-width="16"
              stroke-linecap="round"
              stroke="#B49A18"
            ></path>
          </svg>
          <p className="steps-text">1729/2500 Steps</p>
        </div>
        <div className="info-container">
          <div className="bpm-container group">
            <div className="group-hover-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                height="48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m11 32 7-9 6 9 6-9 5 8h9"
                  stroke-width="4"
                  stroke-miterlimit="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke="#B49A18"
                ></path>
                <path
                  d="M44 19c0-6.075-4.925-11-11-11-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326 1.194-.397 2.562-1.016 4.01-1.826"
                  stroke-width="4"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke="#B49A18"
                ></path>
              </svg>
            </div>
            <p className="group-hover-text">98 bpm</p>
          </div>
          <div className="sleep-container group">
            <div className="group-hover-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                height="48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#a)">
                  <path
                    d="M47.32 28.378a1.776 1.776 0 0 0-1.98-.142c-2.977 1.71-6.122 2.578-9.35 2.578-10.37 0-18.807-8.437-18.807-18.808 0-3.242.869-6.383 2.582-9.336A1.775 1.775 0 0 0 17.738.073 24.833 24.833 0 0 0 5.04 8.7C1.743 12.976 0 18.096 0 23.508c0 13.503 10.985 24.489 24.488 24.489 5.412 0 10.533-1.742 14.81-5.04a24.817 24.817 0 0 0 8.632-12.69 1.774 1.774 0 0 0-.61-1.889ZM24.488 44.446c-11.545 0-20.937-9.393-20.937-20.938 0-7.788 4.457-14.876 11.23-18.438a21.423 21.423 0 0 0-1.149 6.936c0 12.329 10.03 22.36 22.358 22.36a21.49 21.49 0 0 0 6.948-1.154c-3.561 6.775-10.655 11.233-18.45 11.233Z"
                    fill="#B49A18"
                  ></path>
                </g>
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h48v48H0z" fill="#fff"></path>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="group-hover-text">7.5 hrs</p>
          </div>
        </div>
      </div>
      <div className="calories-mood-container">
        <div className="mood-container group">
          <div className="group-hover-icon">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              height="48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
                stroke-width="3"
                stroke-linecap="round"
                stroke="#B49A18"
              ></path>
              <path
                d="M18.804 27a5.999 5.999 0 0 0 10.392 0"
                stroke-width="3"
                stroke-linecap="round"
                stroke="#B49A18"
              ></path>
              <path
                d="M18 15.75h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Zm14 0h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Z"
                stroke-width=".25"
                stroke-linecap="round"
                stroke="#B49A18"
                fill="#B49A18"
              ></path>
            </svg>
          </div>
          <p className="group-hover-text">Happy</p>
        </div>
        <div className="calories-container group">
          <div className="group-hover-icon">
            <svg
              viewBox="0 0 48 52"
              fill="none"
              height="52"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 52s9-8 9-19S24 0 24 0 15 8 15 19s9 19 9 19Z"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#B49A18"
              ></path>
              <path
                d="M24 52v-8"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#B49A18"
              ></path>
              <path
                d="M27 10a3 3 0 0 1-6 0"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#B49A18"
              ></path>
            </svg>
          </div>
          <p className="group-hover-text">850 kcal</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;