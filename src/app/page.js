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
      <h1>Ana Sayfa</h1>
      <p>Baz Alınacak Değerler</p>
      <p>1 insüline eşdeğer karbonhidrat: 15 gr</p>
      <p>1 insüline eşdeğer insülin düzeltme faktörü: 50 mg/dL</p>     
      <p>Sensör değişimine kalan süre: 3 gün</p>
      <h2>Günlük Hedefler</h2>
      <p>Öğleden önce 30 dk, Öğleden sonra 30 dk yürüyüş</p>
      <h3>Butonlar</h3>
      <button onClick={handleClick}>
        {showMeal ? 'Hide Meal Component' : 'Show Meal Component'}
      </button>
      {showMeal && <Meal />}
    </div>
  );
}
