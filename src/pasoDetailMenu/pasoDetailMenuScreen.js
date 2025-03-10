import { Button, Text } from "react-native-paper";
import { CSS, TEXTS } from "./pasoDetailMenuHelper";
import { ScrollView, View } from "react-native";

import React from "react";
import { styles } from "./pasoDetailMenuStyles";
import { usePasoDetailMenu } from "./usePasoDetailMenu.js";

const PasoDetailMenuScreen = () => {
  const { nombrePaso, handleNavigation } = usePasoDetailMenu();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {TEXTS.pasoLabel} {nombrePaso}
        </Text>

        <Button
          mode={CSS.contained}
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => handleNavigation(TEXTS.addPaso)}
        >
          {TEXTS.editPaso}
        </Button>

        <Button
          mode={CSS.contained}
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => handleNavigation(TEXTS.addCostalero)}
        >
          {TEXTS.addCostalero}
        </Button>

        <Button
          mode={CSS.contained}
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => handleNavigation(TEXTS.viewCostalero)}
        >
          {TEXTS.viewCostaleros}
        </Button>

        <Button
          mode={CSS.contained}
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => handleNavigation(TEXTS.menuEnsayos, { nombrePaso })}
        >
          {TEXTS.ensayos}
        </Button>
      </ScrollView>
    </View>
  );
};

export default PasoDetailMenuScreen;
