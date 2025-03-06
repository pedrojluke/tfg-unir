import { Button, Card, useTheme } from "react-native-paper";
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
        <Card>
          <Card.Title title={nombrePaso} titleStyle={styles.title} />
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Añadir Paso", { pasoId })}
              style={styles.button}
            >
              Editar detalles del paso
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate("Añadir Costalero", { pasoId })
              }
              style={styles.button}
            >
              Añadir Costalero
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Ver Costaleros", { pasoId })}
              style={styles.button}
            >
              Ver Costaleros
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate("EnsayosMenu", { pasoId, nombrePaso })
              }
              style={styles.button}
            >
              Ensayos
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#4B0082", // Morado cofrade
  },
});

export default PasoDetailMenu;
