import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('pobble.db');

const init = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY NOT NULL, initials TEXT NOT NULL, score INTEGER NOT NULL);',
    );
  });
};

const insertScore = (initials, score, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO scores (initials, score) VALUES (?, ?);',
      [initials, score],
      (_, result) => callback && callback(result),
      (_, error) => console.log(error)
    );
  });
};

const fetchTopScores = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM scores ORDER BY score DESC LIMIT 10;',
      [],
      (_, { rows: { _array } }) => callback && callback(_array),
      (_, error) => console.log(error)
    );
  });
};

export { init, insertScore, fetchTopScores };
