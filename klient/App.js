import React, { useState, useEffect, createContext } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import AppFAQ from "./AppFAQ";
import TwoFactorPage from "./TwoFactorScreen";
import AddFileName from "./AddFileName";
import FileStore from "./store/FileStore";

const InsideStack = createStackNavigator();
const Stack = createStackNavigator();

export const Context = createContext(null);

function InsideLayout({ setIsLogged }) {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="HomePage">
        {(props) => <HomePage {...props} setIsLogged={setIsLogged} />}
      </InsideStack.Screen>

      <InsideStack.Screen name="AddFileName">
        {(props) => <AddFileName {...props} setIsLogged={setIsLogged} />}
      </InsideStack.Screen>
    </InsideStack.Navigator>
  );
}

function CustomHeader({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeftContainer}>
        <Text style={styles.headerTitle}>Logowanie</Text>
      </View>
      <View style={styles.headerRightContainer}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("AppFAQ")}
        >
          <Text style={styles.headerButtonText}>OpisAplikacji</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const logoutHandler = () => {
    setIsLogged(false);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Context.Provider
      value={{
        files: new FileStore(),
      }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLogged ? "Inside" : "LoginPage"}>
          {isLogged ? (
            <Stack.Screen name="Inside" options={{ headerShown: false }}>
              {(props) => (
                <InsideLayout {...props} setIsLogged={logoutHandler} />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="LoginPage"
                options={({ navigation }) => ({
                  headerTitle: () => <CustomHeader navigation={navigation} />,
                  headerStyle: styles.headerStyle,
                })}
              >
                {(props) => <LoginPage {...props} setIsLogged={setIsLogged} />}
              </Stack.Screen>
              <Stack.Screen
                name="TwoFactorScreen"
                options={({ navigation }) => ({
                  headerTitle: () => <CustomHeader navigation={navigation} />,
                  headerStyle: styles.headerStyle,
                })}
              >
                {(props) => (
                  <TwoFactorPage {...props} setIsLogged={setIsLogged} />
                )}
              </Stack.Screen>
              <Stack.Screen name="RegisterPage">
                {(props) => (
                  <RegisterPage {...props} setIsLogged={setIsLogged} />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="AppFAQ"
                component={AppFAQ}
                options={{ title: "Opis Aplikacji" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 70,
    backgroundColor: "#1F4F53",
    shadowColor: "#000",

    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 80,
  },
  headerRightContainer: {
    justifyContent: "center",
    paddingHorizontal: 80,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
  },
  headerButton: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1F4F53",
    alignItems: "center", // Wyśrodkowanie tekstu w poziomie
  },
  headerButtonText: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
