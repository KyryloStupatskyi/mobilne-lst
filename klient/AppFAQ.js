import React from 'react';
import { StyleSheet, View, Text } from 'react-native'; // Poprawiony import StyleSheet

function AppFAQ() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Opis Aplikacji</Text>
        <View style={styles.text}>
          <Text>Aplikacja typu chmura na pliki</Text>
          <Text>posiada Ekrany:</Text>
          <Text>1. Logowania</Text>
          <Text>2. Rejestracji</Text>
          <Text>3. Opis Aplikacji</Text>
          <Text>4. HomePage - lista wyswietlajaca pliki/foldery</Text>
          <Text>5. Edycja plików</Text>
          <Text>6. Dodawanie/usuwanie plików</Text>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#286269',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
  },
  text1: {
    fontSize: 25,
    color: '#ddd',
    textAlign: 'center',
  },
});

export default AppFAQ;
