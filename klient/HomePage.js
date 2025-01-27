import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { observer } from "mobx-react-lite";
import { Context } from "./App";

const HomePage = observer(({ setIsLogged, navigation }) => {
  const { files } = useContext(Context);

  useEffect(() => {
    fetchFilesAndFolders();
  }, []);

  const fetchFilesAndFolders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "http://localhost:3000/api/fileRoute/getFiles",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      files.setFiles(result);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAddFolder = () => {
    navigation.navigate("AddFileName");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setIsLogged(false);
      Alert.alert("Success", "Logged out successfully!");
    } catch (error) {
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  const handleFilePress = (item) => {
    Alert.alert("File Pressed", `You pressed ${item.name}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleFilePress(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Page!</Text>
      <Text style={styles.subtitle}>You are now logged in.</Text>

      <FlatList
        data={files.getFiles()}
        keyExtractor={(item) => +item.id}
        renderItem={renderItem}
        style={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddFolder}>
        <Text style={styles.addButtonText}>Add Folder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#286269", // Tło aplikacji
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 30,
    textAlign: "center",
  },
  list: {
    flex: 1,
    width: "100%",
    marginBottom: 30,
  },
  item: {
    padding: 20,
    backgroundColor: "#f0f0f0", // Jasne tło elementu
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "#F44336", // Kolor przycisku dodawania folderu
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginBottom: 15,
    elevation: 3,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#F44336", // Kolor przycisku wylogowania
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomePage;
