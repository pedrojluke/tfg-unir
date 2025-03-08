import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import StackNavigator from "./src/utils/Navigation";

const App = () => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
);

export default App;
