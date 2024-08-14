import React from 'react';

// Individual button components
    const handleClick = () => {
      window.location.href = 'https://github.com/AhmedB479/Flip-Cards'; }// Replace with your GitHub repo URL
  
const Github = () => <button class="btn" type='submit' onClick={handleClick}>Button</button>
const SecondaryButton = () => <button className="btn btn-secondary">Secondary</button>;
const DangerButton = () => <button className="btn btn-danger">Danger</button>;

export { Github, SecondaryButton, DangerButton };
