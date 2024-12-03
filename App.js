import HomeScreen from "./src/components/Home"; // Pantalla principal
import { NavigationContainer } from "@react-navigation/native";
import NewTronoScreen from "./src/components/AddPaso";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewTrono" component={NewTronoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
