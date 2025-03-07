import {
  ActivityIndicator,
  Button,
  Text,
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
    if (!nombre || !apellidos || !telefono || !altura || loading) return;
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
      console.error("Error saving costalero: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {isEditing ? "Editar Costalero" : "Añadir Costalero"}
        </Text>

        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Altura (cm)"
          value={altura}
          onChangeText={setAltura}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
      </ScrollView>

      {/* Botón para guardar */}
      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={saveCostalero}
          disabled={loading}
          style={styles.saveButton}
          labelStyle={styles.buttonText}
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
    backgroundColor: "#F7F7F7", // Fondo claro y neutro
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#6200EE", // Morado elegante
    width: "90%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default AddCostaleroScreen;
