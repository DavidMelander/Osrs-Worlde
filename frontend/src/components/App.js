import React, { useState, useEffect } from 'react';
import { fetchOSRSWords } from '../api/api';
import '../App.css';
import '../components/Wordle.css';


const MAX_ATTEMPTS = 5;

const App = () => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [input, setInput] = useState('');
  const [lives, setLives] = useState(MAX_ATTEMPTS);
  const [guesses, setGuesses] = useState([]);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [incorrectGuess, setIncorrectGuess] = useState(false);

  const fetchWord = async () => {
    const fetchedWord = await fetchOSRSWords();
    if (fetchedWord && fetchedWord.word && fetchedWord.hint) {
      setWord(fetchedWord.word);
      setHint(fetchedWord.hint);
      setLives(MAX_ATTEMPTS);
      setInput('');
      setGuesses([]);
      setCompleted(false);
    } else {
      console.error('Fetched word is not valid:', fetchedWord);
      setWord('osrs');
      setHint('Default hint');
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    if (completed) {
      setStreak(streak + 1);
      fetchWord();
      setInput('');
      setLives(MAX_ATTEMPTS);
      setGuesses([]);
      setShowHint(false);
      setCorrectGuess(false);
      setIncorrectGuess(false);
    }
  }, [completed]);

  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z\s-]/g, '');
    setInput(capitalizeFirstLetter(sanitizedValue));
  };

  const handleGuess = () => {
    const cleanedWord = word.replace(/[\s-]/g, '');
    const cleanedGuess = input.replace(/[\s-]/g, '');
  
    if (cleanedGuess.length !== cleanedWord.length) {
      alert(`Guess should be ${cleanedWord.length} characters long`);
      return;
    }
  
    const newGuesses = [...guesses];
    const guessResult = [];
  
    for (let i = 0, j = 0; i < word.length; i++) {
      if (word[i] === ' ' || word[i] === '-') {
        guessResult.push({ letter: word[i], color: 'neutral' });
      } else {
        if (cleanedGuess[j] === word[i]) {
          guessResult.push({ letter: cleanedGuess[j], color: 'green' });
        } else if (cleanedWord.includes(cleanedGuess[j])) {
          guessResult.push({ letter: cleanedGuess[j], color: 'yellow' });
        } else {
          guessResult.push({ letter: cleanedGuess[j], color: 'gray' });
        }
        j++;
      }
    }
  
    newGuesses.push(guessResult);
    setGuesses(newGuesses);
    setInput('');
  
    if (cleanedGuess === cleanedWord) {
      setTimeout(() => { setCompleted(true); }, 3000);setTimeout(() => { setCompleted(true); }, 3000);
      setCorrectGuess(true);
      setShowHint(false);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 3) {
        setShowHint(true);
      }
      if (newLives === 0) {
        setIncorrectGuess(true);
        setShowHint(false);
      }
    }
  };
  

  const handleRestart = () => {
    setInput('');
    setCompleted(false);
    fetchWord();
    setLives(MAX_ATTEMPTS);
    setGuesses([]);
    setStreak(0);
    setShowHint(false);
    setIncorrectGuess(false);
    setCorrectGuess(false);
  };

  const getMaxLength = () => {
    return word.length;
  };

  const renderWordDisplay = () => {
    return Array.from(word).map((char, index) => {
      if (char === ' ') {
        return <div key={index} className="guess-cell space" />;
      }
      if (char === '-') {
        return <div key={index} className="guess-cell hyphen">-</div>;
      }

      const guessedChar = input[index] || '';

      return <div key={index} className="guess-cell">{guessedChar || ''}</div>;
    });
  };

  const renderGuesses = () => {
    return guesses.map((guess, index) => (
      <div key={index} className="guess-row">
        {guess.map((g, idx) => (
          <div key={idx} className={`guess-cell ${g.color}`}>
            {g.letter}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="app app-background">
      <h1 style={{ textShadow: "#000000 2px 2px", marginTop: "0px", padding: "4px" }}>OSRS Wordle</h1>
      {showHint && <p className='hint-text'>Hint: {hint}</p>}
      {incorrectGuess && <p className='hint-text'>Correct: {word}</p>}
      {correctGuess && <p className='hint-text'>Correct Well Done!</p>}
      <div className="guess-grid">
        <div className="guess-row">
          {renderWordDisplay()}
        </div>
        {renderGuesses()}
      </div>
      <div className='guess-div'>
        <input 
          placeholder='Enter your guess here...'
          type="text" 
          value={input} 
          onChange={handleInputChange} 
          maxLength={getMaxLength()}  // Max length adjusted for total length including spaces and hyphens
          className='guess-input_text'
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGuess();
            }
          }}
        />
        <button className='guess-button' onClick={handleGuess}>Guess</button>
      </div>
      <p style={{ textShadow: "#000000 2px 2px", fontWeight: "bold", fontSize: "20px" }}>Lives: {lives}</p>
      <p style={{ textShadow: "#000000 2px 2px", fontWeight: "bold", fontSize: "16px" }}>Hot Streak: {streak}</p>
      <button className='restart-button' onClick={handleRestart}>Restart</button>
    </div>
  );
};

export default App;
