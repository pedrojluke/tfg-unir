import * as SETTINGS from "../utils/Settings";

import { Button, Card, Text, TextInput, Title } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { addDoc, collection } from "firebase/firestore";

import { db } from "../service/firebase";

export default function AddCostaleroScreen({ navigation, route }) {
  const { pasoId } = route.params;
  const [newCostalero, setNewCostalero] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    altura: "1.44",
  });

  const handleSaveCostalero = async () => {
    if (
      newCostalero.nombre &&
      newCostalero.apellidos &&
      newCostalero.telefono &&
      newCostalero.altura
    ) {
      const costalerosCollection = collection(db, "costaleros");
      await addDoc(costalerosCollection, {
        ...newCostalero,
        pasoId,
      });
      alert("guardado con exito hno");
      setNewCostalero({
        nombre: "",
        apellidos: "",
        telefono: "",
        altura: "1.44",
      });

      navigation.goBack();
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Añadir Costalero</Title>

          <TextInput
            label="Nombre"
            value={newCostalero.nombre}
            onChangeText={(text) =>
              setNewCostalero({ ...newCostalero, nombre: text })
            }
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: SETTINGS.COLOURS.textInputBorder } }}
          />

          <TextInput
            label="Apellidos"
            value={newCostalero.apellidos}
            onChangeText={(text) =>
              setNewCostalero({ ...newCostalero, apellidos: text })
            }
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: SETTINGS.COLOURS.textInputBorder } }}
          />

          <View style={styles.rowContainer}>
            <TextInput
              label="Teléfono"
              value={newCostalero.telefono}
              onChangeText={(text) =>
                setNewCostalero({ ...newCostalero, telefono: text })
              }
              style={[styles.input, styles.rowInput]}
              mode="outlined"
              keyboardType="phone-pad"
              maxLength={9}
              theme={{ colors: { primary: SETTINGS.COLOURS.textInputBorder } }}
            />

            <TextInput
              label="Altura"
              value={newCostalero.altura}
              onChangeText={(text) =>
                setNewCostalero({ ...newCostalero, altura: text })
              }
              style={[styles.input, styles.rowInput]}
              mode="outlined"
              keyboardType="numeric"
              theme={{ colors: { primary: SETTINGS.COLOURS.textInputBorder } }}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSaveCostalero}
            style={styles.addButton}
            labelStyle={styles.buttonText}
          >
            <Text>Guardar Costalero</Text>
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
    backgroundColor: "#F1F1F1",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 8,
    backgroundColor: "#fff",
    borderColor: "#DDD",
    borderWidth: 1,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: SETTINGS.COLOURS.textInputBorder,
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    width: "48%",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: SETTINGS.COLOURS.textInputBorder,
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
