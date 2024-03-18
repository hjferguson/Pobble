import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import * as Database from '../database';

function LeaderboardScreen() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    Database.fetchTopScores(setScores);
  }, []);

  const handleWipeLeaderboard = () => {
    Database.wipeLeaderboard(() => {
      // Optionally, fetch scores again to update the UI
      Database.fetchTopScores(setScores);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{`${item.initials}: ${item.score}`}</Text>
          </View>
        )}
      />
      <Button title="Wipe Leaderboard" onPress={handleWipeLeaderboard} />
    </View>
  );
}

// Styles remain unchanged


const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex in container to expand to the whole screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginTop: 200, // Add some margin at the top
  },
  itemContainer: {
    // Style for each item container
    flexDirection: 'row', // Arrange initials and score in a row
    justifyContent: 'center', // Center item content horizontally
    alignItems: 'center', // Center item content vertically
    padding: 10, // Add some padding for aesthetics
  },
  itemText: {
    // Style for the text of each item
    fontSize: 18, // Increase the font size for better readability
  },
});

export default LeaderboardScreen;
