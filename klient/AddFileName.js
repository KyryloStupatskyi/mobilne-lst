import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Context } from "./App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddFileName = observer(({ navigation }) => {
  const [fileName, setFileName] = useState("");
  const { files } = useContext(Context);

  const handleAdd = async () => {
    try {
      if (!fileName) {
        Alert.alert("Error", "Please enter a file name.");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found");
      }

      const response = await fetch(
        "http://localhost:3000/api/fileRoute/createDir",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: fileName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      const result = await response.json();

      files.setOne(result);
      navigation.navigate("HomePage");
      Alert.alert("Success", "Folder created successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add File Name</Text>
      <TextInput
        style={styles.input}
        value={fileName}
        onChangeText={setFileName}
        placeholder="Enter file name"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#286269",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddFileName;
