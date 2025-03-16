import * as TEXTS from "./Texts";

import AddEnsayoScreen from "../ensayo/AddEnsayo";
import AddPasoScreen from "../paso/pasoScreen";
import AsignarCostalerosScreen from "../asignacion/AsignarCostalerosScreen";
import CostaleroDetailScreen from "../costaleroDetail/costaleroDetailScreen";
import CostaleroScreen from "../costalero/costaleroScreen";
import EnsayoMenuScreen from "../ensayoMenu/ensayoMenuScreen";
import MainScreen from "../main/mainScreen";
import PasoDetailMenuScreen from "../pasoDetailMenu/pasoDetailMenuScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={TEXTS.SCREENS.MENU_PRINCIPAL}
      component={MainScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.ADD_PASO}
      component={AddPasoScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.ADD_COSTALERO}
      component={CostaleroScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.VER_COSTALEROS}
      component={CostaleroDetailScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.PASO_DETAILS}
      component={PasoDetailMenuScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.ENSAYOS}
      component={EnsayoMenuScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.ADD_ENSAYO}
      component={AddEnsayoScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.ASIGNAR_COSTALEROS}
      component={AsignarCostalerosScreen}
      options={{ headerTitle: "" }}
    />
  </Stack.Navigator>
);

export default StackNavigator;
