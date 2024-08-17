import React, { useEffect, useState } from "react";
import { GetLeaderboard } from "./leaderboard";

export default function Ranking() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await GetLeaderboard();
      console.log(data); // Log the entire data array to check its structure
      setLeaderboard(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.username}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
