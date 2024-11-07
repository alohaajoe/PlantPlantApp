import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://192.168.178.38:8000/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Moin!</Text>
      <Text>Wenn ich das hier lese, hat es funktioniert!</Text>
      {data ? <Text>{data.number}</Text> : <Text>Keine Daten</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
