import { Appbar, Button, TextInput } from "react-native-paper";
import React, { useState } from "react";

import { View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { style } from "./addPasoStyle";

export default function NewTronoScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [trabajaderas, setTrabajaderas] = useState("");

  const handleSave = async () => {
    if (!nombre || !trabajaderas) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await firestore()
        .collection("tronos")
        .add({
          nombre,
          trabajaderas: parseInt(trabajaderas, 10),
        });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el trono.");
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nuevo Trono" />
      </Appbar.Header>
      <View style={style.container}>
        <TextInput
          label="Nombre del Trono"
          value={nombre}
          onChangeText={setNombre}
          style={style.input}
        />
        <TextInput
          label="Número de Trabajaderas"
          value={trabajaderas}
          onChangeText={setTrabajaderas}
          keyboardType="numeric"
          style={style.input}
        />
        <Button mode="contained" onPress={handleSave}>
          Guardar
        </Button>
      </View>
    </>
  );
}
