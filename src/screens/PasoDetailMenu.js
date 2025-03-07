import { Button, Text, useTheme } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import React from "react";

const PasoDetailMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, nombrePaso } = route.params;
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Paso: {nombrePaso}</Text>

        {/* Botones de opciones */}
        <Button
          mode="contained"
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => navigation.navigate("Añadir Paso", { pasoId })}
        >
          Editar Detalles del Paso
        </Button>

        <Button
          mode="contained"
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => navigation.navigate("Añadir Costalero", { pasoId })}
        >
          Añadir Costalero
        </Button>

        <Button
          mode="contained"
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() => navigation.navigate("Ver Costaleros", { pasoId })}
        >
          Ver Costaleros
        </Button>

        <Button
          mode="contained"
          style={styles.optionButton}
          labelStyle={styles.buttonText}
          onPress={() =>
            navigation.navigate("EnsayosMenu", { pasoId, nombrePaso })
          }
        >
          Ensayos
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7", // Fondo claro y neutro
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  optionButton: {
    width: "90%",
    marginBottom: 15,
    backgroundColor: "#6200EE", // Morado elegante
    borderRadius: 10,
    elevation: 2, // Sombra ligera
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default PasoDetailMenu;
