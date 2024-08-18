import React, { useEffect, useState } from "react";
// import CountUp from "react-countup";

const CircleProgress = ({ value, max, size = 160 }) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Ensure that the client-side rendering handles the progress
    setProgress(value);
  }, [value]);

  const offset = circumference - (progress / max) * circumference;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(0)">
          <stop offset="0%" stopColor="#7e03aa" />
          <stop offset="50%" stopColor="#00fffb" />
          <stop offset="100%" stopColor="violet" />
        </linearGradient>
      </defs>

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e0e0e0"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#gradient)"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="none"
        style={{ transition: "stroke-dashoffset 0.35s" }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize="40px"
        fill="violet"
      >
        {value}
      </text>
    </svg>
  );
};

export default CircleProgress;
