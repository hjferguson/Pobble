import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Modal, TextInput, ScrollView, PanResponder } from 'react-native';
import dictionary from '../dictionary.json';
import * as Database from '../database';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const { width } = Dimensions.get('window');
const BOARD_SIZE = 4;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const tileMargin = 2;
const tileWidth = Dimensions.get('window').width / BOARD_SIZE - 10; // Dynamic calculation for tile size
const tileHeight = Dimensions.get('window').height / BOARD_SIZE - 10; // Dynamic calculation for tile size



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
  const [isIncorrectSubmission, setIsIncorrectSubmission] = useState(false);
  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const {pageX, pageY} = evt.nativeEvent;
        console.log('Grant:', pageX, pageY);
        selectTileByCoordinates(pageX, pageY);
    },
    onPanResponderMove: (evt) => {
        const {pageX, pageY} = evt.nativeEvent;
        console.log('Move:', pageX, pageY);
        selectTileByCoordinates(pageX, pageY);
    },
    
      onPanResponderRelease: () => {
        submitWord();
        console.log('released finger');
      }
    })
  ).current;

  useEffect(() => {
    setBoard(generateBoard());

    const interval = startTimer();
    return () => clearInterval(interval); 
  }, []);

  const rotateBoard = () => {
    const newBoard = board[0].map((val, index) => board.map(row => row[index]).reverse());
    setBoard(newBoard);
  };

  const handleBoardLayout = (event) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setBoardLayout({x, y, width, height});
    console.log("Board Layout:", {x, y, width, height});
};


const selectTileByCoordinates = (x, y) => {
  // Check if boardLayout and board are defined
  if (!boardLayout || !board) {
    console.warn("Board layout or board data is undefined.");
    return;
  }

  const relativeX = x - boardLayout.x;
  const relativeY = y - boardLayout.y;

  const effectiveTileWidth = tileWidth + (tileMargin * 2);
  const effectiveTileHeight = tileHeight + (tileMargin * 2);

  const tileX = Math.floor(relativeX / effectiveTileWidth);
  const tileY = Math.floor(relativeY / effectiveTileHeight);

  console.log("Calculated Tile:", { tileX, tileY });

  // Check if calculated indices are within the board boundaries
  if (tileX >= 0 && tileX < BOARD_SIZE && tileY >= 0 && tileY < BOARD_SIZE) {
    onLetterPress('A', tileX, tileY); // Placeholder action
  } else {
    console.warn("Calculated tile indices are out of bounds.");
  }
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
    const newPosition = `${rowIndex}-${letterIndex}`;
    console.log(`Attempting to add: ${newPosition}`);
    if (!selectedPositions.includes(newPosition)) {
        setSelectedLetters((prevLetters) => [...prevLetters, letter]);
        setSelectedPositions((prevPositions) => [...prevPositions, newPosition]);
        console.log(`Added: ${newPosition}`);
    }
};

  

  const submitWord = () => {
    const word = selectedLetters.join('').toLowerCase();
    if (dictionary.includes(word)) {
        // Correct word
        setScore((prevScore) => prevScore + generateScore(word));
        setSelectedLetters([]); 
        setSelectedPositions([]); 
    } else {
        // Incorrect word
        setIsIncorrectSubmission(true);
        setTimeout(() => {
            setIsIncorrectSubmission(false);
            setSelectedLetters([]); 
            setSelectedPositions([]); 
        }, 300); 
    }
  };

 


  const generateScore = (word) => {
    //scoring logic
    let score = 0;
    if (word.length >= 2) score = word.length - 2;
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
    
        {/* Attach PanResponder handlers directly to this view */}
        <View 
          style={[styles.board, {borderWidth: 2, borderColor: 'red'}]} onLayout={handleBoardLayout} {...panResponder.panHandlers}>
          
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
                {row.map((letter, letterIndex) => {
                    const position = `${rowIndex}-${letterIndex}`;
                    const isSelected = selectedPositions.includes(position);
                    return (
                        <View
                            key={position}
                            style={[styles.tile, isSelected ? styles.selectedTile : {}]}>
                            <Text style={styles.letter}>{letter}</Text>
                        </View>
                    );
                })}
            </View>
        ))}

        </View>
        
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
  selectedTile: {
    backgroundColor: 'lightgreen', 
  },
  incorrectTile: {
    width: tileWidth,
    height: tileWidth,
    margin: tileMargin,
    backgroundColor: 'red',
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