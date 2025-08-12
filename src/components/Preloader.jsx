import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="wager-text">
        {'WAGER'.split('').map((letter, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
