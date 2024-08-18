import { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';

const PointsCounter = () => {
  const [seconds, setSeconds] = useState(60);
  const [timeUp, setTimeUp] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setTimeUp(true);
      setIsActive(false);
    }
    return () => clearInterval(intervalId);
  }, [isActive, seconds]);

  const handleReset = () => {
    setSeconds(60);
    setTimeUp(false);
    setIsActive(false);
  };

  const handleStart = () => {
    if (seconds > 0 && !timeUp) {
      setIsActive(true);
    }
  };

  const getTextColor = () => {
    if (seconds <= 10) return '#ff4d4d'; // Red color
    if (seconds <= 30) return '#ffff00'; // Yellow color
    return '#00bcd4'; // Default cyan color
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Card style={{
        maxWidth: '200px',
        margin: '1rem auto',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)',
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(145deg, rgba(50, 0, 150, 0.3), rgba(0, 50, 150, 0.3))',
        backgroundClip: 'padding-box',
        boxShadow: '0 0 20px rgba(0, 128, 255, 0.6), 0 0 30px rgba(128, 0, 255, 0.6)',
      }}>
        <div style={{
          color: getTextColor(),
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
        }}>
          {timeUp ? "Your time is up" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}
        </div>
      </Card>
      <div>
        <IconButton onClick={handleStart} style={{
          color: '#00bcd4',
          marginRight: '0.5rem',
        }}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton onClick={handleReset} style={{
          color: '#ff4d4d',
        }}>
          <ReplayIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default PointsCounter;
