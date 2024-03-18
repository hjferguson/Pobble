import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import * as Database from '../database';

function LeaderboardScreen() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    Database.fetchTopScores(setScores);
  }, []);

  return (
    <View>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{`${item.initials}: ${item.score}`}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default LeaderboardScreen;
