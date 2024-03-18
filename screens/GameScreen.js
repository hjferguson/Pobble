import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Modal, TextInput, ScrollView } from 'react-native';
import dictionary from '../dictionary.json';
import * as Database from '../database';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const { width } = Dimensions.get('window');
const BOARD_SIZE = 4;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const tileMargin = 2;
const tileWidth = Dimensions.get('window').width / BOARD_SIZE - 10; // Dynamic calculation for tile size



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
  const navigation = useNavigation();
  const [board, setBoard] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // Assuming a 2-minute timer
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [initialsSubmitted, setInitialsSubmitted] = useState(false); //prevent spam submissions
  
  useEffect(() => {
    setBoard(generateBoard());

    const interval = startTimer();
    return () => clearInterval(interval); 
  }, []);

  const rotateBoard = () => {
    const newBoard = board[0].map((val, index) => board.map(row => row[index]).reverse());
    setBoard(newBoard);
  };
  
  const startTimer = () => {
    setTimeLeft(120); 
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsModalVisible(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return interval; 
  };

  const saveScoreToDB = (initials, score) => {
    Database.insertScore(initials, score, () => {
    });
  };

  const onLetterPress = (letter, rowIndex, letterIndex) => {
    const position = `${rowIndex}-${letterIndex}`;
    if (!selectedPositions.includes(position)) {
      setSelectedLetters([...selectedLetters, letter]);
      setSelectedPositions([...selectedPositions, position]);
    }
  };

  const submitWord = () => {
    const word = selectedLetters.join('').toLowerCase();
    if (dictionary.includes(word)) {
      setScore((prevScore) => prevScore + generateScore(word));
    } else {
      Alert.alert("Invalid Word", word);
    }
    setSelectedLetters([]);
    setSelectedPositions([]);
  };

  const generateScore = (word) => {
    // Your scoring logic
    let score = 0;
    if (word.length >= 3) score = word.length - 2;
    return score;
  };

  const playAgain = () => {
    // Navigate back to the MainMenu screen
    navigation.popToTop(); // This assumes MainMenu is the first screen in your stack
  
    // Then navigate back to the GameScreen
    requestAnimationFrame(() => {
      navigation.navigate('Game');
    });
  };
  
  const goToMainMenu = () => {
    setIsModalVisible(false); 
    navigation.navigate('MainMenu');
  };
  
  const submitInitials = () => {
    if (userInitials.trim() === "") {
      Alert.alert("Error", "Please enter your initials.");
      return;
    }};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.timer}>Time Left: {timeLeft}</Text>
      <TouchableOpacity style={styles.rotateButton} onPress={rotateBoard}>
        <MaterialIcons name="rotate-left" size={40} color="white" />
      </TouchableOpacity>


      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((letter, letterIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${letterIndex}`}
                style={styles.tile}
                onPress={() => onLetterPress(letter, rowIndex, letterIndex)}>
                <Text style={styles.letter}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitWord}>
        <Text style={styles.submitButtonText}>Submit Word</Text>
      </TouchableOpacity>
      <Text style={styles.score}>Score: {score}</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Time's up! Enter your initials:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUserInitials}
              value={userInitials}
              maxLength={3}
              autoFocus={true}
              textAlign={'center'}
            />
            {!initialsSubmitted && (
              <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={() => {
                submitInitials();
                saveScoreToDB(userInitials.toUpperCase(), score);
                setInitialsSubmitted(true);
                
              }}>
              <Text style={styles.modalSubmitButtonText}>Submit</Text>
            </TouchableOpacity>
            )}
              
            <TouchableOpacity
              style={styles.modalOptionButton}
              onPress={playAgain}>
              <Text style={styles.modalOptionButtonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOptionButton}
              onPress={goToMainMenu}>
              <Text style={styles.modalOptionButtonText}>Main Menu</Text>
            </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ScrollView>
  );


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20, 
  },
  timer: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  rotateButton: {
    position: 'absolute',
    top: 30,
    left: 15,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center', 
    justifyContent: 'center', 
  },  
  board: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    maxWidth: width, 
    marginVertical: 20, 
  },
  tile: {
    width: tileWidth,
    height: tileWidth,
    margin: tileMargin,
    backgroundColor: '#add8e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20, 
    width: '60%', // Match the width to the board width
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  modalSubmitButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalSubmitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalOptionButton: {
    backgroundColor: '#4CAF50', 
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  modalOptionButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  
});


export default GameScreen;