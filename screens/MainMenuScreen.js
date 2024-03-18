import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function MainMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 50 }}>Pobble</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.buttonText}>Play Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leaderboard')}>
        <Text style={styles.buttonText}>Leaderboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('About')}>
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 50,
    margin: 10,
    minWidth: 200,
    alignItems: 'center',
    
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainMenuScreen;
