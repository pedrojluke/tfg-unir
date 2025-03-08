import * as TEXTS from "./Texts";

import {
  AddCostaleroScreen,
  AddEnsayoScreen,
  AddPasoScreen,
  AsignarCostalerosScreen,
  EnsayosMenuScreen,
  MenuScreen,
  PasoDetailMenuScreen,
  VerCostalerosScreen,
} from "../screens";

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={TEXTS.SCREENS.MENU_PRINCIPAL} component={MenuScreen} />
    <Stack.Screen name={TEXTS.SCREENS.ADD_PASO} component={AddPasoScreen} />
    <Stack.Screen
      name={TEXTS.SCREENS.ADD_COSTALERO}
      component={AddCostaleroScreen}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.VER_COSTALEROS}
      component={VerCostalerosScreen}
    />
    <Stack.Screen
      name={TEXTS.SCREENS.PASO_DETAILS}
      component={PasoDetailMenuScreen}
    />
    <Stack.Screen name={TEXTS.SCREENS.ENSAYOS} component={EnsayosMenuScreen} />
    <Stack.Screen name={TEXTS.SCREENS.ADD_ENSAYO} component={AddEnsayoScreen} />
    <Stack.Screen
      name={TEXTS.SCREENS.ASIGNAR_COSTALEROS}
      component={AsignarCostalerosScreen}
    />
  </Stack.Navigator>
);

export default StackNavigator;
