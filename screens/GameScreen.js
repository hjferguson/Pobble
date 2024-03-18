import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import dictionary from '../dictionary.json';

const BOARD_SIZE = 4;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Simplified, consider letter frequency and distribution for a real game




function generateBoard() {
  let board = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      let randomChar = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
      row.push(randomChar);
    }
    board.push(row);
  }
  return board;
}

function GameScreen() {
  const [board, setBoard] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [score, setScore] = useState(0);


  useEffect(() => {
    setBoard(generateBoard());
  }, []);

 const onLetterPress = (letter, rowIndex, letterIndex) => {
  const position = `${rowIndex}-${letterIndex}`;
  if (!selectedPositions.includes(position)) {
    setSelectedLetters([...selectedLetters, letter]);
    setSelectedPositions([...selectedPositions, position]);
  }
};

const submitWord = () => {
  const word = selectedLetters.join('').toLowerCase();
  if (isWordInDictionary(word)) {
    
    setScore((prevScore) => prevScore + generateScore(word));
    //Alert.alert("Valid Word", `Score for this word: ${generateScore(word)}`);
  } else {
    Alert.alert("Invalid Word", word);
  }
  // Reset selections for the next word
  setSelectedLetters([]);
  setSelectedPositions([]);
};


const isWordInDictionary = (word) => {
  return dictionary.includes(word.toLowerCase());
};

const generateScore = (word) => {
  let score = 0;
  if (word.length === 2 || word.length === 3) {
    score = 1;
  } else if (word.length === 4) {
    score = 2;
  } else if (word.length === 5) {
    score = 3;
  } else if (word.length === 6) {
    score = 5;
  } else if (word.length >= 7) {
    score = 10;
  }
  return score;
}
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((letter, letterIndex) => (
              <TouchableOpacity
              key={`letter-${rowIndex}-${letterIndex}`}
              style={styles.tile}
              onPress={() => onLetterPress(letter, rowIndex, letterIndex)}
              >
            
                <Text style={styles.letter}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
        <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={submitWord}>
          <Text style={styles.submitButtonText}>Submit Word</Text>
        </TouchableOpacity>
      </View>
      <Text>Score: {score}</Text>

    </View>
  );
}

const tileWidth = Dimensions.get('window').width / BOARD_SIZE - 10; // Dynamic calculation for tile size

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: '90%',
    aspectRatio: 1, // Keep the board square
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 2,
  },
  tile: {
    width: tileWidth,
    height: tileWidth,
    backgroundColor: '#add8e6',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  submitButtonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  
});

export default GameScreen;