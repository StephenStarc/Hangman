import { useState } from "react"
import { useEffect } from "react"
import {showNotification as show} from "./helpers/helpers"
import { checkWin } from "./helpers/helpers"
const words = ['application','programming','interface','wizard']
    let selectedWord = words[Math.floor(Math.random() * words.length)]

export default function Main(){
    

    const [playable, setPlayable] = useState(true)
    const [correctLetters, setCorrectLetters] = useState([])
    const [wrongLetters, setWrongLetters] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    
    useEffect(() => {
        const handleKeydown = event => {
          const { key, keyCode } = event;
          console.log(key)
          console.log(keyCode);
          console.log(event);
          if (playable && keyCode >= 65 && keyCode <= 90) {
            const letter = key.toLowerCase();
            if (selectedWord.includes(letter)) {
              if (!correctLetters.includes(letter)) {
                setCorrectLetters(currentLetters => [...currentLetters, letter]);
              } else {
                show(setShowNotification);
              }
            } else {
              if (!wrongLetters.includes(letter)) {
                setWrongLetters(currentLetters => [...currentLetters, letter]);
              } else {
                show(setShowNotification);
              }
            }
          }
        }
        window.addEventListener('keydown', handleKeydown);
    
        return () => window.removeEventListener('keydown', handleKeydown);
      }, [correctLetters, wrongLetters, playable]);
    
      const errors = wrongLetters.length

      let finalMessage = ''
      let finalMessageRevealWord = ''
      let stillplayAble = true

     if(checkWin(correctLetters, wrongLetters, selectedWord) === 'win'){
        finalMessage = 'congratulations! You Won'
        stillplayAble = false
      }else if (checkWin(correctLetters, wrongLetters, selectedWord) === 'lose') {
        finalMessage = 'Unfortunately! You Lost'
        finalMessageRevealWord = `... the word was: ${selectedWord}`
        stillplayAble = false
      }

      useEffect(() => setPlayable(playable))

      function playAgain(){
        setPlayable(true)

        setCorrectLetters([])
        setWrongLetters([])
        const random = Math.floor(Math.random() * words.length)
        selectedWord = words[random]
      }
    return(
        <>
        <h1>Hangman</h1>
        <p>Find the hidden Word - Enter a letter</p>
        <div className="game-container">
        <div className="worng-letters-container">
                <div id="wrong-letters">
                    {wrongLetters.length > 0 && <p>wrong</p>}
                    {wrongLetters
                    .map((letter, i)=> <span key={i}>{letter}</span>)
                    .reduce((prev, curr) => prev == null ? curr : [prev, ',', curr], null)}
                </div>
            </div>
            <svg className="figure-container" height='250' width='200'>
                {/* ------ROD------ */}
                <line x1='60' y1='20' x2='140' y2='20'></line>
                <line x1='140' y1='20' x2='140' y2='50'></line>
                <line x1='60' y1='20' x2='60' y2='230'></line>
                <line x1='20' y1='230' x2='100' y2='230'></line>
           
          {/* <!-- Head --> */}
      {errors > 0 &&
        <circle cx="140" cy="70" r="20" />
      }
      {/* <!-- Body --> */}
      {errors > 1 &&
        <line x1="140" y1="90" x2="140" y2="150" />
      }
      {/* <!-- Arms --> */}
      {errors > 2 &&
        <line x1="140" y1="120" x2="120" y2="100" />
      }
      {errors > 3 &&
        <line x1="140" y1="120" x2="160" y2="100" />
      }
      {/* <!-- Legs --> */}
      {errors > 4 &&
        <line x1="140" y1="150" x2="120" y2="180" />
      }
      {errors > 5 &&
        <line x1="140" y1="150" x2="160" y2="180" />
      }
            </svg>

            

            <div className="word" id="word">
                {selectedWord.split('').map((letter, i) => (
                    <span className="letter" key={i}>
                        {correctLetters.includes(letter) ? letter: ''}
                    </span>
                ))}
            </div>

            <div className="popup-container" style={finalMessage != '' ? {display:'flex'} : {}}>
                <div className="popup">
                    <h2 >{finalMessage}</h2>
                    <h4>{finalMessageRevealWord}</h4>
                    <button onClick={playAgain}>Play Again</button>
                </div>
            </div> 
        </div>
        <div className={`notification-container ${showNotification ? 'show' : ''}`}>
                <p>You have Already entered this letter</p>
        </div>
        </>
    )
}