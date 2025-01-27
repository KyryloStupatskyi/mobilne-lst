import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TwoFactorPage({navigation, route, setIsLogged }) {
    const [token, settoken] = useState("");
  
    const handleVerify = async () => {
      try {
        const  response  = await fetch("http://192.168.100.114:3000/api/authRoute/login2fa", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: route.params.email, token }),
        });

        if(!response.ok) console.log("the cyce");
        
        const data = await response.json();
        console.log(data.error);
        console.log(route.params.email," ", token, " token: ", data.jwtToken);
        if (data.jwtToken) {
          await AsyncStorage.setItem("token", data.jwtToken);
          setIsLogged(true);
        } else {
          alert("Invalid 2FA token");
        }
      } catch (error) {
        console.error("2FA error:", error);
        alert("Failed to verify 2FA");
      }
    };
  
    return (
      <View>
        <Text>Enter 2FA token:</Text>
        <TextInput value={token} onChangeText={settoken} keyboardType="numeric" />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    );
  };
  
export default TwoFactorPage;