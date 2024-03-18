import React from 'react';
import AppNavigator from './components/AppNavigator';
import * as Database from './database';

export default function App() {

  React.useEffect(() => {
    Database.init();
  }, []);


  return <AppNavigator />;
}