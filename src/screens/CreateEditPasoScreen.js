import * as SETTINGS from "../utils/Settings";

import { Alert, StyleSheet, View } from "react-native";
import { Button, Card, TextInput, Title } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../service/firebase";

export default function CreateEditPasoScreen({ navigation, route }) {
  const { pasoId } = route.params || {};
  const [pasoNombre, setPasoNombre] = useState("");
  const [pasoDescripcion, setPasoDescripcion] = useState("");

  useEffect(() => {
    if (pasoId) {
      const fetchPasoData = async () => {
        try {
          const pasoRef = doc(db, "pasos", pasoId);
          const pasoDoc = await getDoc(pasoRef);
          if (pasoDoc.exists()) {
            setPasoNombre(pasoDoc.data().nombre);
            setPasoDescripcion(pasoDoc.data().descripcion || "");
          } else {
            console.log("Paso no encontrado");
          }
        } catch (error) {
          console.error("Error al obtener el paso:", error);
        }
      };

      fetchPasoData();
    }
  }, [pasoId]);

  const handleSavePaso = async () => {
    if (pasoNombre.trim() === "") {
      Alert.alert("Error", "El nombre del paso es obligatorio");
      return;
    }

    try {
      const pasoData = {
        nombre: pasoNombre,
        descripcion: pasoDescripcion,
      };

      if (pasoId) {
        await setDoc(doc(db, "pasos", pasoId), pasoData);
        Alert.alert("Éxito", "Paso actualizado con éxito");
      } else {
        await setDoc(doc(db, "pasos", Date.now().toString()), pasoData);
        Alert.alert("Éxito", "Paso creado con éxito");
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar el paso:", error);
      Alert.alert("Error", "Hubo un problema al guardar el paso");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {pasoId ? "Editar Paso" : "Crear Paso"}
          </Title>

          <TextInput
            label="Nombre del Paso"
            value={pasoNombre}
            onChangeText={setPasoNombre}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Descripción"
            value={pasoDescripcion}
            onChangeText={setPasoDescripcion}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <Button
            mode="contained"
            onPress={handleSavePaso}
            style={styles.button}
          >
            {pasoId ? "Actualizar Paso" : "Crear Paso"}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  card: {
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
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: SETTINGS.COLOURS.textInputBorder,
  },
});
