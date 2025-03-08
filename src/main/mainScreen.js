import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { ScrollView, View } from "react-native";

import React from "react";
import { TEXTS } from "./mainHelper";
import styles from "./mainStyles";
import useMain from "./useMain";
import { useNavigation } from "@react-navigation/native";

const MainScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { pasos, loading } = useMain();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{TEXTS.selectStep}</Text>

        {loading ? (
          <ActivityIndicator
            animating
            size={TEXTS.large}
            color={theme.colors.primary}
          />
        ) : pasos.length > 0 ? (
          pasos.map((paso) => (
            <Button
              key={paso.id}
              mode={TEXTS.contained}
              style={styles.pasoButton}
              labelStyle={styles.pasoButtonText}
              onPress={() =>
                navigation.navigate(TEXTS.navigationTarget, {
                  pasoId: paso.id,
                  nombrePaso: paso.nombre,
                })
              }
            >
              {paso.nombre}
            </Button>
          ))
        ) : (
          <Text style={styles.noDataText}>{TEXTS.noSteps}</Text>
        )}
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode={TEXTS.contained}
          onPress={() => navigation.navigate(TEXTS.addStep)}
          style={styles.addButton}
          labelStyle={styles.addButtonText}
        >
          {TEXTS.addStep}
        </Button>
      </View>
    </View>
  );
};

export default MainScreen;
