import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Programmed by Harlan Ferguson in Toronto, Canada.
        Made for fun, with love 💗 
      </Text>
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
  text: {
    textAlign: 'center', 
    fontSize: 16, 
    color: '#000', 
  }
});

export default AboutScreen;