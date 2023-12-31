import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/guessingGame.module.css'; // Import the CSS module
import Image from 'next/image';
import { useRouter } from 'next/router';

const GuessingGame: React.FC = () => {
 const [dogImage, setDogImage] = useState('');
 const [breedName, setBreedName] = useState('');
 const [userGuess, setUserGuess] = useState('');
 const [attemptsLeft, setAttemptsLeft] = useState(3);
 const [showAnswer, setShowAnswer] = useState(false);
 const [hasSubmitted, setHasSubmitted] = useState(false);
 const router = useRouter();

 const fetchRandomDog = async () => {
   try {
     const response = await axios.get('https://dog.ceo/api/breeds/image/random');
     setDogImage(response.data.message);
     setBreedName(response.data.message.split('/')[4]);
   } catch (error) {
     console.error('Error fetching random dog:', error);
   }
 };

 useEffect(() => {
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
         setTimeout(() => {
           // Refresh the page after 10 seconds
           router.reload();
         }, 10000);
       } else if (attemptsLeft > 1) {
         setAttemptsLeft(attemptsLeft - 1);
         setUserGuess('');
       } else {
         setShowAnswer(true);
       }
     } else {
       alert(`Are you serious right now? ${userGuess} is not a dog name`);
     }
   } catch (error) {
     alert(`Are you serious right now? ${userGuess} is not a dog name`);
   }
 };

 return (
   <div className={styles.container}>
     <h1>Guess the Breed</h1>
     <div className={styles.imageContainer}>
       <Image
         src={dogImage}
         alt="Random dog"
         width={400}
         height={400}
       />
     </div>
     <div className={styles.formContainer}>
       <form onSubmit={handleGuessSubmit}>
         <label htmlFor="userGuess">Guess the breed:</label>
         <input
           id="userGuess"
           type="text"
           value={userGuess}
           onChange={(e) => setUserGuess(e.target.value.toLowerCase().trim())}
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
