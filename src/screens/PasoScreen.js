import * as SETTINGS from "../utils/Settings";

import { Button, Card, Title } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../service/firebase";

export default function PasoScreen({ route, navigation }) {
  const { pasoId } = route.params;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (pasoId) {
      const fetchPaso = async () => {
        const pasoDoc = doc(db, "pasos", pasoId);
        const pasoData = await getDoc(pasoDoc);
        if (pasoData.exists()) {
          setNombre(pasoData.data().nombre);
          setDescripcion(pasoData.data().descripcion);
        }
      };
      fetchPaso();
    }
  }, [pasoId]);

  const handleSave = async () => {
    if (nombre && descripcion) {
      const pasoData = {
        nombre,
        descripcion,
        trabajaderas: [],
      };
      if (pasoId) {
        await setDoc(doc(db, "pasos", pasoId), pasoData);
      } else {
        await setDoc(doc(db, "pasos", new Date().toISOString()), pasoData);
      }
      navigation.goBack();
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {pasoId ? "Editar Paso" : "Crear Paso"}
          </Title>
          <TextInput
            label="Nombre del Paso"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            {pasoId ? "Actualizar Paso" : "Guardar Paso"}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: SETTINGS.COLOURS.textInputBorder,
  },
});
