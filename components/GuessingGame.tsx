import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/guessingGame.module.css'; // Import the CSS module

const GuessingGame: React.FC = () => {
 const [dogImage, setDogImage] = useState('');
 const [breedName, setBreedName] = useState('');
 const [userGuess, setUserGuess] = useState('');
 const [attemptsLeft, setAttemptsLeft] = useState(3);
 const [showAnswer, setShowAnswer] = useState(false);
 const [hasSubmitted, setHasSubmitted] = useState(false);

 useEffect(() => {
  const fetchRandomDog = async () => {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      setDogImage(response.data.message);
      setBreedName(response.data.message.split('/')[4]);
    } catch (error) {
      console.error('Error fetching random dog:', error);
    }
  };

  fetchRandomDog();
 }, []);

 const handleGuessSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setHasSubmitted(true);

  try {
    const response = await axios.get(`https://dog.ceo/api/breed/${userGuess}/images/random`);
    if (response.status === 200) {
      if (userGuess.trim().toLowerCase() === breedName.toLowerCase()) {
        setShowAnswer(true);
      } else if (attemptsLeft > 1) {
        setAttemptsLeft(attemptsLeft - 1);
        setUserGuess('');
      } else {
        setShowAnswer(true);
      }
    } else {
      alert('That breed does not exist. Please try again.');
    }
  } catch (error) {
    alert('That breed does not exist. Please try again.');
  }
 };

 return (
  <div className={styles.container}>
    <h1>Guess the Breed</h1>
    <div className={styles.imageContainer}>
      <img src={dogImage} alt="Random dog" />
    </div>
    <div className={styles.formContainer}>
      <form onSubmit={handleGuessSubmit}>
        <label htmlFor="userGuess">Guess the breed:</label>
        <input 
          id="userGuess" 
          type="text" 
          value={userGuess} 
          onChange={(e) => setUserGuess(e.target.value)} 
          className={styles.inputText} 
          disabled={showAnswer} // Disable input if answer is shown
        />
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={showAnswer}
        >
          Submit
        </button>
      </form>
    </div>
    {showAnswer && (
      <p>The correct breed was: {breedName}</p>
    )}
    {hasSubmitted && !showAnswer && attemptsLeft > 0 && (
      <p>Wrong guess! You have {attemptsLeft} attempt(s) left.</p>
    )}
    {!showAnswer && attemptsLeft <= 0 && (
      <p>Sorry, no more attempts left.</p>
    )}
  </div>
 );
};

export default GuessingGame;
