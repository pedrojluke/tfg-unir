import AddCostaleroScreen from "./src/screens/AddCostaleroScreen";
import AddEnsayo from "./src/screens/AddEnsayo";
import AddPasoScreen from "./src/screens/AddPasoScreen";
import EnsayosMenu from "./src/screens/EnsayosMenu";
import MenuScreen from "./src/screens/MenuScreen";
import { NavigationContainer } from "@react-navigation/native";
import PasoDetailMenu from "./src/screens/PasoDetailMenu";
import React from "react";
import VerCostalerosScreen from "./src/screens/VerCostalerosScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menú Principal" component={MenuScreen} />
        <Stack.Screen name="Añadir Paso" component={AddPasoScreen} />
        <Stack.Screen name="Añadir Costalero" component={AddCostaleroScreen} />
        <Stack.Screen name="Ver Costaleros" component={VerCostalerosScreen} />
        <Stack.Screen name="PasoDetailMenu" component={PasoDetailMenu} />
        <Stack.Screen name="EnsayosMenu" component={EnsayosMenu} />
        <Stack.Screen name="AddEnsayo" component={AddEnsayo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
