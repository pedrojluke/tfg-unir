import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import React from "react";
import StackNavigator from "./src/utils/Navigation";

const App = () => (
  <PaperProvider>
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  </PaperProvider>
);

export default App;
