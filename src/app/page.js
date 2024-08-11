"use client"
import { useState } from 'react';
import Meal from './meal';

export default function Home() {
  const [showMeal, setShowMeal] = useState(false);

  const handleClick = () => {
    setShowMeal(!showMeal);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleClick}>
        {showMeal ? 'Hide Meal Component' : 'Show Meal Component'}
      </button>
      {showMeal && <Meal />}
    </div>
  );
}
