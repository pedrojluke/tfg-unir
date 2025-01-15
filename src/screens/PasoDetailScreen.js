import * as SETTINGS from "../utils/Settings";

import { Button, Card, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { deleteDoc, doc } from "firebase/firestore";

import React from "react";
import { db } from "../service/firebase";

export default function PasoDetailScreen({ navigation, route }) {
  const { pasoId, pasoNombre } = route.params;

  const handleDeletePaso = async () => {
    try {
      const pasoDoc = doc(db, "pasos", pasoId);

      await deleteDoc(pasoDoc);

      alert("Paso eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el paso: ", error);
      alert(
        "Hubo un problema al eliminar el paso, por favor intentalo nuevamente"
      );
    } finally {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{pasoNombre}</Title>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("CreateEditPasoScreen", { pasoId })}
        style={styles.button}
      >
        Editar Detalles del Paso
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("EnsayosScreen", { pasoId })}
        style={styles.button}
      >
        Ensayos
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("CostalerosScreen", { pasoId })}
        style={styles.button}
      >
        Listar Costaleros
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddCostaleroScreen", { pasoId })}
        style={styles.button}
      >
        Añadir Costalero
      </Button>

      <Button
        mode="contained"
        onPress={handleDeletePaso}
        style={[styles.button, { backgroundColor: "red" }]}
      >
        Borrar Paso
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 8,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A148C",
    textAlign: "center", // Centrado del nombre del paso
  },
  button: {
    marginTop: 16,
    backgroundColor: SETTINGS.COLOURS.textInputBorder,
  },
});
