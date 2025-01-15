import * as TEXTS from "../utils/Texts";

import AddCostaleroScreen from "../screens/AddCostaleroScreen";
import CostalerosScreen from "../screens/CostalerosScreen";
import CreateEditPasoScreen from "../screens/CreateEditPasoScreen";
import MainScreen from "../screens/MainScreen";
import PasoDetailScreen from "../screens/PasoDetailScreen";
import PasoScreen from "../screens/PasoScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName={TEXTS.SCREENS.main}>
      <Stack.Screen name={TEXTS.SCREENS.main} component={MainScreen} />
      <Stack.Screen
        name={TEXTS.SCREENS.pasoDetail}
        component={PasoDetailScreen}
      />
      <Stack.Screen name={TEXTS.SCREENS.pasoScreen} component={PasoScreen} />
      <Stack.Screen
        name={TEXTS.SCREENS.costalerosScreen}
        component={CostalerosScreen}
      />
      <Stack.Screen
        name={TEXTS.SCREENS.addCostaleroScreen}
        component={AddCostaleroScreen}
      />
      <Stack.Screen
        name={TEXTS.SCREENS.createEditPasoScreen}
        component={CreateEditPasoScreen}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
