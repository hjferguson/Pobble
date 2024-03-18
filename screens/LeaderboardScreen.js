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


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 200, 
  },
  itemContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10, 
  },
  itemText: {
    fontSize: 18, 
  },
});

export default LeaderboardScreen;