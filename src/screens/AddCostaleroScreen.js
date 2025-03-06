import {
  ActivityIndicator,
  Button,
  Card,
  TextInput,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../service/firebase";

const AddCostaleroScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, costaleroId } = route.params || {};
  const theme = useTheme();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [altura, setAltura] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (costaleroId) {
      loadCostaleroData();
    }
  }, [costaleroId]);

  const loadCostaleroData = async () => {
    setLoading(true);
    try {
      const costaleroRef = doc(db, "usuarios", costaleroId);
      const costaleroSnap = await getDoc(costaleroRef);
      if (costaleroSnap.exists()) {
        const data = costaleroSnap.data();
        setNombre(data.nombre);
        setApellidos(data.apellidos);
        setTelefono(data.telefono);
        setAltura(data.altura.toString());
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error loading costalero data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCostalero = async () => {
    if (!nombre || !apellidos || !telefono || !altura) return;
    setLoading(true);
    try {
      if (isEditing) {
        const costaleroRef = doc(db, "usuarios", costaleroId);
        await updateDoc(costaleroRef, {
          nombre,
          apellidos,
          telefono,
          altura: parseInt(altura),
        });
      } else {
        await addDoc(collection(db, "usuarios"), {
          nombre,
          apellidos,
          telefono,
          altura: parseInt(altura),
          pasoId,
          rol: "costalero",
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar el costalero: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Card.Title
            title={isEditing ? "Editar Costalero" : "Añadir Costalero"}
          />
          <Card.Content>
            <TextInput
              label="Nombre"
              value={nombre}
              onChangeText={setNombre}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Apellidos"
              value={apellidos}
              onChangeText={setApellidos}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Altura (cm)"
              value={altura}
              onChangeText={setAltura}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>
      </ScrollView>
      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={saveCostalero}
          disabled={loading}
          style={styles.fixedButton}
        >
          {loading ? (
            <ActivityIndicator animating={true} color="#ffffff" />
          ) : isEditing ? (
            "Actualizar Costalero"
          ) : (
            "Guardar Costalero"
          )}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Espacio para el botón fijo
  },
  input: {
    marginBottom: 10,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  fixedButton: {
    backgroundColor: "#4B0082", // Morado cofrade
  },
});

export default AddCostaleroScreen;
